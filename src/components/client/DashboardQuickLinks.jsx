import { Link } from "react-router-dom";
import {
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  Footprints,
  Package,
  BookOpen,
  Star,
  Video,
} from "lucide-react";
import WhatsAppIcon from "../common/WhatsAppIcon";

// One row of shortcuts at the top of the client dashboard: jump to a
// section on this page, or to the page clients most often look for.
// Swipeable on phones; a section link only shows when that section exists.
const DashboardQuickLinks = ({
  hasWorkout,
  hasDietplan,
  onboardingPending,
  dietitianWhatsapp,
}) => {
  const scrollTo = (id) => (e) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const links = [
    hasWorkout && {
      label: "Today's classes",
      icon: Video,
      anchor: "upcoming-classes",
    },
    onboardingPending && {
      label: "Day 1 form",
      icon: ClipboardList,
      anchor: "onboarding-form",
    },
    hasDietplan && {
      label: "Weekly check-in",
      icon: ClipboardCheck,
      anchor: "weekly-progress",
    },
    { label: "Today's log", icon: Footprints, anchor: "daily-log" },
    { label: "Class times", icon: CalendarClock, to: "/timetable" },
    { label: "Packages", icon: Package, to: "/plans" },
    { label: "E-books", icon: BookOpen, to: "/ebooks" },
    { label: "Leave a review", icon: Star, anchor: "your-review" },
    dietitianWhatsapp && {
      label: "Message dietitian",
      icon: WhatsAppIcon,
      href: dietitianWhatsapp,
    },
  ].filter(Boolean);

  const chip =
    "shrink-0 inline-flex items-center gap-2 rounded-full bg-white border border-brand-blue-pale shadow-sm px-4 py-2.5 text-sm font-semibold text-brand-blue hover:border-brand-orange hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange";

  return (
    <nav aria-label="Quick links" className="mb-8 -mx-6 sm:mx-0">
      <ul className="no-scrollbar flex gap-2 overflow-x-auto px-6 sm:px-0 sm:flex-wrap pb-1">
        {links.map(({ label, icon: Icon, anchor, to, href }) => (
          <li key={label} className="shrink-0">
            {to ? (
              <Link to={to} className={chip}>
                <Icon
                  size={16}
                  className="text-brand-orange"
                  aria-hidden="true"
                />
                {label}
              </Link>
            ) : href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={chip}
              >
                <Icon size={16} className="text-[#25D366]" aria-hidden="true" />
                {label}
              </a>
            ) : (
              <a
                href={`#${anchor}`}
                onClick={scrollTo(anchor)}
                className={chip}
              >
                <Icon
                  size={16}
                  className="text-brand-orange"
                  aria-hidden="true"
                />
                {label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DashboardQuickLinks;
