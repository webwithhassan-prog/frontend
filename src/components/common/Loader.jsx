import { Loader2 } from "lucide-react";

// A consistent loading indicator to replace plain "Loading..." text
// wherever the app is fetching data. `size` controls the spinner and
// `label` is optional accompanying text (defaults to none — just the spin).
const Loader = ({ size = 22, label, className = "" }) => (
  <div className={`flex items-center justify-center gap-2 py-10 ${className}`}>
    <Loader2 size={size} className="animate-spin text-brand-orange" />
    {label && <span className="text-brand-blue/60 text-sm">{label}</span>}
  </div>
);

export default Loader;
