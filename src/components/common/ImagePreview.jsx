import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const ImagePreview = ({
  src,
  alt = '',
  className = 'w-full h-full object-cover',
  fallbackSrc,
  ...props
}) => {
  const [errored, setErrored] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Reset error state if src changes
  useEffect(() => {
    setErrored(false);
    setCurrentSrc(src);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    setErrored(true);
  };

  if (!src || errored) {
    return (
      <div
        role="img"
        aria-label={alt || 'No image available'}
        className={cn(
          'flex items-center justify-center bg-gray-100 dark:bg-gray-700',
          className
        )}
      >
        <ImageOff
          className="h-8 w-8 text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      loading="lazy"
      className={className}
      {...props}
    />
  );
};

export { ImagePreview };
export default ImagePreview;
