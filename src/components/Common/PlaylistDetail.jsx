import React, { useContext, useState } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  Music,
  Shuffle,
  Heart,
  MoreVertical,
  Repeat,
  SkipBack,
  SkipForward,
  Share2,
  Download,
  Bookmark,
} from 'lucide-react';
import { MusicPlayerContext } from '../../contexts/MusicPlayerContext';

const PlaylistDetail = ({ 
  collection, 
  songs, 
  onBack, 
  loading = false,
  error = null 
}) => {
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = useContext(MusicPlayerContext);
  const [isPlayingAllSongs, setIsPlayingAllSongs] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDesktopShuffle, setIsDesktopShuffle] = useState(false);

  const parseColor = (colorStr) => {
    if (!colorStr) return '#1a1a1a';
    const hex = colorStr.replace('0xFF', '#').replace('0xff', '#');
    return hex.length === 7 ? hex : '#1a1a1a';
  };

  const handlePlayAllClick = () => {
    if (songs.length === 0) return;
    
    if (isPlayingAllSongs && isPlaying) {
      pauseSong();
    } else if (isPlayingAllSongs && !isPlaying) {
      resumeSong();
    } else {
      // Start from first song
      setIsPlayingAllSongs(true);
      playSong(songs[0], songs, collection);
    }
  };

  const handleSongClick = (song) => {
    playSong(song, songs, collection);
    setIsPlayingAllSongs(true);
  };

  const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const bgColor = parseColor(collection?.domainant_color || collection?.dominant_color);
  const songCount = Array.isArray(songs) ? songs.length : 0;
  const totalDurationMs = Array.isArray(songs) ? songs.reduce((sum, s) => sum + (s.duration || 0), 0) : 0;

  const artistName = (song) => song?.artist?.name || song?.artist_name || 'Unknown artist';
  const albumName = (song) => song?.album?.name || song?.album_name || collection?.name || 'Album';

  if (loading) {
    return (
      <div className="px-4 py-8 pb-32">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition text-white"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="animate-pulse">
          <div className="w-48 h-48 bg-white/10 rounded-lg mb-4" />
          <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-4 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8 pb-32">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition text-white"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 md:pb-40" style={{ backgroundColor: bgColor }}>
      <div className="px-4 md:px-8 pt-4 md:pt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full bg-black/15 px-3 py-2 text-white transition hover:bg-black/25"
        >
          <ChevronLeft size={22} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="px-4 md:px-8 pt-5 md:pt-8">
        <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)] md:items-end">
          {/* Mobile top: centered square cover + compact meta */}
          <div className="md:hidden text-center">
            <div className="mx-auto inline-block p-2 bg-white/10 rounded-lg">
              {collection?.cover_url ? (
                <img
                  src={collection.cover_url}
                  alt={collection?.name}
                  className="w-40 h-40 object-cover rounded-lg"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center rounded-lg bg-black/20">
                  <Music size={48} className="text-white/35" />
                </div>
              )}
            </div>

            <p className="mt-3 text-sm font-semibold text-white">{collection?.name}</p>
            <p className="mt-1 text-xs text-white/60">{songCount} tracks · {formatDuration(totalDurationMs)}</p>

            <div className="mt-3 flex items-center justify-center gap-8">
              <button className="text-white/80">
                <Bookmark size={22} />
              </button>

              <button
                onClick={handlePlayAllClick}
                className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white text-black"
              >
                {isPlayingAllSongs && isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <button className="text-white/80">
                <Share2 size={22} />
              </button>
            </div>
          </div>

          {/* Desktop / larger screens: original layout */}
          <div className="relative mx-auto w-full md:max-w-none md:mx-0 hidden md:block" style={{ maxWidth: 240 }}>
            {collection?.cover_url ? (
              <img
                src={collection.cover_url}
                alt={collection?.name}
                className="w-full rounded-[26px] object-cover shadow-[0_18px_50px_rgba(0,0,0,0.32)]"
                style={{ height: 240, mdHeight: 280 }}
                onError={(e) => {
                  console.error('Image failed to load:', collection.cover_url);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex w-full items-center justify-center rounded-[26px] bg-black/20" style={{ height: 240 }}>
                <Music size={56} className="text-white/35" />
              </div>
            )}
          </div>

          <div className="pb-1 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              {collection?.type?.toUpperCase() || 'PLAYLIST'}
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-[-0.03em] md:text-5xl">
              {collection?.name}
            </h1>
            <p className="mt-2 text-sm text-white/75 md:text-base">
              {songCount} tracks
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handlePlayAllClick}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                {isPlayingAllSongs && isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isPlayingAllSongs && isPlaying ? 'Pause' : 'Play All'}
              </button>

              <button
                onClick={() => setIsDesktopShuffle((value) => !value)}
                className={`inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 ${
                  isDesktopShuffle ? 'bg-white/15' : 'bg-transparent'
                }`}
              >
                <Shuffle size={18} />
                Shuffle
              </button>

              <button
                onClick={() => setIsFavorite((value) => !value)}
                className={`inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 ${
                  isFavorite ? 'bg-white/15' : 'bg-transparent'
                }`}
              >
                <Heart size={18} className={isFavorite ? 'fill-white' : ''} />
                Favorite
              </button>

              <button className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                <MoreVertical size={18} />
                More
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 pt-8">
        <div className="hidden md:block">
          <div className="grid grid-cols-[72px_minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_120px] gap-4 border-b border-white/20 px-4 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            <div>S. No.</div>
            <div>Tracks</div>
            <div>Artists</div>
            <div>Album</div>
            <div className="text-right">Duration</div>
          </div>

          {songs.length === 0 ? (
            <div className="px-4 py-10 text-center text-white/75">No songs available</div>
          ) : (
            <div>
              {songs.map((song, index) => {
                const isCurrentSong = currentSong?.id === song.id;
                const isSongPlaying = isCurrentSong && isPlaying;

                return (
                  <button
                    key={song.id}
                    onClick={() => handleSongClick(song)}
                    className={`grid w-full grid-cols-[72px_minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_120px] items-center gap-4 border-b border-white/10 px-4 py-4 text-left transition hover:bg-white/6 ${
                      isCurrentSong ? 'bg-white/10' : 'bg-transparent'
                    }`}
                  >
                    <div className="text-sm text-white/75">{String(index + 1).padStart(2, '0')}</div>

                    <div className="flex min-w-0 items-center gap-3">
                      {song.thumbnail ? (
                        <img
                          src={song.thumbnail}
                          alt={song.title}
                          className="h-10 w-10 shrink-0 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white/10">
                          <Music size={18} className="text-white/35" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {isSongPlaying && <Pause size={14} className="text-white shrink-0" />}
                          <span className={`truncate text-sm font-medium ${isCurrentSong ? 'text-white' : 'text-white/90'}`}>
                            {song.title}
                          </span>
                        </div>
                        {song.tags && (
                          <p className="truncate text-xs text-white/50">{song.tags}</p>
                        )}
                      </div>
                    </div>

                    <div className="truncate text-sm text-white/75">{artistName(song)}</div>
                    <div className="truncate text-sm text-white/75">{albumName(song)}</div>
                    <div className="text-right text-sm text-white/75">{formatDuration(song.duration)}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-2 md:hidden">
          <h2 className="mb-2 text-lg font-semibold text-white">Songs</h2>
          {songs.length === 0 ? (
            <div className="py-8 text-center text-white/70">No songs available</div>
          ) : (
            songs.map((song) => {
              const isCurrentSong = currentSong?.id === song.id;
              const isSongPlaying = isCurrentSong && isPlaying;

              return (
                <button
                  key={song.id}
                  onClick={() => handleSongClick(song)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    isCurrentSong ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {song.thumbnail ? (
                      <img src={song.thumbnail} alt={song.title} className="h-12 w-12 rounded object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-white/10">
                        <Music size={20} className="text-white/30" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col">
                        <span className="truncate text-sm font-medium text-white">{song.title}</span>
                        <p className="truncate text-xs text-white/60">{artistName(song)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3 text-white/30">
                        <button type="button"><Download size={18} /></button>
                        <button type="button"><Play size={18} /></button>
                      </div>
                      <span className="text-xs text-white/60">{formatDuration(song.duration)}</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
