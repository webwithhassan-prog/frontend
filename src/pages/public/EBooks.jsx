import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { useCurrency } from "../../context/CurrencyContext";
import CurrencySwitcher from "../../components/common/CurrencySwitcher";
import { getErrorMessage } from "../../utils/errors";
import { optimizeCloudinaryUrl } from "../../utils/cloudinary";
import Modal from "../../components/admin/Modal";
import ManualPaymentPanel from "../../components/common/ManualPaymentPanel";

const EBooks = () => {
  const [ebooks, setEbooks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { format, currency, countryCode } = useCurrency();
  const { role } = useAuth();
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

  // Which manual (non-Stripe) payment methods, if any, apply to this
  // client's detected country — entirely admin-managed, see
  // admin/ManualPaymentMethods.jsx.
  useEffect(() => {
    if (!countryCode) return;
    api
      .get("/manual-payment-methods/public", { params: { country: countryCode } })
      .then((res) => setManualMethods(res.data))
      .catch((err) => console.error(err));
  }, [countryCode]);

  const handleBuyEbook = async (ebook) => {
    setError("");

    if (role !== "client") {
      localStorage.setItem("pending_ebook_id", ebook._id);
      navigate("/signup");
      return;
    }

    setBuyingId(ebook._id);
    try {
      const clientId = localStorage.getItem("client_id");
      const res = await api.post("/payments/stripe/ebook-checkout", {
        client_id: clientId,
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

    if (role !== "client") {
      localStorage.setItem("pending_course_id", course._id);
      navigate("/signup");
      return;
    }

    setBuyingId(course._id);
    try {
      const clientId = localStorage.getItem("client_id");
      const res = await api.post("/payments/stripe/course-checkout", {
        client_id: clientId,
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {ebooks.map((ebook, i) => (
                  <motion.div
                    key={ebook._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Card className="h-full flex flex-col">
                      {ebook.banner_url ? (
                        <a
                          href={ebook.banner_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Tap to view full image"
                          aria-label={`View full cover image for ${ebook.title}`}
                          className="aspect-video -mt-1 mb-3 rounded-lg overflow-hidden bg-brand-blue-pale block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                        >
                          <img
                            src={optimizeCloudinaryUrl(ebook.banner_url, 500)}
                            alt={ebook.title}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ) : (
                        <BookOpen className="text-brand-orange mb-3" size={28} />
                      )}
                      <h3 className="font-display text-brand-blue text-base mb-2">
                        {ebook.title}
                      </h3>
                      <p className="text-brand-blue/70 text-sm mb-4 flex-1">
                        {ebook.description}
                      </p>
                      <p className="font-display text-xl text-brand-blue mb-4">
                        {format(ebook.price)}
                      </p>
                      <Button
                        onClick={() => handleBuyEbook(ebook)}
                        disabled={buyingId === ebook._id}
                      >
                        {buyingId === ebook._id ? "Redirecting..." : "Buy Now"}
                      </Button>
                      {role === "client" && manualMethods.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setManualPayFor({
                              type: "ebook",
                              id: ebook._id,
                              itemLabel: ebook.title,
                              amountLabel: format(ebook.price),
                            })
                          }
                          className="mt-2 w-full text-center text-xs text-brand-blue-light hover:text-brand-orange underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded"
                        >
                          Pay via Bank Transfer / JazzCash / Easypaisa
                        </button>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {courses.length > 0 && (
            <div>
              <p className="font-display text-brand-orange text-xs tracking-[0.15em] text-center mb-6">
                COURSES
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {courses.map((course, i) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Card className="h-full flex flex-col">
                      {course.banner_url ? (
                        <a
                          href={course.banner_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Tap to view full image"
                          aria-label={`View full cover image for ${course.title}`}
                          className="aspect-video -mt-1 mb-3 rounded-lg overflow-hidden bg-brand-blue-pale block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                        >
                          <img
                            src={optimizeCloudinaryUrl(course.banner_url, 500)}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ) : (
                        <GraduationCap className="text-brand-blue-light mb-3" size={28} />
                      )}
                      <h3 className="font-display text-brand-blue text-base mb-2">
                        {course.title}
                      </h3>
                      <p className="text-brand-blue/70 text-sm mb-3 flex-1">
                        {course.description}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-brand-blue/50 mb-3">
                        <Video size={13} /> {course.lesson_count} lesson
                        {course.lesson_count === 1 ? "" : "s"}
                      </p>
                      <p className="font-display text-xl text-brand-blue mb-4">
                        {format(course.price)}
                      </p>
                      <Button
                        onClick={() => handleBuyCourse(course)}
                        disabled={buyingId === course._id}
                      >
                        {buyingId === course._id ? "Redirecting..." : "Buy Now"}
                      </Button>
                      {role === "client" && manualMethods.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setManualPayFor({
                              type: "course",
                              id: course._id,
                              itemLabel: course.title,
                              amountLabel: format(course.price),
                            })
                          }
                          className="mt-2 w-full text-center text-xs text-brand-blue-light hover:text-brand-orange underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded"
                        >
                          Pay via Bank Transfer / JazzCash / Easypaisa
                        </button>
                      )}
                    </Card>
                  </motion.div>
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

      <Modal
        isOpen={!!manualPayFor}
        onClose={() => setManualPayFor(null)}
        title="Manual Payment"
      >
        {manualPayFor && (
          <ManualPaymentPanel
            methods={manualMethods}
            type={manualPayFor.type}
            ebookId={manualPayFor.type === "ebook" ? manualPayFor.id : undefined}
            courseId={manualPayFor.type === "course" ? manualPayFor.id : undefined}
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
