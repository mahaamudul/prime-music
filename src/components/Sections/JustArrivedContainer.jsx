import React, { useState } from 'react';
import { Heart, Play } from 'lucide-react';
import SongItem from '../Cards/SongItem';

const JustArrivedContainer = ({ title, songs, onViewAll }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="px-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-[20px] font-semibold">{title}</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[#1DB954] text-[14px] font-bold hover:text-[#1ed760] transition"
          >
            View All
          </button>
        )}
      </div>

      {/* Container */}
      <div className="bg-[#2A2F3E] rounded-xl p-4 relative">
        {/* Song List */}
        <div className="mb-4">
          {songs.slice(0, 3).map((song) => (
            <SongItem key={song.id} song={song} />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          {/* Heart Icon */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="mt-3"
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
          <button className="mt-3 w-14 h-14 bg-[#ff5353] rounded-full shadow-lg hover:bg-[#ff6b6b] transition flex items-center justify-center">
            <Play size={28} className="text-white fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JustArrivedContainer;
