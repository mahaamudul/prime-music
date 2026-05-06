import { useContext, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Heart,
  MoreVertical,
  Repeat,
  Shuffle,
  MoonStar,
} from 'lucide-react';
import { MusicPlayerContext } from '../../contexts/MusicPlayerContext';

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

  if (!normalizedUrl) {
    return '';
  }

  return `/audio-proxy?url=${encodeURIComponent(normalizedUrl)}`;
};

const MiniPlayer = () => {
  const {
    currentSong,
    collection,
    isPlaying,
    currentTime,
    duration,
    bufferedTime,
    pauseSong,
    resumeSong,
    nextSong,
    previousSong,
    setTime,
    setDurationValue,
    isShuffling,
    repeatMode,
    volume,
    isMuted,
    toggleShuffle,
    cycleRepeatMode,
    setVolumeValue,
    toggleMute,
    setSleepTimerMinutes,
    audioRef,
    setBufferedValue,
  } = useContext(MusicPlayerContext);

  const [isFavorite, setIsFavorite] = useState(false);
  const [sleepMinutes, setSleepMinutes] = useState(0);

  const readBufferedSeconds = (audio) => {
    if (!audio || !audio.buffered || audio.buffered.length === 0) return 0;

    try {
      return audio.buffered.end(audio.buffered.length - 1);
    } catch {
      return 0;
    }
  };

  // Load the audio source only when the selected song changes.
  useEffect(() => {
    if (!audioRef.current || !currentSong?.file_path) {
      return;
    }

    const audio = audioRef.current;
    const nextAudioUrl = resolveAudioUrl(currentSong.file_path);

    if (nextAudioUrl && audio.src !== nextAudioUrl) {
      audio.src = nextAudioUrl;
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Audio play error:', error);
      });
    }
  }, [currentSong?.id, currentSong?.file_path, isPlaying, audioRef]);

  // Handle volume and mute separately to avoid interrupting playback.
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted, audioRef]);

  // Sync time, duration, and buffered progress from the audio element.
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setTime(audio.currentTime * 1000);
    };

    const handleLoadedMetadata = () => {
      setDurationValue(audio.duration * 1000);
      setBufferedValue(readBufferedSeconds(audio) * 1000);
      setTime(audio.currentTime * 1000);
    };

    const handleDurationChange = () => {
      setDurationValue(audio.duration * 1000);
    };

    const handleProgress = () => {
      setBufferedValue(readBufferedSeconds(audio) * 1000);
    };

    const handleEnded = () => {
      console.log('Song ended, playing next');
      if (repeatMode === 'one' && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        return;
      }

      nextSong();
    };

    const handleCanPlay = () => {
      console.log('Audio ready to play');
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('progress', handleProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [currentSong?.id, setTime, setDurationValue, setBufferedValue, nextSong, audioRef, repeatMode]);

  const formatTime = (ms) => {
    if (!ms || isNaN(ms)) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeekInput = (event) => {
    if (!audioRef.current || duration <= 0) return;

    const audio = audioRef.current;
    const nextPercent = Math.max(0, Math.min(Number(event.target.value) || 0, 100));
    const nextTime = (nextPercent / 100) * (duration / 1000);

    try {
      audio.currentTime = nextTime;
    } catch (error) {
      console.error('Audio seek error:', error);
      return;
    }

    setTime(nextTime * 1000);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercentage = duration > 0 ? Math.min((bufferedTime / duration) * 100, 100) : 0;

  const volumeIcon = isMuted || volume === 0 ? <VolumeX size={16} className="md:w-5 md:h-5" /> : <Volume2 size={16} className="md:w-5 md:h-5" />;

  const handleSleepButtonClick = () => {
    const nextValue = sleepMinutes === 0 ? 15 : sleepMinutes === 15 ? 30 : sleepMinutes === 30 ? 60 : 0;
    const appliedValue = setSleepTimerMinutes(nextValue);
    setSleepMinutes(appliedValue);
  };

  if (!currentSong) {
    return null;
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        preload="auto"
      />

      {/* Mini Player */}
      <div className="fixed bottom-20 md:bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/85 to-transparent px-8 py-3 md:py-4 border-t border-white/10 z-40 pointer-events-auto">
        {/* Progress bar */}
        <div className="relative mb-2 group">
          <div className="h-1 bg-white/10 rounded-full hover:h-2 transition-all overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-white/20 rounded-full"
              style={{ width: `${bufferedPercentage}%` }}
            />
            <div
              className="absolute left-0 top-0 h-full bg-red-500 rounded-full transition-all group-hover:bg-red-400"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progressPercentage}
            onInput={handleSeekInput}
            onChange={handleSeekInput}
            className="absolute inset-0 h-4 -top-1 w-full cursor-pointer opacity-0"
            aria-label="Track progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.floor(progressPercentage)}
          />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-4 w-full">
          {/* Left: Song info (div 1) */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0 justify-self-start">
            {currentSong.thumbnail ? (
              <img
                src={currentSong.thumbnail}
                alt={currentSong.title}
                className="w-10 h-10 md:w-12 md:h-12 rounded object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 rounded bg-white/10 flex items-center justify-center shrink-0">
                <Music size={16} className="text-white/30" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-white text-xs md:text-sm font-semibold truncate">
                  {currentSong.title}
                </p>
                <button
                  onClick={() => setIsFavorite((value) => !value)}
                  className="shrink-0 rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                  title="Favorite track"
                >
                  <Heart size={14} className={isFavorite ? 'fill-white text-white' : ''} />
                </button>
              </div>
              <p className="text-white/50 text-xs truncate">
                {currentSong.artist?.name || currentSong.artist_name || collection?.name || 'Playlist'}
              </p>
            </div>
          </div>

          {/* Center: Primary controls (div 2) */}
          <div className="flex items-center gap-1.5 md:gap-3 justify-center shrink-0 px-2 justify-self-center">
            <button
              onClick={toggleShuffle}
              className={`hidden md:inline-flex p-2 rounded-lg transition ${isShuffling ? 'bg-white/15 text-white' : 'hover:bg-white/10 text-white/70 hover:text-white'}`}
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>

            <button
              onClick={previousSong}
              className="p-1 md:p-2 hover:bg-white/10 rounded-lg transition text-white/70 hover:text-white"
              title="Previous track"
            >
              <SkipBack size={16} className="md:w-5 md:h-5" />
            </button>

            <button
              onClick={isPlaying ? pauseSong : resumeSong}
              className="p-1.5 md:p-2 bg-red-500 hover:bg-red-600 rounded-full transition text-white"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={18} className="fill-white md:w-5 md:h-5" />
              ) : (
                <Play size={18} className="fill-white md:w-5 md:h-5 ml-0.5" />
              )}
            </button>

            <button
              onClick={nextSong}
              className="p-1 md:p-2 hover:bg-white/10 rounded-lg transition text-white/70 hover:text-white"
              title="Next track"
            >
              <SkipForward size={16} className="md:w-5 md:h-5" />
            </button>

            <button
              onClick={cycleRepeatMode}
              className={`hidden md:inline-flex p-2 rounded-lg transition ${repeatMode !== 'off' ? 'bg-white/15 text-white' : 'hover:bg-white/10 text-white/70 hover:text-white'}`}
              title="Repeat"
            >
              <Repeat size={18} />
            </button>
          </div>

          {/* Right: Secondary / other controls (div 3) */}
          <div className="hidden md:flex items-center gap-2 shrink-0 pl-2 justify-self-end">
            <div className="text-white/60 text-xs md:text-sm whitespace-nowrap ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <button
              onClick={handleSleepButtonClick}
              className="p-2 rounded-lg transition hover:bg-white/10 text-white/70 hover:text-white"
              title="Sleep timer"
            >
              <MoonStar size={18} />
            </button>

            <button
              className="p-2 rounded-lg transition hover:bg-white/10 text-white/70 hover:text-white"
              title="More options"
            >
              <MoreVertical size={18} />
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-lg transition hover:bg-white/10 text-white/70 hover:text-white"
              title="Volume"
            >
              {volumeIcon}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => setVolumeValue(event.target.value)}
              className="w-24 accent-red-500"
              aria-label="Volume control"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniPlayer;
