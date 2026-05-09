const decodeHtmlEntities = (value) => {
  if (!value) return '';

  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

const copyHeaderIfPresent = (res, upstreamResponse, source, target = source) => {
  const value = upstreamResponse.headers.get(source);
  if (value) {
    res.setHeader(target, value);
  }
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range,Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET,HEAD,OPTIONS');
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const rawUrl = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url;
    const targetUrl = decodeHtmlEntities(rawUrl);

    if (!targetUrl) {
      res.status(400).json({ message: 'Missing url query parameter' });
      return;
    }

    let parsed;
    try {
      parsed = new URL(targetUrl);
    } catch {
      res.status(400).json({ message: 'Invalid url query parameter' });
      return;
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      res.status(400).json({ message: 'Only http/https URLs are allowed' });
      return;
    }

    const upstreamHeaders = {
      Accept: 'audio/*,*/*;q=0.8',
    };
    if (req.headers.range) {
      upstreamHeaders.Range = req.headers.range;
    }

    let upstreamResponse = await fetch(parsed.toString(), {
      method: req.method,
      headers: upstreamHeaders,
      redirect: 'follow',
    });

    if (upstreamResponse.status === 403 && req.headers.range) {
      delete upstreamHeaders.Range;
      upstreamResponse = await fetch(parsed.toString(), {
        method: req.method,
        headers: upstreamHeaders,
        redirect: 'follow',
      });
    }

    res.status(upstreamResponse.status);

    copyHeaderIfPresent(res, upstreamResponse, 'content-type', 'Content-Type');
    copyHeaderIfPresent(res, upstreamResponse, 'content-range', 'Content-Range');
    copyHeaderIfPresent(res, upstreamResponse, 'content-length', 'Content-Length');
    copyHeaderIfPresent(res, upstreamResponse, 'etag', 'ETag');
    copyHeaderIfPresent(res, upstreamResponse, 'last-modified', 'Last-Modified');
    copyHeaderIfPresent(res, upstreamResponse, 'cache-control', 'Cache-Control');

    const acceptRanges = upstreamResponse.headers.get('accept-ranges');
    res.setHeader('Accept-Ranges', acceptRanges || 'bytes');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'HEAD' || !upstreamResponse.body) {
      res.end();
      return;
    }

    for await (const chunk of upstreamResponse.body) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error('audio-proxy error:', error);
    if (!res.headersSent) {
      res.status(502).json({ message: 'Audio proxy failed' });
      return;
    }
    res.end();
  }
}
