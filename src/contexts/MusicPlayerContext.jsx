import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';
import { Howl } from 'howler';

export const MusicPlayerContext = createContext();

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
  return `/audio-proxy?url=${encodeURIComponent(encodeURI(normalizedUrl))}`;
};

const clampNumber = (value, min, max) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return min;
  }

  return Math.min(max, Math.max(min, numericValue));
};

const debugPlayer = (...args) => {
  console.log('[MusicPlayer]', ...args);
};

export const MusicPlayerProvider = ({ children }) => {
  // Player state
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collection, setCollection] = useState(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);

  // Controls state
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [favoriteCollections, setFavoriteCollections] = useState({});

  // Error and timer state
  const [error, setError] = useState(null);
  const [sleepTimerMinutes, _setSleepTimerMinutes] = useState(0);

  // UI state
  const [showQueue, setShowQueue] = useState(false);

  // Refs for Howler instance and timers
  const howlRef = useRef(null);
  const soundIdRef = useRef(null);
  const sleepTimerRef = useRef(null);
  const updateIntervalRef = useRef(null);
  const lastSongIdRef = useRef(null);
  const loadGenerationRef = useRef(0);
  const queueRef = useRef([]);
  const currentIndexRef = useRef(0);
  const currentSongRef = useRef(null);
  const repeatModeRef = useRef('off');

  const getCollectionKey = useCallback((collectionLike) => {
    if (!collectionLike) return null;
    return collectionLike.id || collectionLike.name || null;
  }, []);

  const isCollectionFavorite = useCallback((collectionLike) => {
    const key = getCollectionKey(collectionLike);
    return key ? !!favoriteCollections[key] : false;
  }, [favoriteCollections, getCollectionKey]);

  const toggleCollectionFavorite = useCallback((collectionLike) => {
    const key = getCollectionKey(collectionLike);
    if (!key) return false;

    setFavoriteCollections((prev) => {
      const nextValue = !prev[key];
      debugPlayer('toggleFavorite', { collectionKey: key, from: !!prev[key], to: nextValue });
      return {
        ...prev,
        [key]: nextValue,
      };
    });

    return true;
  }, [getCollectionKey]);

  useEffect(() => {
    queueRef.current = queue;
    currentIndexRef.current = currentIndex;
    currentSongRef.current = currentSong;
    repeatModeRef.current = repeatMode;
  }, [queue, currentIndex, currentSong, repeatMode]);

  // Clean up Howl instance
  const unloadHowl = useCallback(() => {
    if (howlRef.current) {
      try {
        howlRef.current.unload();
      } catch (err) {
        console.warn('Error unloading Howl:', err);
      }
      howlRef.current = null;
      soundIdRef.current = null;
    }
  }, []);

  // Stop position update interval
  const stopPositionUpdate = useCallback(() => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
  }, []);

  // Start position update interval (every 100ms while playing)
  const startPositionUpdate = useCallback(() => {
    stopPositionUpdate();
    updateIntervalRef.current = setInterval(() => {
      if (howlRef.current && soundIdRef.current !== null) {
        const pos = howlRef.current.seek(soundIdRef.current);
        if (typeof pos === 'number') {
          setCurrentTime(Math.max(0, pos * 1000)); // Convert to ms
        }

        const activeSound = howlRef.current._sounds?.find((sound) => sound?._id === soundIdRef.current) || howlRef.current._sounds?.[0];
        const audioNode = activeSound?._node;
        if (audioNode && audioNode.buffered && audioNode.buffered.length > 0) {
          try {
            const bufferedEnd = audioNode.buffered.end(audioNode.buffered.length - 1);
            if (Number.isFinite(bufferedEnd)) {
              setBufferedTime(Math.max(0, bufferedEnd * 1000));
            }
          } catch {
            // Ignore transient buffered range access errors.
          }
        }
      }
    }, 100);
  }, [stopPositionUpdate]);

  const startCurrentPlayback = useCallback(() => {
    if (howlRef.current && soundIdRef.current !== null) {
      debugPlayer('startCurrentPlayback', { songId: currentSong?.id, title: currentSong?.title });
      return howlRef.current.play(soundIdRef.current);
    }

    return null;
  }, [currentSong]);

  // Load and create Howl instance for a song
  const loadSong = useCallback((song, options = {}) => {
    if (!song?.file_path) {
      setError('Song has no file path');
      return false;
    }

    const {
      advanceIndex = currentIndex,
      direction = 1,
      autoAdvance = false,
    } = options;

    const loadGeneration = loadGenerationRef.current + 1;
    loadGenerationRef.current = loadGeneration;
    debugPlayer('loadSong:start', { id: song.id, title: song.title });

    // Only recreate Howl if song ID changed
    if (lastSongIdRef.current === song.id && howlRef.current) {
      debugPlayer('loadSong:reuse', { id: song.id, title: song.title });
      startCurrentPlayback();
      return true; // Reuse existing instance
    }

    // Clean up previous instance
    unloadHowl();

    try {
      setIsLoading(true);
      // derive extension/format (fallback to mp3)
      const match = (song.file_path || '').match(/\.([a-zA-Z0-9]{2,5})(?:\?|$)/);
      let ext = match ? match[1].toLowerCase() : null;
      if (!ext) {
        // try to infer from mimeType if provided on song object
        if (song.mime) {
          const m = (song.mime || '').split('/').pop();
          if (m) ext = m.toLowerCase();
        }
      }
      if (!ext) ext = 'mp3';

      const directUrl = encodeURI(decodeHtmlEntities(song.file_path));
      const proxyUrl = resolveAudioUrl(song.file_path);
      const sources = [
        { src: directUrl, format: ext, label: 'direct' },
        { src: proxyUrl, format: ext, label: 'proxy' },
      ].filter((item) => item.src);

      const createHowl = (src, format, sourceIndex) => {
        try {
          const h = new Howl({
            src: [src],
            html5: true,
            preload: 'metadata',
            format: [format],
            volume: volume,
            mute: isMuted,
            onload: () => {
              if (loadGenerationRef.current !== loadGeneration) return;
              debugPlayer('howl:onload', { id: song.id, title: song.title });
              setIsLoading(false);
              setIsBuffering(false);
              try {
                const dur = h.duration();
                setDuration((dur && typeof dur === 'number') ? dur * 1000 : 0);
              } catch (e) {
                setDuration(0);
              }
              setError(null);
            },
            onloaderror: (id, err) => {
              if (loadGenerationRef.current !== loadGeneration) return;
              console.warn('Howl load error:', err);
              debugPlayer('howl:onloaderror', { id: song.id, title: song.title, sourceIndex, err });
              setIsLoading(false);
              handleHowlLoadError(sourceIndex, err);
            },
            onplayerror: (id, err) => {
              if (loadGenerationRef.current !== loadGeneration) return;
              console.error('Howl play error:', err);
              debugPlayer('howl:onplayerror', { id: song.id, title: song.title, err });
              setError(`Failed to play song: ${song.title}`);
            },
            onplay: () => {
              if (loadGenerationRef.current !== loadGeneration) return;
              debugPlayer('howl:onplay', { id: song.id, title: song.title, sourceIndex });
              setIsPlaying(true);
              setError(null);
              startPositionUpdate();
            },
            onpause: () => {
              if (loadGenerationRef.current !== loadGeneration) return;
              debugPlayer('howl:onpause', { id: song.id, title: song.title });
              setIsPlaying(false);
              stopPositionUpdate();
            },
            onstop: () => {
              if (loadGenerationRef.current !== loadGeneration) return;
              debugPlayer('howl:onstop', { id: song.id, title: song.title });
              setIsPlaying(false);
              setCurrentTime(0);
              stopPositionUpdate();
            },
            onend: () => {
              if (loadGenerationRef.current !== loadGeneration) return;
              debugPlayer('howl:onend', { id: song.id, title: song.title });
              handleSongEnd();
            },
            onseek: () => {
              if (loadGenerationRef.current !== loadGeneration) return;
              if (howlRef.current && soundIdRef.current !== null) {
                const pos = howlRef.current.seek(soundIdRef.current);
                if (typeof pos === 'number') {
                  debugPlayer('howl:onseek', { id: song.id, title: song.title, positionSeconds: pos });
                  setCurrentTime(Math.max(0, pos * 1000));
                }
              }
            },
          });

          return h;
        } catch (e) {
          console.error('Error creating Howl instance:', e);
          return null;
        }
      };

      const handleHowlLoadError = (failedSourceIndex, err) => {
        const nextSource = sources[failedSourceIndex + 1];
        if (nextSource) {
          console.warn(`Attempting fallback to ${nextSource.label} URL for song`, song.title);
          debugPlayer('loadSong:fallback', { id: song.id, title: song.title, from: sources[failedSourceIndex]?.label, to: nextSource.label });
          unloadHowl();
          const fallbackHowl = createHowl(nextSource.src, nextSource.format, failedSourceIndex + 1);
          if (fallbackHowl) {
            howlRef.current = fallbackHowl;
            lastSongIdRef.current = song.id;
            const fallbackId = fallbackHowl.play();
            soundIdRef.current = fallbackId;
            fallbackHowl.pause(fallbackId);
            return;
          }
        }

        // If all sources fail, show helpful error
        const code = (err && err.code) || err || 'unknown';
        if (code === 4 || (err && /forbid|403|forbidden/i.test(String(err)))) {
          setError('Playback blocked by proxy (403) or access denied. Check audio-proxy permissions.');
        } else if (err && /codec|No codec|format/i.test(String(err))) {
          setError('No supported audio codec detected. Ensure source is MP3/OGG and set correct format.');
        } else {
          setError(`Failed to load song: ${song.title}`);
        }

        const activeQueue = queueRef.current;
        const activeCurrentIndex = currentIndexRef.current;

        if (autoAdvance && activeQueue.length > 1) {
          const queueLength = activeQueue.length;
          const start = Number.isFinite(advanceIndex) ? advanceIndex : activeCurrentIndex;
          const nextIndex = (start + direction + queueLength) % queueLength;

          if (nextIndex !== start) {
            const skippedSong = activeQueue[nextIndex];
            debugPlayer('loadSong:autoAdvance', {
              fromIndex: start,
              toIndex: nextIndex,
              songId: skippedSong?.id,
              title: skippedSong?.title,
            });

            setCurrentIndex(nextIndex);
            setCurrentSong(skippedSong);
            currentIndexRef.current = nextIndex;
            currentSongRef.current = skippedSong;
            loadSong(skippedSong, {
              advanceIndex: nextIndex,
              direction,
              autoAdvance: true,
            });
          }
        }
      };

      // create initial Howl using the direct URL first to avoid unnecessary proxy requests
      const initialHowl = createHowl(sources[0].src, sources[0].format, 0);
      if (!initialHowl) {
        // fallback to the remaining source
        const fallbackSource = sources[1];
        const fallback = fallbackSource ? createHowl(fallbackSource.src, fallbackSource.format, 1) : null;
        if (!fallback) {
          setIsLoading(false);
          setError('Failed to initialize audio');
          return false;
        }
        howlRef.current = fallback;
        lastSongIdRef.current = song.id;
        const id = fallback.play();
        soundIdRef.current = id;
        fallback.pause(id);
        return true;
      }

      howlRef.current = initialHowl;
      lastSongIdRef.current = song.id;

      // Start playback immediately for this active song.
      const id = initialHowl.play();
      soundIdRef.current = id;
      debugPlayer('loadSong:playing', { id: song.id, title: song.title, source: sources[0].label });

      return true;
    } catch (err) {
      console.error('Error creating Howl:', err);
      setError('Failed to initialize audio player');
      return false;
    }
  }, [volume, isMuted, startPositionUpdate, stopPositionUpdate, unloadHowl, currentSong, startCurrentPlayback]);

  // Handle song end (advance queue by default, respect repeat mode)
  const handleSongEnd = useCallback(() => {
    const activeRepeatMode = repeatModeRef.current;
    const activeQueue = queueRef.current;
    const activeCurrentIndex = currentIndexRef.current;
    const activeCurrentSong = currentSongRef.current;

    if (activeRepeatMode === 'one') {
      if (howlRef.current && soundIdRef.current !== null) {
        debugPlayer('handleSongEnd:repeat-one', { songId: activeCurrentSong?.id, title: activeCurrentSong?.title });
        howlRef.current.seek(0, soundIdRef.current);
        howlRef.current.play(soundIdRef.current);
      }
      return;
    }

    const nextIdx = activeCurrentIndex + 1;

    // Advance to next song while available.
    if (nextIdx < activeQueue.length) {
      const nextSong = activeQueue[nextIdx];
      setCurrentIndex(nextIdx);
      setCurrentSong(nextSong);
      currentIndexRef.current = nextIdx;
      currentSongRef.current = nextSong;
      debugPlayer('handleSongEnd:advance', {
        fromIndex: activeCurrentIndex,
        toIndex: nextIdx,
        songId: nextSong?.id,
        title: nextSong?.title,
      });
      loadSong(nextSong, { advanceIndex: nextIdx, direction: 1, autoAdvance: true });
      return;
    }

    // At queue end: loop only in repeat-all, otherwise stop.
    if (activeRepeatMode === 'all' && activeQueue.length > 0) {
      const firstSong = activeQueue[0];
      setCurrentIndex(0);
      setCurrentSong(firstSong);
      currentIndexRef.current = 0;
      currentSongRef.current = firstSong;
      debugPlayer('handleSongEnd:loop', { songId: firstSong?.id, title: firstSong?.title });
      loadSong(firstSong, { advanceIndex: 0, direction: 1, autoAdvance: true });
      return;
    }

    debugPlayer('handleSongEnd:stop-at-end', { currentIndex: activeCurrentIndex, queueLength: activeQueue.length });
    setIsPlaying(false);
    stopPositionUpdate();
  }, [loadSong, stopPositionUpdate]);

  // Play a specific song from queue
  const playSong = useCallback((song, songQueue = [], startIndex = 0, collectionData = null) => {
    if (!song) {
      setError('No song to play');
      return;
    }

    setQueue(songQueue.length > 0 ? songQueue : [song]);
    setCurrentSong(song);
    setCurrentIndex(startIndex);
    queueRef.current = songQueue.length > 0 ? songQueue : [song];
    currentSongRef.current = song;
    currentIndexRef.current = startIndex;
    setCollection(collectionData);
    setCurrentTime(0);
    setError(null);

    debugPlayer('playSong', { id: song.id, title: song.title, queueLength: songQueue.length, startIndex });

    loadSong(song, { advanceIndex: startIndex, direction: 1, autoAdvance: true });
  }, [loadSong]);

  // Play all songs from a playlist starting at index
  const playPlaylist = useCallback((songs, startIndex = 0, collectionData = null) => {
    if (!songs || songs.length === 0) {
      setError('Playlist is empty');
      return;
    }

    const idx = Math.max(0, Math.min(startIndex, songs.length - 1));
    const song = songs[idx];
    playSong(song, songs, idx, collectionData);
  }, [playSong]);

  // Play/Resume
  const play = useCallback(() => {
    if (!currentSong) {
      setError('No song selected');
      return;
    }

    debugPlayer('play');

    if (!howlRef.current) {
      loadSong(currentSong, { advanceIndex: currentIndex, direction: 1, autoAdvance: true });
      return;
    }

    startCurrentPlayback();
  }, [currentSong, currentIndex, loadSong, startCurrentPlayback]);

  // Pause
  const pause = useCallback(() => {
    debugPlayer('pause');
    if (howlRef.current && soundIdRef.current !== null) {
      howlRef.current.pause(soundIdRef.current);
    }
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Seek to time (in seconds)
  const seek = useCallback((seconds) => {
    if (howlRef.current && soundIdRef.current !== null) {
      const safeSeconds = clampNumber(seconds, 0, Number(duration) > 0 ? duration / 1000 : Number.MAX_SAFE_INTEGER);
      debugPlayer('seek', { seconds: safeSeconds });
      howlRef.current.seek(safeSeconds, soundIdRef.current);
      setCurrentTime(Math.max(0, safeSeconds * 1000));
    }
  }, [duration]);

  // Stop playback
  const stop = useCallback(() => {
    debugPlayer('stop');
    if (howlRef.current && soundIdRef.current !== null) {
      howlRef.current.stop(soundIdRef.current);
    }
  }, []);

  // Set volume (0 to 1)
  const setVolumeLevel = useCallback((vol) => {
    const safeVolume = clampNumber(vol, 0, 1);
    debugPlayer('volume', { from: volume, to: safeVolume });
    setVolume(safeVolume);

    if (howlRef.current) {
      howlRef.current.volume(safeVolume);
    }

    if (safeVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }, [isMuted, volume]);

  // Mute
  const mute = useCallback(() => {
    debugPlayer('mute');
    setIsMuted(true);
    if (howlRef.current) {
      howlRef.current.mute(true);
    }
  }, []);

  // Unmute
  const unmute = useCallback(() => {
    debugPlayer('unmute');
    setIsMuted(false);
    if (howlRef.current) {
      howlRef.current.mute(false);
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  }, [isMuted, mute, unmute]);

  // Next song
  const next = useCallback(() => {
    const activeQueue = queueRef.current;
    if (activeQueue.length === 0) return;

    debugPlayer('next', { currentIndex: currentIndexRef.current, queueLength: activeQueue.length, isShuffling, repeatMode: repeatModeRef.current });

    let nextIdx;
    if (isShuffling) {
      // Random next song (but not the same song)
      let randomIdx = Math.floor(Math.random() * activeQueue.length);
      if (activeQueue.length > 1) {
        while (randomIdx === currentIndexRef.current) {
          randomIdx = Math.floor(Math.random() * activeQueue.length);
        }
      }
      nextIdx = randomIdx;
    } else {
      // Sequential next song
      nextIdx = currentIndexRef.current + 1;
      if (nextIdx >= activeQueue.length) {
        if (repeatModeRef.current === 'all') {
          nextIdx = 0; // Loop to beginning
        } else {
          return; // Stop at end
        }
      }
    }

    const nextSong = activeQueue[nextIdx];
    setCurrentIndex(nextIdx);
    setCurrentSong(nextSong);
    currentIndexRef.current = nextIdx;
    currentSongRef.current = nextSong;
    loadSong(nextSong, { advanceIndex: nextIdx, direction: 1, autoAdvance: true });
  }, [isShuffling, loadSong]);

  // Previous song
  const previous = useCallback(() => {
    const activeQueue = queueRef.current;
    if (activeQueue.length === 0) return;

    debugPlayer('previous', { currentIndex: currentIndexRef.current, queueLength: activeQueue.length });

    let prevIdx = currentIndexRef.current - 1;
    if (prevIdx < 0) {
      prevIdx = activeQueue.length - 1; // Loop to end
    }

    const prevSong = activeQueue[prevIdx];
    setCurrentIndex(prevIdx);
    setCurrentSong(prevSong);
    currentIndexRef.current = prevIdx;
    currentSongRef.current = prevSong;
    loadSong(prevSong, { advanceIndex: prevIdx, direction: -1, autoAdvance: true });
  }, [loadSong]);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    debugPlayer('toggleShuffle', { from: isShuffling, to: !isShuffling });
    setIsShuffling((prev) => !prev);
  }, [isShuffling]);

  // Cycle repeat mode: off -> all -> one -> off
  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      const nextMode = prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off';
      debugPlayer('cycleRepeatMode', { from: prev, to: nextMode });
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Sleep timer functions
  const startSleepTimer = useCallback((minutes) => {
    debugPlayer('sleepTimer:start', { minutes });
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
    }

    if (!minutes) {
      _setSleepTimerMinutes(0);
      return;
    }

    _setSleepTimerMinutes(minutes);
    sleepTimerRef.current = setTimeout(() => {
      pause();
      _setSleepTimerMinutes(0);
    }, minutes * 60 * 1000);
  }, [pause]);

  const clearSleepTimer = useCallback(() => {
    debugPlayer('sleepTimer:clear');
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    _setSleepTimerMinutes(0);
  }, []);

  // Backward compatibility - alias functions
  const playSongCompat = useCallback((song, songQueue = [], startIndexOrCollection = 0, maybeCollection = null) => {
    let startIndex = 0;
    let collectionData = null;

    if (typeof startIndexOrCollection === 'number') {
      startIndex = startIndexOrCollection;
      collectionData = maybeCollection;
    } else {
      collectionData = startIndexOrCollection;
    }

    playSong(song, songQueue, startIndex, collectionData);
  }, [playSong]);

  const pauseSongCompat = pause;
  const resumeSongCompat = play;
  const nextSongCompat = next;
  const previousSongCompat = previous;
  const setTime = seek; // For backward compat with MiniPlayer
  const setDurationValue = setDuration; // For backward compat
  const setBufferedValue = setBufferedTime; // For backward compat
  const setVolumeValue = setVolumeLevel; // For backward compat
  const setSleepTimerMinutesCompat = startSleepTimer; // For backward compat
  const stopSleepTimer = clearSleepTimer; // For backward compat

  // Toggle queue visibility
  const toggleQueue = useCallback(() => {
    setShowQueue((prev) => {
      const next = !prev;
      debugPlayer('toggleQueue', { showQueue: next });
      return next;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPositionUpdate();
      clearSleepTimer();
      unloadHowl();
    };
  }, [stopPositionUpdate, clearSleepTimer, unloadHowl]);

  const value = {
    // State
    currentSong,
    queue,
    currentIndex,
    collection,
    isPlaying,
    isLoading,
    isBuffering,
    currentTime,
    duration,
    bufferedTime,
    volume,
    isMuted,
    isShuffling,
    repeatMode,
    favoriteCollections,
    error,
    sleepTimerMinutes,
    showQueue,

    // Actions
    playSong: playSongCompat,
    playPlaylist,
    play,
    pause,
    pauseSong: pauseSongCompat,
    resumeSong: resumeSongCompat,
    togglePlay,
    seek,
    stop,
    setVolumeLevel,
    mute,
    unmute,
    toggleMute,
    next,
    nextSong: nextSongCompat,
    previous,
    previousSong: previousSongCompat,
    toggleShuffle,
    cycleRepeatMode,
    isCollectionFavorite,
    toggleCollectionFavorite,
    startSleepTimer,
    clearSleepTimer,
    toggleQueue,

    // Backward compat aliases
    setTime,
    setDurationValue,
    setBufferedValue,
    setVolumeValue,
    setSleepTimerMinutes: setSleepTimerMinutesCompat,
    stopSleepTimer,
    audioRef: null, // No longer used with Howler
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
