import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Video } from "lucide-react";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { useCurrency } from "../../context/CurrencyContext";
import CurrencySwitcher from "../../components/common/CurrencySwitcher";
import { getErrorMessage } from "../../utils/errors";
import { optimizeCloudinaryUrl } from "../../utils/cloudinary";
import Modal from "../../components/admin/Modal";
import ManualPaymentPanel from "../../components/common/ManualPaymentPanel";

// Shop grid tile: cover, name and price only. Tapping it opens the full
// description and payment options (the page used to show everything for
// every item at once).
const ShopTile = ({ item, price, Icon, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="group flex flex-col text-left h-full rounded-2xl bg-white border border-brand-blue-pale shadow-sm hover:shadow-md hover:border-brand-orange transition-all overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
  >
    <span className="block aspect-[4/3] bg-brand-blue-pale overflow-hidden">
      {item.banner_url ? (
        <img
          src={optimizeCloudinaryUrl(item.banner_url, 400)}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <span className="w-full h-full flex items-center justify-center">
          <Icon className="text-brand-orange" size={32} aria-hidden="true" />
        </span>
      )}
    </span>
    <span className="flex flex-col flex-1 p-3">
      <span className="font-display text-brand-blue text-sm leading-snug line-clamp-2 flex-1">
        {item.title}
      </span>
      <span className="font-display text-base text-brand-blue mt-2">{price}</span>
      <span className="text-[11px] font-semibold text-brand-orange mt-1">View details</span>
    </span>
  </button>
);

const EBooks = () => {
  const [ebooks, setEbooks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  // The e-book / course whose details are open: { type, item }.
  const [viewing, setViewing] = useState(null);
  const [error, setError] = useState("");
  const { format, currency, paymentCountry, payLabel } = useCurrency();
  // Asks "Where are you joining from?" once these prices are on screen.
  const [manualMethods, setManualMethods] = useState([]);
  const [manualPayFor, setManualPayFor] = useState(null); // { type, id, itemLabel, amountLabel }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ebooksRes, coursesRes] = await Promise.all([
          api.get("/ebooks/public"),
          api.get("/courses/public"),
        ]);
        setEbooks(ebooksRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Which manual (non-Stripe) payment methods, if any, apply to the
  // country tied to the client's currently-selected currency — entirely
  // admin-managed, see admin/ManualPaymentMethods.jsx. Tied to the
  // currency (not the raw geo-detected country) so switching currency
  // manually also switches which methods show.
  const manualMethodsCountry = paymentCountry;
  useEffect(() => {
    if (!manualMethodsCountry) {
      setManualMethods([]);
      return;
    }
    api
      .get("/manual-payment-methods/public", {
        params: { country: manualMethodsCountry },
      })
      .then((res) => setManualMethods(res.data))
      .catch((err) => console.error(err));
  }, [manualMethodsCountry]);

  const handleManualPayClick = (payload) => {
    setManualPayFor(payload);
  };

  // No client_id here — the backend resolves that from the auth token when
  // logged in, and lets Stripe's own checkout page collect an email (plus
  // phone/name) for a guest.
  const handleBuyEbook = async (ebook) => {
    setError("");
    setBuyingId(ebook._id);
    try {
      const res = await api.post("/payments/stripe/ebook-checkout", {
        ebook_id: ebook._id,
        currency_code: currency.code,
      });
      window.location.href = res.data.url;
    } catch (err) {
      setError(getErrorMessage(err, "Checkout failed"));
      setBuyingId(null);
    }
  };

  const handleBuyCourse = async (course) => {
    setError("");
    setBuyingId(course._id);
    try {
      const res = await api.post("/payments/stripe/course-checkout", {
        course_id: course._id,
        currency_code: currency.code,
      });
      window.location.href = res.data.url;
    } catch (err) {
      setError(getErrorMessage(err, "Checkout failed"));
      setBuyingId(null);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl md:text-4xl text-brand-blue text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        E-BOOKS & COURSES
      </motion.h1>
      <p className="text-brand-blue/70 text-center mb-4">
        Guides and resources you can keep — available to purchase individually.
      </p>
      <div className="flex justify-center mb-10">
        <CurrencySwitcher />
      </div>

      {error && (
        <p className="text-red-500 text-center text-sm mb-6">{error}</p>
      )}

      {loading ? (
        <Loader />
      ) : (
        <>
          {ebooks.length > 0 && (
            <div className={courses.length > 0 ? "mb-16" : ""}>
              <p className="font-display text-brand-orange text-xs tracking-[0.15em] text-center mb-6">
                E-BOOKS
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {ebooks.map((ebook) => (
                  <ShopTile
                    key={ebook._id}
                    item={ebook}
                    price={format(ebook.price)}
                    Icon={BookOpen}
                    onOpen={() => setViewing({ type: "ebook", item: ebook })}
                  />
                ))}
              </div>
            </div>
          )}

          {courses.length > 0 && (
            <div>
              <p className="font-display text-brand-orange text-xs tracking-[0.15em] text-center mb-6">
                COURSES
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {courses.map((course) => (
                  <ShopTile
                    key={course._id}
                    item={course}
                    price={format(course.price)}
                    Icon={GraduationCap}
                    onOpen={() => setViewing({ type: "course", item: course })}
                  />
                ))}
              </div>
            </div>
          )}

          {ebooks.length === 0 && courses.length === 0 && (
            <p className="text-center text-brand-blue/70">
              No e-books or courses available yet.
            </p>
          )}
        </>
      )}

      {/* Full details and payment options for the tapped e-book / course */}
      <Modal
        isOpen={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.type === "course" ? "Course" : "E-Book"}
      >
        {viewing && (() => {
          const { type, item } = viewing;
          const isCourse = type === "course";
          return (
            <div>
              {item.banner_url && (
                <a
                  href={item.banner_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open the full image"
                  className="block aspect-video mb-4 rounded-lg overflow-hidden bg-brand-blue-pale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                >
                  <img
                    src={optimizeCloudinaryUrl(item.banner_url, 800)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </a>
              )}
              <h3 className="font-display text-brand-blue text-lg mb-2">{item.title}</h3>
              {item.description && (
                <p className="text-brand-blue/70 text-sm mb-3 whitespace-pre-line">
                  {item.description}
                </p>
              )}
              {isCourse && (
                <p className="flex items-center gap-1.5 text-xs text-brand-blue/50 mb-3">
                  <Video size={13} /> {item.lesson_count} lesson
                  {item.lesson_count === 1 ? "" : "s"}
                </p>
              )}
              <p className="font-display text-2xl text-brand-blue mb-4">{format(item.price)}</p>
              <Button
                className="w-full"
                onClick={() => (isCourse ? handleBuyCourse(item) : handleBuyEbook(item))}
                disabled={buyingId === item._id}
              >
                {buyingId === item._id ? "Redirecting..." : payLabel}
              </Button>
              <p className="text-[11px] text-brand-blue-light text-center mt-1.5">
                Instant Access
              </p>
              {manualMethods.length > 0 && (
                <>
                  <Button
                    variant="secondary"
                    className="w-full mt-3"
                    onClick={() => {
                      setViewing(null);
                      handleManualPayClick({
                        type,
                        id: item._id,
                        itemLabel: item.title,
                        amountLabel: format(item.price),
                      });
                    }}
                  >
                    {manualMethods.map((m) => m.name).join(" / ")}
                  </Button>
                  <p className="text-[11px] text-brand-blue-light text-center mt-1.5">
                    Instant Access (once your payment is verified by our team)
                  </p>
                </>
              )}
            </div>
          );
        })()}
      </Modal>

      <Modal
        isOpen={!!manualPayFor}
        onClose={() => setManualPayFor(null)}
        title="Manual Payment"
      >
        {manualPayFor && (
          <ManualPaymentPanel
            methods={manualMethods}
            type={manualPayFor.type}
            ebookId={
              manualPayFor.type === "ebook" ? manualPayFor.id : undefined
            }
            courseId={
              manualPayFor.type === "course" ? manualPayFor.id : undefined
            }
            itemLabel={manualPayFor.itemLabel}
            amountLabel={manualPayFor.amountLabel}
            currencyCode={currency.code}
          />
        )}
      </Modal>
    </section>
  );
};

export default EBooks;
