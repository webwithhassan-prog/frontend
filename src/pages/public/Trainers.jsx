import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Card from '../../components/common/Card';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainersRes, consultantsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/trainers/public`),
          axios.get(`${import.meta.env.VITE_API_URL}/consultants/public`),
        ]);
        setTrainers(trainersRes.data);
        setConsultants(consultantsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl md:text-4xl text-brand-blue text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        MEET THE TEAM
      </motion.h1>

      {loading ? (
        <p className="text-center text-brand-blue/70">Loading...</p>
      ) : (
        <>
          <h2 className="font-display text-lg text-brand-blue mb-6">TRAINERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {trainers.map((t) => (
              <Card key={t._id}>
                <h3 className="font-display text-brand-blue text-base">{t.name}</h3>
                <p className="text-brand-blue/70 text-sm mt-1">{t.specialty}</p>
              </Card>
            ))}
          </div>

          <h2 className="font-display text-lg text-brand-blue mb-6">CONSULTANTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {consultants.map((c) => (
              <Card key={c._id}>
                <h3 className="font-display text-brand-blue text-base">{c.name}</h3>
                <p className="text-brand-blue/70 text-sm mt-1 capitalize">{c.specialty}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Trainers;