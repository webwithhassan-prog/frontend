import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

// "View class times" on packages that include live classes, so people can
// check the schedule fits before paying. Lighter outline than the payment
// buttons above it, so paying stays the main action on the card.
const ClassTimesLink = ({ className = "" }) => (
  <Link
    to="/timetable"
    className={`inline-flex items-center justify-center gap-1.5 w-full rounded-full border border-brand-blue/30 bg-white px-4 py-2 text-xs font-semibold text-brand-blue hover:bg-brand-blue-pale transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 ${className}`}
  >
    <Clock size={14} aria-hidden="true" />
    View class times
  </Link>
);

export default ClassTimesLink;
