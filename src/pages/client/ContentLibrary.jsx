import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const ContentLibrary = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const clientId = localStorage.getItem("client_id");
        const res = await api.get(`/content/client/${clientId}`);
        setContent(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setLocked(true);
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const categories = [...new Set(content.map((c) => c.category))];

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Content Library
      </motion.h1>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : locked ? (
        <Card className="text-center border-brand-orange border-2 max-w-lg">
          <motion.p
            className="text-brand-blue font-semibold mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Your subscription isn't active — renew to unlock the content
            library.
          </motion.p>
          <Button onClick={() => navigate("/plans")}>Renew / Upgrade</Button>
        </Card>
      ) : (
        categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-lg font-bold text-brand-blue mb-4 capitalize">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content
                .filter((item) => item.category === category)
                .map((item) => (
                  <Card key={item._id}>
                    <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-brand-blue-pale">
                      <iframe
                        src={item.youtube_link.replace("watch?v=", "embed/")}
                        title={item.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                    <h3 className="text-brand-blue font-bold text-sm">
                      {item.title}
                    </h3>
                  </Card>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ContentLibrary;
