import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center opacity-70 animate-loader-drop">
      <span className="loader" aria-label="Loading" role="status" />
    </div>
  );
};

export default LoadingSpinner;