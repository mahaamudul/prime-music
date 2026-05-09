import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const decodeHtmlEntities = (value) => {
  if (!value) return ''

  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

const audioProxyPlugin = () => ({
  name: 'audio-proxy',
  configureServer(server) {
    server.middlewares.use('/audio-proxy', async (req, res, next) => {
      try {
        const requestUrl = new URL(req.url, 'http://localhost')
        const targetUrl = decodeHtmlEntities(requestUrl.searchParams.get('url'))

        if (!targetUrl) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: 'Missing url query parameter' }))
          return
        }

        const rangeHeader = req.headers.range
        const origin = new URL(targetUrl).origin
        const upstreamHeaders = {
          Accept: 'audio/*,*/*;q=0.8',
        }

        if (rangeHeader) {
          upstreamHeaders.Range = rangeHeader
        }

        let upstreamResponse = await fetch(targetUrl, {
          headers: upstreamHeaders,
        })

        if (upstreamResponse.status === 403 && rangeHeader) {
          delete upstreamHeaders.Range
          upstreamResponse = await fetch(targetUrl, {
            headers: upstreamHeaders,
          })
        }

        if (!upstreamResponse.ok || !upstreamResponse.body) {
          res.statusCode = upstreamResponse.status || 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: `Audio upstream request failed with status ${upstreamResponse.status}` }))
          return
        }

        res.statusCode = upstreamResponse.status

        const contentType = upstreamResponse.headers.get('content-type')
        if (contentType) {
          res.setHeader('Content-Type', contentType)
        }

        const acceptRanges = upstreamResponse.headers.get('accept-ranges')
        if (acceptRanges) {
          res.setHeader('Accept-Ranges', acceptRanges)
        } else {
          res.setHeader('Accept-Ranges', 'bytes')
        }

        const contentRange = upstreamResponse.headers.get('content-range')
        if (contentRange) {
          res.setHeader('Content-Range', contentRange)
        }

        const contentLength = upstreamResponse.headers.get('content-length')
        if (contentLength) {
          res.setHeader('Content-Length', contentLength)
        }

        const cacheControl = upstreamResponse.headers.get('cache-control')
        if (cacheControl) {
          res.setHeader('Cache-Control', cacheControl)
        } else {
          res.setHeader('Cache-Control', 'no-store')
        }

        const lastModified = upstreamResponse.headers.get('last-modified')
        if (lastModified) {
          res.setHeader('Last-Modified', lastModified)
        }

        const etag = upstreamResponse.headers.get('etag')
        if (etag) {
          res.setHeader('ETag', etag)
        }

        res.setHeader('Access-Control-Allow-Origin', '*')

        const reader = upstreamResponse.body.getReader()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          res.write(Buffer.from(value))
        }

        res.end()
      } catch (error) {
        next(error)
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), audioProxyPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://31.97.110.129:7001',
        changeOrigin: true,
      },
    },
  },
})
