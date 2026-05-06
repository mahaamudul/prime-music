import React, { createContext, useState, useCallback, useRef } from 'react';

export const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [collection, setCollection] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const sleepTimerRef = useRef(null);

  const playSong = useCallback((song, songQueue = [], collectionData = null) => {
    setCurrentSong(song);
    setQueue(songQueue);
    setCollection(collectionData);
    setIsPlaying(true);
    setCurrentTime(0);
  }, []);

  const pauseSong = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeSong = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const nextSong = useCallback(() => {
    if (!currentSong || queue.length === 0) return;

    if (repeatMode === 'one') {
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }

    if (isShuffling && queue.length > 1) {
      let nextIndex = Math.floor(Math.random() * queue.length);
      const currentIndex = queue.findIndex(song => song.id === currentSong.id);

      if (nextIndex === currentIndex) {
        nextIndex = (nextIndex + 1) % queue.length;
      }

      setCurrentSong(queue[nextIndex]);
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }
    
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      const nextTrack = queue[currentIndex + 1];
      setCurrentSong(nextTrack);
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }

    if (repeatMode === 'all') {
      setCurrentSong(queue[0]);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  }, [currentSong, queue, repeatMode, isShuffling]);

  const previousSong = useCallback(() => {
    if (!currentSong || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    if (currentIndex > 0) {
      const prevTrack = queue[currentIndex - 1];
      setCurrentSong(prevTrack);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  }, [currentSong, queue]);

  const toggleShuffle = useCallback(() => {
    setIsShuffling((value) => !value);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((value) => {
      if (value === 'off') return 'all';
      if (value === 'all') return 'one';
      return 'off';
    });
  }, []);

  const setVolumeValue = useCallback((nextVolume) => {
    const safeVolume = Math.min(1, Math.max(0, Number(nextVolume) || 0));
    setVolume(safeVolume);
    setIsMuted(safeVolume === 0);

    if (audioRef.current) {
      audioRef.current.volume = safeVolume;
      audioRef.current.muted = safeVolume === 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((value) => {
      const nextMuted = !value;

      if (audioRef.current) {
        audioRef.current.muted = nextMuted;
      }

      return nextMuted;
    });
  }, []);

  const clearSleepTimer = useCallback(() => {
    if (sleepTimerRef.current) {
      window.clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
  }, []);

  const setSleepTimerMinutes = useCallback((minutes) => {
    clearSleepTimer();

    if (!minutes) {
      return 0;
    }

    sleepTimerRef.current = window.setTimeout(() => {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      sleepTimerRef.current = null;
    }, minutes * 60 * 1000);

    return minutes;
  }, [clearSleepTimer]);

  const stopSleepTimer = useCallback(() => {
    clearSleepTimer();
  }, [clearSleepTimer]);

  const setTime = useCallback((time) => {
    setCurrentTime(time);
  }, []);

  const setDurationValue = useCallback((dur) => {
    setDuration(dur);
  }, []);

  const setBufferedValue = useCallback((time) => {
    setBufferedTime(time);
  }, []);

  const value = {
    currentSong,
    queue,
    collection,
    isPlaying,
    currentTime,
    duration,
    bufferedTime,
    playSong,
    pauseSong,
    resumeSong,
    nextSong,
    previousSong,
    setTime,
    setDurationValue,
    setBufferedValue,
    isShuffling,
    repeatMode,
    volume,
    isMuted,
    toggleShuffle,
    cycleRepeatMode,
    setVolumeValue,
    toggleMute,
    setSleepTimerMinutes,
    stopSleepTimer,
    audioRef,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
