import React from 'react';

const PageBackground = ({
  image,
  overlayStart = 'rgba(255,255,255,0.25)',
  overlayEnd = overlayStart,
}) => {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 -z-10 bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(${overlayStart}, ${overlayEnd}), url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    />
  );
};

export default PageBackground;

