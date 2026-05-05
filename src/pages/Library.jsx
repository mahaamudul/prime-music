import React from 'react';
import { useLocation } from 'react-router-dom';

const Library = () => {
  const { state } = useLocation();
  const selectedItem = state?.item;

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-white mb-4">Library</h1>
      {selectedItem ? (
        <div className="max-w-md mx-auto rounded-xl border border-white/10 bg-white/5 p-4 text-left">
          <p className="text-white/60 text-sm mb-1">Selected Item</p>
          <h2 className="text-white text-lg font-semibold mb-2">{selectedItem.title || selectedItem.name}</h2>
          <p className="text-white/70 text-sm">Type: {state?.redirectType || selectedItem.redirectType}</p>
        </div>
      ) : (
        <p className="text-[#A0A0A0]">Coming soon...</p>
      )}
    </div>
  );
};

export default Library;
