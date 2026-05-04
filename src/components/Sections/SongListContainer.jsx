import React, { useState } from 'react';
import { Heart, Play } from 'lucide-react';
import SongItem from '../Cards/SongItem';

const gradients = {
  gray: 'linear-gradient(135deg, rgba(151, 157, 170, 0.95) 0%, rgba(45, 50, 66, 0.98) 100%)',
  red: 'linear-gradient(135deg, rgba(181, 88, 84, 0.95) 0%, rgba(92, 22, 22, 0.98) 100%)',
  purple: 'linear-gradient(135deg, rgba(148, 115, 214, 0.95) 0%, rgba(53, 26, 92, 0.98) 100%)',
};

const SongListContainer = ({ songs, title = 'Feel Good Indie', theme = 'gray' }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className="rounded-xl p-4 w-80 flex-shrink-0 flex flex-col h-80 overflow-hidden"
      style={{ backgroundImage: gradients[theme] || gradients.gray }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-[15px] font-semibold truncate">{title}</h3>
        <button className="text-white text-[12px] font-normal hover:text-white/80 transition">
          View All
        </button>
      </div>

      {/* Song List - Vertical Scroll */}
      <div className="flex-1 overflow-y-auto mb-3 space-y-2 pr-1">
        {songs.slice(0, 6).map((song) => (
          <SongItem key={song.id} song={song} />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between">
        {/* Heart Icon */}
        <button
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart
            size={24}
            className={`transition ${
              isLiked
                ? 'fill-[#ff5353] text-[#ff5353]'
                : 'text-white/70 fill-none hover:text-[#ff5353]'
            }`}
          />
        </button>

        {/* Play Button */}
        <button className="w-12 h-12 bg-[#ff5353] rounded-full shadow-lg hover:bg-[#ff6b6b] transition flex items-center justify-center">
          <Play size={20} className="text-white fill-white" />
        </button>
      </div>
    </div>
  );
};

export default SongListContainer;
