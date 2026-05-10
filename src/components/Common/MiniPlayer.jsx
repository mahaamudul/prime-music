import React, { useContext, useMemo } from 'react';
import { Music, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Repeat1, Heart, MoreVertical, ListMusic } from 'lucide-react';
import { MusicPlayerContext } from '../../contexts/MusicPlayerContext';
import MarqueeText from './MarqueeText';

const clamp = (value, min, max) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.min(max, Math.max(min, numeric));
};

const safeSeconds = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
};

const formatTime = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.floor(safeSeconds(milliseconds) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const debugMiniPlayer = (action, payload = {}) => {
  console.log('[MiniPlayer]', action, payload);
};

const MiniPlayer = () => {
  const {
    currentSong,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    bufferedTime,
    volume,
    isMuted,
    isShuffling,
    repeatMode,
    collection,
    pauseSong,
    resumeSong,
    nextSong,
    previousSong,
    toggleShuffle,
    cycleRepeatMode,
    toggleMute,
    setVolumeValue,
    seek,
    toggleQueue,
    isCollectionFavorite,
    toggleCollectionFavorite,
  } = useContext(MusicPlayerContext);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    const safeDuration = safeSeconds(duration);
    if (safeDuration === 0) return 0;
    const safeCurrentTime = clamp(currentTime, 0, safeDuration);
    return Math.max(0, Math.min((safeCurrentTime / safeDuration) * 100, 100));
  }, [currentTime, duration]);

  const bufferedPercentage = useMemo(() => {
    const safeDuration = safeSeconds(duration);
    if (safeDuration === 0) return 0;
    const safeBufferedTime = clamp(bufferedTime, 0, safeDuration);
    return Math.max(0, Math.min((safeBufferedTime / safeDuration) * 100, 100));
  }, [bufferedTime, duration]);

  // Handle seek input
  const handleSeekInput = (e) => {
    const safeDuration = safeSeconds(duration);
    if (safeDuration === 0) return;

    const percent = clamp(Number(e.currentTarget.value) / 100, 0, 1);
    debugMiniPlayer('seek', { percent, duration: safeDuration, currentSong: currentSong?.title });
    seek((safeDuration * percent) / 1000); // Convert ms to seconds
  };

  // Handle volume slider
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    debugMiniPlayer('volume', { value: vol, currentSong: currentSong?.title });
    setVolumeValue(vol);
  };

  const handlePrevious = () => {
    debugMiniPlayer('previous', { currentSong: currentSong?.title });
    previousSong?.();
  };

  const handlePlayPause = () => {
    debugMiniPlayer(isPlaying ? 'pause' : 'play', { currentSong: currentSong?.title });
    if (isPlaying) {
      pauseSong?.();
    } else {
      resumeSong?.();
    }
  };

  const handleNext = () => {
    debugMiniPlayer('next', { currentSong: currentSong?.title });
    nextSong?.();
  };

  const handleShuffle = () => {
    debugMiniPlayer('shuffle', { currentSong: currentSong?.title, isShuffling });
    toggleShuffle?.();
  };

  const handleRepeat = () => {
    debugMiniPlayer('repeat', { currentSong: currentSong?.title, repeatMode });
    cycleRepeatMode?.();
  };

  const handleMute = () => {
    debugMiniPlayer('mute-toggle', { currentSong: currentSong?.title, isMuted });
    toggleMute?.();
  };

  const handleToggleQueue = () => {
    debugMiniPlayer('toggle-queue', { currentSong: currentSong?.title });
    toggleQueue?.();
  };

  const handleFavorite = () => {
    debugMiniPlayer('favorite-toggle', { collection: collection?.name, currentSong: currentSong?.title });
    toggleCollectionFavorite?.(collection);
  };

  const handleMore = () => {
    debugMiniPlayer('more', { collection: collection?.name, currentSong: currentSong?.title });
  };

  const isFavorite = isCollectionFavorite?.(collection);

  // Don't render if no song
  if (!currentSong || !currentSong.id) {
    return null;
  }

  return (
    <>
      {/* Compact mobile player overlay (when playlist is open) */}
      <div className="fixed bottom-20 left-0 right-0 z-50 px-4 md:hidden">
        <div className="mx-auto max-w-2xl rounded-2xl bg-[#020e28]/35 backdrop-blur-xl border border-white/10 px-3 py-2 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
            {/* Album thumbnail */}
            <div className="justify-self-start shrink-0">
              {currentSong.thumbnail ? (
                <img src={currentSong.thumbnail} alt={currentSong.title} className="w-10 h-10 rounded object-cover" />
              ) : (
                <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                  <Music size={16} className="text-white/30" />
                </div>
              )}
            </div>

            {/* Playback controls */}
            <div className="justify-self-center flex items-center justify-center gap-2">
              <button onClick={handlePrevious} className="p-2 text-white/80" title="Previous">
                <SkipBack size={14} />
              </button>
              {isPlaying ? (
                <button onClick={handlePlayPause} className="w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md">
                  <Pause size={18} />
                </button>
              ) : (
                <button onClick={handlePlayPause} className="w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md">
                  <Play size={18} fill="currentColor" />
                </button>
              )}
              <button onClick={handleNext} className="p-2 text-white/80" title="Next">
                <SkipForward size={14} />
              </button>
            </div>

            {/* Time display */}
            <div className="justify-self-end text-right">
              <p className="text-[11px] text-white/60 whitespace-nowrap">{formatTime(currentTime)} / {formatTime(duration)}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-red-500 transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={Number.isFinite(progressPercentage) ? progressPercentage : 0}
              onInput={handleSeekInput}
              onChange={handleSeekInput}
              className="absolute inset-0 h-4 w-full cursor-pointer opacity-0"
              aria-label="Track progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.floor(progressPercentage)}
            />
          </div>
        </div>
      </div>

      {/* Full mini player (desktop + fallback on mobile) */}
      <div className="fixed bottom-0 left-0 right-0 hidden md:block bg-black/60 text-white px-8 py-3 md:py-4 border-t border-white/10 z-40">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-4 w-full">
          {/* Left: Album info and title */}
          <div className="flex items-center gap-3 min-w-0 justify-self-start">
            <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center shrink-0">
              {currentSong.thumbnail ? (
                <img src={currentSong.thumbnail} alt={currentSong.title} className="w-full h-full object-cover rounded" />
              ) : (
                <Music size={18} />
              )}
            </div>

            <div className="min-w-0 flex-1 max-w-70">
              <MarqueeText
                text={currentSong.title}
                className="text-sm font-semibold text-white"
                width="100%"
                speed={12}
                pauseMs={2000}
              />
              <div className="text-xs text-white/70 truncate">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          {/* Center: Playback controls */}
          <div className="flex items-center gap-2 justify-center shrink-0 px-2">
            <button onClick={handlePrevious} className="p-2 rounded-full hover:bg-white/10" title="Previous">
              <SkipBack size={16} />
            </button>
            {isPlaying ? (
              <button onClick={handlePlayPause} className="p-2 bg-red-500 rounded-full">
                <Pause size={18} />
              </button>
            ) : (
              <button onClick={handlePlayPause} className="p-2 bg-red-500 rounded-full">
                <Play size={18} fill="currentColor" />
              </button>
            )}
            <button onClick={handleNext} className="p-2 rounded-full hover:bg-white/10" title="Next">
              <SkipForward size={16} />
            </button>
          </div>

          {/* Right: Control buttons and volume */}
          <div className="flex items-center justify-self-end gap-2 min-w-0 ml-auto">
            <button
              onClick={handleShuffle}
              title="Shuffle"
              className={`p-2 rounded-md hover:bg-white/5 ${isShuffling ? 'text-red-400' : ''}`}
            >
              <Shuffle size={16} />
            </button>

            <button
              onClick={handleRepeat}
              title={`Repeat: ${repeatMode}`}
              className="p-2 rounded-md hover:bg-white/5"
            >
              {repeatMode === 'one' ? (
                <Repeat1 size={16} className="text-red-400" />
              ) : repeatMode === 'all' ? (
                <Repeat size={16} className="text-red-400" />
              ) : (
                <Repeat size={16} />
              )}
            </button>

            <button
              onClick={handleFavorite}
              title="Favorite"
              className={`p-2 rounded-md hover:bg-white/5 ${isFavorite ? 'text-red-400' : ''}`}
            >
              <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
            </button>

            <button
              onClick={handleMore}
              title="More"
              className="p-2 rounded-md hover:bg-white/5"
            >
              <MoreVertical size={16} />
            </button>

            <div className="flex items-center gap-2 px-2 border-l border-white/10">
              <button onClick={handleMute} className="p-2 rounded-md hover:bg-white/5">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/20 rounded-full cursor-pointer"
                aria-label="Volume"
              />
            </div>

            <button
              onClick={handleToggleQueue}
              title="Queue"
              className=" hover:bg-white/5  border-white/10 "
            >
              <ListMusic size={16} />
            </button>
          </div>
        </div>

        {/* Progress bar at bottom */}
        <div className="mt-3 relative h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="absolute left-0 top-0 h-full bg-white/20"
            style={{ width: `${bufferedPercentage}%` }}
          />
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-red-500"
            style={{ width: `${Number.isFinite(progressPercentage) ? progressPercentage : 0}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={Number.isFinite(progressPercentage) ? progressPercentage : 0}
            onInput={handleSeekInput}
            onChange={handleSeekInput}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
            aria-label="Track progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.floor(progressPercentage)}
          />
        </div>
      </div>
    </>
  );
};

export default MiniPlayer;
