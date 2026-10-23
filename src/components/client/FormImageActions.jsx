import { useState } from "react";
import { toPng } from "html-to-image";
import { AlertTriangle, CheckCircle2, Download, Share2 } from "lucide-react";
import Button from "../common/Button";
import Modal from "../admin/Modal";
import WhatsAppIcon from "../common/WhatsAppIcon";

const toFile = async (dataUrl, fileName) => {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], fileName, { type: "image/png" });
};

// Phones whose share sheet can take an image (most Android and iPhone
// browsers); desktop browsers mostly can't.
const canShareImages = () => {
  try {
    const probe = new File([""], "probe.png", { type: "image/png" });
    return !!navigator.canShare?.({ files: [probe] });
  } catch {
    return false;
  }
};

// Opens WhatsApp; falls back to the same tab if a pop-up was blocked (it
// can be, when opened after the image has finished saving).
const openWhatsApp = (link) => {
  const win = window.open(link, "_blank", "noopener,noreferrer");
  if (!win) window.location.href = link;
};

// Save / share / send for a form the client turns into an image for the
// dietitian (Day 1 onboarding, weekly progress). Clients kept tapping
// "Send to Dietician" without saving the image first and arrived in
// WhatsApp with nothing to send, so:
//  - a warning above the buttons says to save it (or screenshot it) first;
//  - tapping WhatsApp before saving opens a reminder that can save and
//    then open WhatsApp in one tap;
//  - phones that can share files get "Share image to WhatsApp", which
//    attaches the image itself.
// `onSaved` runs once the client has the image (saved, shared or
// screenshotted) — e.g. to mark the form as done.
const FormImageActions = ({
  cardRef,
  fileName,
  whatsappLink,
  shareText,
  onSaved,
  children,
}) => {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [canShareFiles] = useState(canShareImages);

  const markSaved = () => {
    if (!saved) onSaved?.();
    setSaved(true);
  };

  const renderImage = () => toPng(cardRef.current, { pixelRatio: 2 });

  const saveImage = async () => {
    if (!cardRef.current) return false;
    setBusy(true);
    try {
      const dataUrl = await renderImage();
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
      markSaved();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const shareImage = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const file = await toFile(await renderImage(), fileName);
      await navigator.share({ files: [file], text: shareText });
      markSaved();
    } catch (err) {
      // Closing the share sheet isn't an error worth reporting.
      if (err?.name !== "AbortError") console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const handleWhatsAppClick = (e) => {
    if (saved) return; // the link opens WhatsApp as usual
    e.preventDefault();
    setReminderOpen(true);
  };

  return (
    <>
      {saved ? (
        <p className="flex items-start gap-2.5 mt-6 text-sm text-green-800 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Image saved.</strong> Now tap &quot;Send to Dietician&quot;
            and attach it from your gallery in the WhatsApp chat.
          </span>
        </p>
      ) : (
        <p
          role="note"
          className="flex items-start gap-2.5 mt-6 text-sm text-amber-900 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3"
        >
          <AlertTriangle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Save this image first</strong> (or take a screenshot of
            it) — then send it to your dietitian on WhatsApp. Without the
            image, they can&apos;t see your form.
          </span>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-4">
        {canShareFiles && (
          <Button onClick={shareImage} disabled={busy}>
            <span className="flex items-center gap-2">
              <Share2 size={16} aria-hidden="true" />
              Share image to WhatsApp
            </span>
          </Button>
        )}
        <Button
          onClick={saveImage}
          disabled={busy}
          variant={canShareFiles ? "secondary" : "primary"}
        >
          <span className="flex items-center gap-2">
            <Download size={16} aria-hidden="true" />
            {busy ? "Saving…" : saved ? "Save again" : "Save Image"}
          </span>
        </Button>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="flex items-center gap-2 bg-[#25D366] text-white font-semibold rounded-full px-6 py-3 hover:brightness-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
        >
          <WhatsAppIcon size={16} />
          Send to Dietician
        </a>
        {children}
      </div>

      <Modal
        isOpen={reminderOpen}
        onClose={() => setReminderOpen(false)}
        title="Save your form first"
      >
        <p className="text-sm text-brand-blue/80 mb-5">
          Your dietitian needs this image to see your form. Save it (or take a
          screenshot) before opening WhatsApp, then attach it in the chat.
        </p>
        <div className="space-y-3">
          <Button
            className="w-full"
            disabled={busy}
            onClick={async () => {
              const ok = await saveImage();
              setReminderOpen(false);
              if (ok) openWhatsApp(whatsappLink);
            }}
          >
            {busy ? "Saving…" : "Save image, then open WhatsApp"}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              markSaved();
              setReminderOpen(false);
              openWhatsApp(whatsappLink);
            }}
          >
            I took a screenshot — open WhatsApp
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default FormImageActions;
