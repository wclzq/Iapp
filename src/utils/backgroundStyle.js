export const buildBackgroundStyle = (image, options = {}) => {
  if (!image) return {};

  const {
    overlayStart = 'rgba(255,255,255,0.35)',
    overlayEnd = overlayStart,
    attachment = 'fixed',
  } = options;

  const attachments = Array.isArray(attachment) ? attachment : [attachment, attachment];
  const [firstAttachment, secondAttachment] = attachments.length === 2
    ? attachments
    : [attachments[0], attachments[0]];

  return {
    backgroundImage: `linear-gradient(${overlayStart}, ${overlayEnd}), url(${image})`,
    backgroundSize: 'cover, cover',
    backgroundPosition: 'center, center',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundAttachment: `${firstAttachment}, ${secondAttachment}`,
  };
};
