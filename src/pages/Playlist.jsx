import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PlaylistDetail from '../components/Common/PlaylistDetail';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Playlist = () => {
  const navigate = useNavigate();
  const { id: playlistId } = useParams();
  const [playlistDetail, setPlaylistDetail] = useState(null);
  const [requestState, setRequestState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistError, setPlaylistError] = useState(null);

  const PLAYLIST_DETAIL_API_URL =
    import.meta.env.VITE_PLAYLIST_DETAIL_API_URL ||
    'http://31.97.110.129:7001/api/vv1/category/collections/album-playlist-by-id';

  const fetchJson = useCallback(async (url, signal) => {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const text = await response.text();
    const trimmedText = text.trimStart();

    if (trimmedText.startsWith('<')) {
      throw new Error(`Expected JSON from ${url}, received HTML instead`);
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      const error = new Error(`Invalid JSON from ${url}: ${parseError.message}`);
      error.cause = parseError;
      throw error;
    }
  }, []);

  const loadPlaylistDetail = useCallback(
    async (signal) => {
      if (!playlistId) {
        setRequestState('error');
        setErrorMessage('Missing playlist id');
        return;
      }

      setRequestState('loading');
      setErrorMessage('');
      setPlaylistLoading(true);
      setPlaylistError(null);

      try {
        const detailUrl = `${PLAYLIST_DETAIL_API_URL}/${playlistId}`;
        const json = await fetchJson(detailUrl, signal);

        if (!json?.data?.success && json?.data?.status !== false) {
          throw new Error(json?.data?.message || 'Failed to fetch playlist details');
        }

        const data = json?.data?.data || json?.data;
        setPlaylistDetail({
          collection: data.collection,
          songs: Array.isArray(data.songs) ? data.songs : [],
        });
        setRequestState('success');
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        console.error('Failed to load playlist detail:', error);
        setPlaylistError(error?.message || 'Failed to load playlist details');
        setErrorMessage(error?.message || 'Failed to load playlist details');
        setRequestState('error');
      } finally {
        setPlaylistLoading(false);
      }
    },
    [PLAYLIST_DETAIL_API_URL, fetchJson, playlistId],
  );

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        loadPlaylistDetail(controller.signal);
      }
    });

    return () => {
      controller.abort();
    };
  }, [loadPlaylistDetail]);

  if (requestState === 'loading' && !playlistDetail) {
    return (
      <div className="min-h-[60svh] pt-10 pb-36 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (requestState === 'error' && !playlistDetail) {
    return (
      <div className="px-4 pb-36 text-white/80">
        <p className="mb-3">{errorMessage || 'Unable to load playlist details.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-full border border-white/30 text-sm hover:bg-white/10 transition"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!playlistDetail) {
    return null;
  }

  return (
    <PlaylistDetail
      collection={playlistDetail.collection}
      songs={playlistDetail.songs}
      onBack={() => navigate(-1)}
      loading={playlistLoading}
      error={playlistError}
    />
  );
};

export default Playlist;
