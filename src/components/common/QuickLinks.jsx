import { Link } from "react-router-dom";
import { Clock, Package, PlayCircle } from "lucide-react";
import InstagramIcon from "./InstagramIcon";

const tileClass =
  "flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 rounded-xl bg-white border border-brand-blue-pale shadow-sm px-1.5 py-2.5 sm:px-4 sm:py-3 text-center hover:border-brand-orange hover:text-brand-orange text-brand-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange";
const iconClass =
  "flex items-center justify-center w-8 h-8 rounded-full bg-brand-orange/10 text-brand-orange-dark shrink-0";
const labelClass = "text-[11px] sm:text-sm font-semibold leading-tight";

// One row of shortcuts under the stats: packages, class times, the demo
// videos further down this page, and Instagram.
const QuickLinks = () => (
  <nav aria-label="Quick links" className="px-4 sm:px-6 pt-6">
    <div className="max-w-3xl mx-auto grid grid-cols-4 gap-2 sm:gap-3">
      <Link to="/plans" className={tileClass}>
        <span className={iconClass}>
          <Package size={16} />
        </span>
        <span className={labelClass}>Packages</span>
      </Link>
      <Link to="/timetable" className={tileClass}>
        <span className={iconClass}>
          <Clock size={16} />
        </span>
        <span className={labelClass}>Timings</span>
      </Link>
      <a
        href="#demo-sessions"
        onClick={(e) => {
          const target = document.getElementById("demo-sessions");
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }}
        className={tileClass}
      >
        <span className={iconClass}>
          <PlayCircle size={16} />
        </span>
        <span className={labelClass}>Demo Sessions</span>
      </a>
      <a
        href="https://www.instagram.com/fitness_zone5566"
        target="_blank"
        rel="noopener noreferrer"
        className={tileClass}
      >
        <span className={iconClass}>
          <InstagramIcon size={16} />
        </span>
        <span className={labelClass}>Instagram</span>
      </a>
    </div>
  </nav>
);

export default QuickLinks;
