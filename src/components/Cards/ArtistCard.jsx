import React from 'react';

const ArtistCard = ({ artist }) => {
  return (
    <div className="w-28 flex-shrink-0 cursor-pointer transition hover:shadow-lg hover:shadow-[#1DB954]/20">
      <div className="group relative overflow-hidden rounded-full aspect-square">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover hover:scale-110 transition duration-300"
        />

        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
      </div>

      <div className="pt-2 text-left">
        <h3 className="text-white font-semibold text-[15px] leading-tight truncate">
          {artist.name}
        </h3>
      </div>
    </div>
  );
};

export default ArtistCard;
