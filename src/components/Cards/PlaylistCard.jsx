import React from 'react';
import { Play, Music } from 'lucide-react';

const PlaylistCard = ({ playlist, variant = 'default', onClick }) => {
  const isLarge = variant === 'large';
  
  // Handle different data structures (Home data vs API data)
  const title = playlist.title || playlist.name || 'Unknown';
  const image = playlist.image || playlist.cover_url;
  const artist = playlist.artist || playlist.artist_name;

  return (
    <div
      className={`cursor-pointer transition-all duration-300 active:scale-95 ${
        isLarge ? 'w-40 md:w-56 shrink-0' : 'w-40 md:w-52 shrink-0'
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && onClick) {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className={`group relative overflow-hidden rounded-lg aspect-square ${
        isLarge ? 'border-4 border-white rounded-lg' : ''
      } shadow-lg transition-all duration-300 hover:shadow-xl`}>
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              console.warn('Playlist image failed to load:', title);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center">
            <Music size={48} className="text-white/50" />
          </div>
        )}

        {/* Play button overlay */}
        <button className="absolute inset-0 m-auto w-14 h-14 bg-red-500 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transform hover:bg-red-600">
          <Play size={28} className="text-white fill-white ml-1" />
        </button>
      </div>

      {/* Card title and artist */}
      <div className="pt-3 text-left">
        <h3 className="text-white font-semibold text-sm leading-tight truncate group-hover:text-red-400 transition">
          {title}
        </h3>
        {artist && (
          <p className="text-white/60 text-xs truncate mt-1">
            {artist}
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard;
