export const buildBackgroundStyle = (image, options = {}) => {
  if (!image) return {};

  const {
    overlayStart = 'rgba(255,255,255,0.85)',
    overlayEnd = overlayStart,
    attachment = 'scroll',
  } = options;

  const attachmentValue = `${attachment}, ${attachment}`;

  return {
    backgroundImage: `linear-gradient(${overlayStart}, ${overlayEnd}), url(${image})`,
    backgroundSize: 'cover, cover',
    backgroundPosition: 'center, center',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundAttachment: attachmentValue,
  };
};
