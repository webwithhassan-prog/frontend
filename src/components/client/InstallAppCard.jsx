import { useEffect, useState } from "react";
import { Smartphone, Share, X } from "lucide-react";
import Button from "../common/Button";
import {
  isInstalled,
  isIOS,
  canPromptInstall,
  promptInstall,
  onInstallChange,
} from "../../utils/installPrompt";

const DISMISS_KEY = "install_card_dismissed";

const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
};

// "Install Fitness Zone" on the client dashboard: a one-tap install button
// where the browser offers one, Share → Add to Home Screen steps on
// iPhone, nothing once installed (or after "Not now").
const InstallAppCard = ({ className = "" }) => {
  const [, setTick] = useState(0);
  const [dismissed, setDismissed] = useState(readDismissed);
  const [showIosSteps, setShowIosSteps] = useState(false);

  useEffect(() => onInstallChange(() => setTick((n) => n + 1)), []);

  if (dismissed || isInstalled()) return null;
  const ios = isIOS();
  if (!canPromptInstall() && !ios) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode: hidden for this visit only */
    }
    setDismissed(true);
  };

  return (
    <div
      className={`relative flex items-start gap-3 rounded-2xl border border-brand-blue-pale bg-white p-4 shadow-sm ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center shrink-0">
        <Smartphone className="text-white" size={20} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0 pr-6">
        <p className="font-semibold text-brand-blue text-sm">Install the Fitness Zone app</p>
        <p className="text-xs text-brand-blue/70 mt-0.5">
          Open your classes and diet plan from your home screen in one tap — no
          app store needed.
        </p>
        {ios ? (
          showIosSteps ? (
            <ol className="mt-2 text-xs text-brand-blue space-y-1 list-decimal list-inside">
              <li>
                Tap <Share size={12} className="inline -mt-0.5" aria-label="Share" /> Share at
                the bottom of Safari
              </li>
              <li>Choose “Add to Home Screen”</li>
              <li>Tap “Add”</li>
            </ol>
          ) : (
            <Button size="sm" className="mt-3" onClick={() => setShowIosSteps(true)}>
              Show me how
            </Button>
          )
        ) : (
          <Button
            size="sm"
            className="mt-3"
            onClick={async () => {
              const outcome = await promptInstall();
              if (outcome === "accepted") dismiss();
            }}
          >
            Install app
          </Button>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-3 right-3 text-brand-blue/40 hover:text-brand-blue rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        aria-label="Not now"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default InstallAppCard;
