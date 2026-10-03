import { useState } from "react";

function SafeImage({ src, alt, className, fallbackClass = "bg-gradient-to-br from-green-200 to-emerald-300" }) {
  const [error, setError] = useState(false);

  if (error) {
    return <div className={`${className} ${fallbackClass}`} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

export default SafeImage;