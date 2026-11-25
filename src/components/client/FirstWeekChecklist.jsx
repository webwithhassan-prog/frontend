import { useState } from "react";
import { CheckCircle2, Circle, X } from "lucide-react";
import { isInstalled } from "../../utils/installPrompt";

const DISMISS_KEY = "first_week_checklist_dismissed";
const SHOW_FOR_DAYS = 21;

const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
};

// "Your first week" — what a new client should do, ticked off as they do
// it, tailored to their package (Dietplan steps only for diet clients,
// class steps only for workout clients). Shows for their first three weeks
// until everything is done or they hide it.
const FirstWeekChecklist = ({
  client,
  hasDietplan,
  hasWorkout,
  loggedToday,
  pushOn,
  onEnablePush,
  className = "",
}) => {
  const [dismissed, setDismissed] = useState(readDismissed);
  const [now] = useState(() => Date.now());
  if (!client || dismissed) return null;

  const ageDays = (now - new Date(client.createdAt).getTime()) / 86400000;
  if (!(ageDays <= SHOW_FOR_DAYS)) return null;

  const scrollTo = (id) => (e) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const steps = [
    hasDietplan && {
      key: "onboarding",
      label: "Fill in your Day 1 form",
      done: !!client.onboarding_completed,
      href: "#onboarding-form",
      onClick: scrollTo("onboarding-form"),
    },
    hasWorkout && {
      key: "class",
      label: "Join your first live class",
      done: !!client.first_class_joined_at,
      href: "#upcoming-classes",
      onClick: scrollTo("upcoming-classes"),
    },
    {
      key: "log",
      label: "Log today's steps and water",
      done: !!loggedToday,
      href: "#daily-log",
      onClick: scrollTo("daily-log"),
    },
    hasDietplan && {
      key: "checkin",
      label: "Send your first weekly check-in",
      done: !!client.last_progress_checkin,
      href: "#weekly-progress",
      onClick: scrollTo("weekly-progress"),
    },
    onEnablePush && {
      key: "push",
      label: hasWorkout ? "Turn on class reminders" : "Turn on reminders",
      done: !!pushOn,
      onClick: (e) => {
        e.preventDefault();
        onEnablePush();
      },
    },
    {
      key: "install",
      label: "Add Fitness Zone to your home screen",
      done: isInstalled(),
      href: "#install-app",
      onClick: scrollTo("install-app"),
    },
  ].filter(Boolean);

  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) return null;

  const hide = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode */
    }
    setDismissed(true);
  };

  return (
    <section
      aria-labelledby="first-week-title"
      className={`relative rounded-2xl border border-brand-blue-pale bg-white p-4 sm:p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-1 pr-6">
        <h2 id="first-week-title" className="font-display text-base text-brand-blue">
          YOUR FIRST WEEK
        </h2>
        <span className="text-xs font-semibold text-brand-blue/60 tabular-nums">
          {doneCount}/{steps.length} done
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-brand-blue-pale overflow-hidden mb-3" aria-hidden="true">
        <div
          className="h-full bg-brand-orange rounded-full transition-all"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-1">
        {steps.map((s) => (
          <li key={s.key}>
            {s.done ? (
              <span className="flex items-center gap-2.5 py-1.5 text-sm text-brand-blue/50 line-through">
                <CheckCircle2 size={18} className="text-green-600 shrink-0" aria-hidden="true" />
                {s.label}
                <span className="sr-only">(done)</span>
              </span>
            ) : (
              <a
                href={s.href || "#"}
                onClick={s.onClick}
                className="flex items-center gap-2.5 py-1.5 text-sm font-medium text-brand-blue hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                <Circle size={18} className="text-brand-blue/30 shrink-0" aria-hidden="true" />
                {s.label}
              </a>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={hide}
        className="absolute top-3 right-3 text-brand-blue/40 hover:text-brand-blue rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        aria-label="Hide checklist"
      >
        <X size={16} />
      </button>
    </section>
  );
};

export default FirstWeekChecklist;
