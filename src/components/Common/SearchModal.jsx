import React, { useState } from 'react';
import { X } from 'lucide-react';

const SearchModal = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/80 md:items-center md:justify-center">
      <div className="w-full bg-[#1A1F2E] rounded-t-3xl p-4 md:w-[720px] md:max-w-[92vw] md:rounded-3xl md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] leading-tight font-bold text-white">Search</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2A2F3E] rounded-full transition"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search songs, artists, playlists..."
          className="w-full bg-[#2A2F3E] text-white text-[15px] font-medium placeholder-[#A0A0A0] placeholder:text-[15px] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          autoFocus
        />

        {/* Search Results Placeholder */}
        <div className="mt-6 text-center text-[#A0A0A0] text-[12px] font-normal">
          {searchTerm ? (
            <p>Search results for: <span className="text-white">{searchTerm}</span></p>
          ) : (
            <p>Start typing to search...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
