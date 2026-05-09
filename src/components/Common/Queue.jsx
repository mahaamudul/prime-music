import React, { useContext } from 'react';
import { X, Music, Play } from 'lucide-react';
import { MusicPlayerContext } from '../../contexts/MusicPlayerContext';

const Queue = () => {
  const {
    showQueue,
    toggleQueue,
    queue,
    currentIndex,
    currentSong,
    playSong,
  } = useContext(MusicPlayerContext);

  if (!showQueue) {
    return null;
  }

  const handleSongClick = (song, index) => {
    playSong(song, queue, index);
  };

  // Format duration from ms to readable format
  const formatDuration = (ms) => {
    if (!ms) return '—';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      {/* Queue Panel - Full screen on mobile, right sidebar on desktop */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-gradient-to-b from-[#0f1724] via-[#0a1120] to-[#050810] border-l border-white/10 shadow-2xl flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Queue</h2>
          </div>
          <button
            onClick={toggleQueue}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Close queue"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-white/5 px-5">
          <button className="py-3 px-4 text-sm font-medium text-white border-b-2 border-red-500 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Queue
          </button>
          <button className="py-3 px-4 text-sm font-medium text-white/50 hover:text-white/70 flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10m1 8l-1-7h6l-1 7M9 3l-1 7h10l-1-7" />
            </svg>
            Lyrics
          </button>
        </div>

        {/* Queue Header with Save Button */}
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-sm font-semibold text-white/70">Playing Queue</h3>
          <button className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
            </svg>
            Save Playlist
          </button>
        </div>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto px-2">
          {queue && queue.length > 0 ? (
            <div className="space-y-1 pb-4">
              {queue.map((song, index) => {
                const isCurrentSong = currentSong?.id === song.id;

                return (
                  <div
                    key={`${song.id}-${index}`}
                    onClick={() => handleSongClick(song, index)}
                    className={`group px-3 py-2.5 flex items-center gap-3 rounded-lg cursor-pointer transition-all ${
                      isCurrentSong
                        ? 'bg-red-500/20 hover:bg-red-500/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-md flex-shrink-0 relative overflow-hidden bg-white/5">
                      {song.thumbnail ? (
                        <>
                          <img
                            src={song.thumbnail}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                          {isCurrentSong && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <Play size={18} className="text-red-400 fill-current" />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music size={20} className="text-white/30" />
                        </div>
                      )}
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${
                        isCurrentSong ? 'text-red-400' : 'text-white'
                      }`}>
                        {song.title}
                      </p>
                      <p className="text-xs text-white/50 truncate">
                        {song.artist || 'Unknown Artist'}
                      </p>
                    </div>

                    {/* Duration */}
                    <span className="text-xs text-white/40 flex-shrink-0 font-medium">
                      {formatDuration(song.duration)}
                    </span>

                    {/* More Options */}
                    <button className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 5a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-center text-white/40">
              <div>
                <p className="text-sm font-medium">No songs in queue</p>
                <p className="mt-1 text-xs text-white/30">Play a song to start</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Queue;
