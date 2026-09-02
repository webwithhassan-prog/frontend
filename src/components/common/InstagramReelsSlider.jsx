import { motion } from "framer-motion";
import { Play, Image as ImageIcon } from "lucide-react";
import InstagramIcon from "./InstagramIcon";

const posts = [
  { url: "https://www.instagram.com/reel/DEAvyM7skJR/", type: "reel" },
  { url: "https://www.instagram.com/reel/DCoqBeTIkHV/", type: "reel" },
  { url: "https://www.instagram.com/reel/DAqnzxTs8HC/", type: "reel" },
  { url: "https://www.instagram.com/p/C-513yJokem/", type: "post" },
  { url: "https://www.instagram.com/p/C7WI0MLIghc/", type: "post" },
  { url: "https://www.instagram.com/p/DCRRR3asLxi/", type: "post" },
  { url: "https://www.instagram.com/p/DYMbJchjIXs/", type: "post" },
  { url: "https://www.instagram.com/p/DYErUNPDorH/", type: "post" },
  { url: "https://www.instagram.com/p/DO5u-ohDK44/", type: "post" },
  { url: "https://www.instagram.com/reel/DQef5qRDLCs/", type: "reel" },
  { url: "https://www.instagram.com/reel/DNTDjRoMbPN/", type: "reel" },
  { url: "https://www.instagram.com/p/DIndC4xoehe/", type: "post" },
  { url: "https://www.instagram.com/reel/DGSQtF9SXFO/", type: "reel" },
  { url: "https://www.instagram.com/p/C9ooToaoVo3/", type: "post" },
];

const InstagramReelsSlider = () => {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map((post, i) => (
          <motion.a
            key={post.url}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-[#4082C0] to-brand-blue flex flex-col items-center justify-center gap-2 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="bg-white/15 rounded-full p-3 group-hover:bg-white/25 transition-colors">
              {post.type === "reel" ? (
                <Play size={22} fill="white" />
              ) : (
                <ImageIcon size={22} />
              )}
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide">
              {post.type === "reel" ? "Reel" : "Post"}
            </span>
          </motion.a>
        ))}
      </div>

      <div className="text-center mt-10">
        <a
          href="https://www.instagram.com/fitness_zone5566"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark transition-colors text-white font-semibold px-6 py-3 rounded-full"
        >
          <InstagramIcon size={18} />
          Follow @fitness_zone5566 on Instagram
        </a>
      </div>
    </div>
  );
};

export default InstagramReelsSlider;
