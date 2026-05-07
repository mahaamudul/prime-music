import { useContext, useEffect, useState } from 'react';
import { Play, Pause, Music, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Heart, List } from 'lucide-react';
import { MusicPlayerContext } from '../../contexts/MusicPlayerContext';
import MarqueeText from './MarqueeText';

const decodeHtmlEntities = (value) => {
  if (!value) return '';

  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

const resolveAudioUrl = (filePath) => {
  const normalizedUrl = decodeHtmlEntities(filePath);

  if (!normalizedUrl) return '';

  return `/audio-proxy?url=${encodeURIComponent(normalizedUrl)}`;
};

const MiniPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    pauseSong,
    resumeSong,
    setTime,
    setDurationValue,
    audioRef,
    nextSong,
    previousSong,
    volume,
    isMuted,
  } = useContext(MusicPlayerContext);
  const {
    toggleShuffle,
    cycleRepeatMode,
    isShuffling,
    repeatMode,
    setVolumeValue,
    toggleMute,
    bufferedTime,
    setBufferedValue,
  } = useContext(MusicPlayerContext);

  const [compactMobileOpen, setCompactMobileOpen] = useState(false);

  const progressPercentage = duration > 0 ? Math.max(0, Math.min((currentTime / duration) * 100, 100)) : 0;

  useEffect(() => {
    if (!audioRef.current || !currentSong?.file_path) return;
    const audio = audioRef.current;
    const nextSrc = resolveAudioUrl(currentSong.file_path);

    if (nextSrc && audio.dataset.loadedSrc !== nextSrc) {
      audio.src = nextSrc;
      audio.load();
      audio.dataset.loadedSrc = nextSrc;
      // reset time display on new source
      setTime(0);
    }

    audio.volume = volume;
    audio.muted = isMuted;

    const onTime = () => setTime(audio.currentTime * 1000);
    const onLoaded = () => {
      setDurationValue(audio.duration * 1000);
      try {
        const b = audio.buffered;
        if (b && b.length) {
          // buffered end in seconds -> convert to ms
          setBufferedValue(b.end(b.length - 1) * 1000);
        }
      } catch (err) { void err; }
    };
    const onProgress = () => {
      try {
        const b = audio.buffered;
        if (b && b.length) {
          setBufferedValue(b.end(b.length - 1) * 1000);
        }
      } catch (err) { void err; }
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('progress', onProgress);

    // Respect the playing state explicitly
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Audio play error:', error);
      });
    } else {
      try { audio.pause(); } catch (err) { void err; }
    }

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('progress', onProgress);
    };
  }, [audioRef, currentSong?.id, currentSong?.file_path, isPlaying, volume, isMuted, setTime, setDurationValue, setBufferedValue]);

  useEffect(() => {
    const handler = (e) => {
      const open = e?.detail?.open;
      if (typeof open === 'boolean') setCompactMobileOpen(open && window.innerWidth < 768);
    };

    window.addEventListener('playlist-open', handler);
    return () => window.removeEventListener('playlist-open', handler);
  }, []);

  const handleSeekInput = (event) => {
    if (!audioRef.current || duration <= 0) return;

    const audio = audioRef.current;
    const nextPercent = Math.max(0, Math.min(Number(event.target.value) || 0, 100));
    const nextTime = (nextPercent / 100) * (duration / 1000);

    try {
      audio.currentTime = nextTime;
      setTime(nextTime * 1000);
    } catch (error) {
      console.error('Audio seek error:', error);
    }
  };

  if (!currentSong) return null;

  return (
    <>
      <audio ref={audioRef} preload="auto" />

      {/* Compact mobile overlay (shows when playlist detail opens) */}
      {compactMobileOpen && (
        <div className="fixed bottom-20 left-0 right-0 z-50 px-4 md:hidden">
          <div className="mx-auto max-w-2xl rounded-2xl bg-[#020e28]/35 backdrop-blur-xl border border-white/10 px-3 py-2 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
            <div className="grid grid-cols-[auto_auto_auto] items-center gap-3">
              <div className="shrink-0">
                {currentSong.thumbnail ? (
                  <img src={currentSong.thumbnail} alt={currentSong.title} className="w-10 h-10 rounded object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                    <Music size={16} className="text-white/30" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-2">
                <button onClick={previousSong} className="p-2 text-white/80" title="Previous">
                  <SkipBack size={16} />
                </button>

                {isPlaying ? (
                  <button onClick={pauseSong} className="w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md">
                    <Pause size={18} />
                  </button>
                ) : (
                  <button onClick={resumeSong} className="w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md">
                    <Play size={18} />
                  </button>
                )}

                <button onClick={nextSong} className="p-2 text-white/80" title="Next">
                  <SkipForward size={16} />
                </button>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-white/60 whitespace-nowrap">{Math.floor(currentTime / 1000)}s / {Math.floor(duration / 1000)}s</p>
              </div>
            </div>

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
                value={progressPercentage}
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
      )}

      {/* Full mini player (desktop + fallback on mobile) */}
      <div className="fixed bottom-0 left-0 right-0 hidden md:block bg-black/60 text-white px-8 py-3 md:py-4 border-t border-white/10 z-40">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-4 w-full">
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
                {Math.floor(currentTime / 1000)}s / {Math.floor(duration / 1000)}s
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center shrink-0 px-2">
            <button onClick={previousSong} className="p-2 rounded-full hover:bg-white/10" title="Previous">
              <SkipBack size={16} />
            </button>
            {isPlaying ? (
              <button onClick={pauseSong} className="p-2 bg-red-500 rounded-full"><Pause size={18} /></button>
            ) : (
              <button onClick={resumeSong} className="p-2 bg-red-500 rounded-full"><Play size={18} /></button>
            )}
            <button onClick={nextSong} className="p-2 rounded-full hover:bg-white/10" title="Next">
              <SkipForward size={18} />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 min-w-0">
            <div className="flex items-center gap-2 text-white/70">
              <button onClick={() => toggleShuffle?.()} title="Shuffle" className={`p-2 rounded-md hover:bg-white/5 ${isShuffling ? 'text-red-400' : ''}`}>
                <Shuffle size={16} />
              </button>

              <button onClick={() => cycleRepeatMode?.()} title={`Repeat: ${repeatMode}`} className="p-2 rounded-md hover:bg-white/5">
                <Repeat size={16} />
              </button>

              <button title="Like" className="p-2 rounded-md hover:bg-white/5">
                <Heart size={16} />
              </button>

              <button title="Queue" className="p-2 rounded-md hover:bg-white/5">
                <List size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => toggleMute?.()} title={isMuted ? 'Unmute' : 'Mute'} className="p-2 rounded-md hover:bg-white/5">
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={Number(volume || 0)}
                onChange={(e) => setVolumeValue?.(Number(e.target.value))}
                className="w-28 h-1 appearance-none bg-white/10 rounded-lg"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
        {/* Desktop progress bar (click/drag to seek) */}
        <div className="mt-3 px-2">
          <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="absolute left-0 top-0 h-full bg-white/20" style={{ width: `${Math.max(0, Math.min((bufferedTime / (duration || 1)) * 100, 100))}%` }} />
            <div className="absolute left-0 top-0 h-full rounded-full bg-red-500" style={{ width: `${progressPercentage}%` }} />
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progressPercentage}
              onInput={handleSeekInput}
              onChange={handleSeekInput}
              className="absolute inset-0 h-4 w-full cursor-pointer opacity-0"
              aria-label="Track progress"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniPlayer;
