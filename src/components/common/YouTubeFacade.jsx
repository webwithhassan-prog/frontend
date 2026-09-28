import { useState } from "react";
import { Play } from "lucide-react";
import { getYoutubeId } from "../../utils/youtube";

// Shows the video's thumbnail and loads the real YouTube player only when
// tapped. A live YouTube iframe pulls ~1MB of player scripts plus dozens of
// tracking/ad requests each — rendering one per video made pages with many
// videos (the client gallery, course lessons) heavy on phones.
const YouTubeFacade = ({ link, title = "Video", className = "", onPlay }) => {
  const [playing, setPlaying] = useState(false);
  const id = getYoutubeId(link);

  if (!id) {
    return (
      <div className={`flex items-center justify-center text-xs text-brand-blue/50 ${className}`}>
        Video unavailable
      </div>
    );
  }

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setPlaying(true);
        onPlay?.();
      }}
      aria-label={`Play video: ${title}`}
      className={`group relative block overflow-hidden bg-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${className}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <span className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-orange text-white shadow-lg group-hover:scale-105 transition-transform">
          <Play size={24} className="ml-1" fill="currentColor" />
        </span>
      </span>
    </button>
  );
};

export default YouTubeFacade;
