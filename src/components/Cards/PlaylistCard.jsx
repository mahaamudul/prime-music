import React from 'react';
import { Play } from 'lucide-react';

const PlaylistCard = ({ playlist, variant = 'default' }) => {
  const isLarge = variant === 'large';

  return (
    <div className={`cursor-pointer transition hover:shadow-lg hover:shadow-[#1DB954]/20 ${
      isLarge ? 'w-40 flex-shrink-0' : 'w-40 flex-shrink-0'
    }`}>
      <div className={`group relative overflow-hidden rounded-xl aspect-square ${
        isLarge ? 'border-[8px] border-white rounded-xl' : ''
      }`}>
        <img
          src={playlist.image}
          alt={playlist.title}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        />

        <button className="absolute inset-0 m-auto w-12 h-12 bg-[#FF6B6B] rounded-full shadow-lg hover:bg-[#FF8585] transition flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transform duration-200">
          <Play size={24} className="text-white fill-white" />
        </button>
      </div>

      <div className="pt-2 text-left">
        <h3 className="text-white font-semibold text-[15px] leading-tight truncate">
          {playlist.title}
        </h3>
      </div>
    </div>
  );
};

export default PlaylistCard;
