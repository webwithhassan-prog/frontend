// Every catch block across the app follows the same pattern: show the
// backend's message if it sent one, otherwise fall back to a generic
// string. The fallback strings are already specific about *what* failed
// ("Failed to ban client") but never say what to do about it. This adds
// that missing next step, and gives a genuinely different message for the
// one case that isn't really "the action failed" at all — the request
// never reached the server (offline, DNS failure, CORS, timeout).
export const getErrorMessage = (err, fallback) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (!err?.response) {
    return "Couldn't connect — check your internet connection and try again.";
  }
  return `${fallback} — please try again.`;
};
