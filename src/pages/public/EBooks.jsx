import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const EBooks = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await api.get("/ebooks/public");
        setEbooks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEbooks();
  }, []);

  const handleBuy = async (ebook) => {
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
      });
      window.location.href = res.data.url;
    } catch (err) {
      setError(
        err.response?.data?.message || "Checkout failed. Please try again.",
      );
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
        E-BOOKS
      </motion.h1>
      <p className="text-brand-blue/70 text-center mb-14">
        Guides and resources you can keep — available to purchase individually.
      </p>

      {error && (
        <p className="text-red-500 text-center text-sm mb-6">{error}</p>
      )}

      {loading ? (
        <p className="text-center text-brand-blue/70">Loading e-books...</p>
      ) : ebooks.length === 0 ? (
        <p className="text-center text-brand-blue/70">
          No e-books available yet.
        </p>
      ) : (
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
                <BookOpen className="text-brand-orange mb-3" size={28} />
                <h3 className="font-display text-brand-blue text-base mb-2">
                  {ebook.title}
                </h3>
                <p className="text-brand-blue/70 text-sm mb-4 flex-1">
                  {ebook.description}
                </p>
                <p className="font-display text-xl text-brand-blue mb-4">
                  Rs {ebook.price.toLocaleString()}
                </p>
                <Button
                  onClick={() => handleBuy(ebook)}
                  disabled={buyingId === ebook._id}
                >
                  {buyingId === ebook._id ? "Redirecting..." : "Buy Now"}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default EBooks;
