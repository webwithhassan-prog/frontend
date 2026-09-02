import { useEffect } from "react";

let scriptPromise = null;
const loadInstagramScript = () => {
  if (window.instgrm) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }
  return scriptPromise;
};

// Renders one Instagram post/reel via Instagram's official embed widget.
// Give this a fresh `key` (e.g. the url) when swapping posts in a carousel —
// Instagram's script replaces the blockquote with an iframe and won't
// re-process an element it has already handled.
const InstagramEmbed = ({ url }) => {
  useEffect(() => {
    let cancelled = false;
    loadInstagramScript().then(() => {
      if (!cancelled && window.instgrm) {
        window.instgrm.Embeds.process();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="flex justify-center">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "12px",
          margin: "0 auto",
          maxWidth: "400px",
          minWidth: "300px",
          width: "100%",
        }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          View this post on Instagram
        </a>
      </blockquote>
    </div>
  );
};

export default InstagramEmbed;
