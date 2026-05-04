import React from 'react';
import { MoreVertical } from 'lucide-react';

const SongItem = ({ song }) => {
  return (
    <div className="flex items-center gap-3 py-2">
      {/* Left: Thumbnail */}
      <img
        src={song.image}
        alt={song.title}
        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
      />

      {/* Middle: Title and Subtitle */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white text-[14px] font-semibold truncate">
          {song.title}
        </h4>
        <p className="text-white/70 text-[12px] font-normal truncate">
          {song.artist}
        </p>
      </div>

      {/* Right: Three-dot menu */}
      <button className="text-white/60 hover:text-white transition flex-shrink-0">
        <MoreVertical size={18} />
      </button>
    </div>
  );
};

export default SongItem;
