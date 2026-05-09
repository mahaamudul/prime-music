import React, { useContext } from 'react';
import { X, Music } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={toggleQueue}
      />

      {/* Queue Panel - Slide in from right on mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-gradient-to-b from-[#0f1724] to-[#080d18] border-l border-white/10 shadow-2xl flex flex-col z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Queue</h2>
          <button
            onClick={toggleQueue}
            className="p-2 rounded-full hover:bg-white/10 text-white/80"
            title="Close queue"
          >
            <X size={20} />
          </button>
        </div>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto">
          {queue && queue.length > 0 ? (
            <div className="divide-y divide-white/5">
              {queue.map((song, index) => {
                const isCurrentSong = currentSong?.id === song.id;
                const isPlayable = index >= currentIndex;

                return (
                  <div
                    key={`${song.id}-${index}`}
                    onClick={() => isPlayable && handleSongClick(song, index)}
                    className={`px-3 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                      isCurrentSong
                        ? 'bg-red-500/20 hover:bg-red-500/30'
                        : 'hover:bg-white/5'
                    } ${!isPlayable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded flex-shrink-0">
                      {song.thumbnail ? (
                        <img
                          src={song.thumbnail}
                          alt={song.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 rounded flex items-center justify-center">
                          <Music size={16} className="text-white/40" />
                        </div>
                      )}
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isCurrentSong ? 'text-red-400' : 'text-white'
                      }`}>
                        {song.title}
                      </p>
                      <p className="text-xs text-white/60 truncate">
                        {song.artist || 'Unknown Artist'}
                      </p>
                    </div>

                    {/* Duration or Playing Indicator */}
                    {isCurrentSong && (
                      <div className="flex items-center gap-1 text-red-400 flex-shrink-0">
                        <span className="text-xs font-semibold">Playing</span>
                      </div>
                    )}
                    {!isCurrentSong && (
                      <span className="text-xs text-white/50 flex-shrink-0">
                        {song.duration
                          ? `${Math.floor(song.duration / 1000)}s`
                          : '—'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-white/50">
              <p>No songs in queue</p>
            </div>
          )}
        </div>

        {/* Footer - Save Playlist Button */}
        <div className="border-t border-white/10 px-4 py-3">
          <button className="w-full py-2 px-4 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors">
            Save Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default Queue;
