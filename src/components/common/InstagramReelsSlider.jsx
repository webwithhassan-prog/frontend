import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import InstagramEmbed from "./InstagramEmbed";

const reelLinks = [
  "https://www.instagram.com/reel/DEAvyM7skJR/",
  "https://www.instagram.com/reel/DCoqBeTIkHV/",
  "https://www.instagram.com/reel/DAqnzxTs8HC/",
  "https://www.instagram.com/p/C-513yJokem/",
  "https://www.instagram.com/p/C7WI0MLIghc/",
  "https://www.instagram.com/p/DCRRR3asLxi/",
  "https://www.instagram.com/p/DYMbJchjIXs/",
  "https://www.instagram.com/p/DYErUNPDorH/",
  "https://www.instagram.com/p/DO5u-ohDK44/",
  "https://www.instagram.com/reel/DQef5qRDLCs/",
  "https://www.instagram.com/reel/DNTDjRoMbPN/",
  "https://www.instagram.com/p/DIndC4xoehe/",
  "https://www.instagram.com/reel/DGSQtF9SXFO/",
  "https://www.instagram.com/p/C9ooToaoVo3/",
];

const InstagramReelsSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reelLinks.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reelLinks.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const goPrev = () =>
    setIndex((prev) => (prev - 1 + reelLinks.length) % reelLinks.length);
  const goNext = () => setIndex((prev) => (prev + 1) % reelLinks.length);

  return (
    <div className="relative max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={reelLinks[index]}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
        >
          <InstagramEmbed url={reelLinks[index]} />
        </motion.div>
      </AnimatePresence>

      <button
        onClick={goPrev}
        className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white shadow-md rounded-full p-2 text-brand-blue hover:text-brand-orange transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goNext}
        className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white shadow-md rounded-full p-2 text-brand-blue hover:text-brand-orange transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {reelLinks.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show post ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-brand-orange" : "w-2 bg-brand-blue-pale"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default InstagramReelsSlider;
