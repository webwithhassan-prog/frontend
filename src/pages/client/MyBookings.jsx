import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const clientId = localStorage.getItem('client_id');
      const res = await api.get(`/bookings/${clientId}`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    await api.put(`/bookings/${id}/cancel`);
    fetchBookings();
  };

  const now = new Date();
  const upcoming = bookings.filter((b) => {
    const session = b.class_ref || b.consultation_ref;
    return b.status === 'booked' && session && new Date(session.datetime) >= now;
  });
  const past = bookings.filter((b) => {
    const session = b.class_ref || b.consultation_ref;
    return b.status !== 'booked' || (session && new Date(session.datetime) < now);
  });

  const renderBookingCard = (booking, isUpcoming) => {
    const session = booking.class_ref || booking.consultation_ref;
    const label = booking.class_ref ? booking.class_ref.type : 'Consultation';

    return (
      <Card key={booking._id}>
        <h3 className="text-brand-blue font-bold text-sm mb-1">{label}</h3>
        <p className="text-brand-blue-light text-xs mb-1">
          {session ? new Date(session.datetime).toLocaleString() : '—'}
        </p>
        <p className="text-brand-blue-light text-xs mb-4 capitalize">Status: {booking.status}</p>

        {isUpcoming && booking.status === 'booked' && (
          <div className="flex gap-3">
            <Button
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_API_URL}/join/booking/${booking._id}`)
              }
            >
              Join Class
            </Button>
            <button
              onClick={() => handleCancel(booking._id)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        My Bookings
      </motion.h1>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <>
          <h2 className="text-lg font-bold text-brand-blue mb-4">Upcoming</h2>
          {upcoming.length === 0 ? (
            <p className="text-brand-blue-light mb-10">No upcoming bookings.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {upcoming.map((b) => renderBookingCard(b, true))}
            </div>
          )}

          <h2 className="text-lg font-bold text-brand-blue mb-4">Past</h2>
          {past.length === 0 ? (
            <p className="text-brand-blue-light">No past bookings yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {past.map((b) => renderBookingCard(b, false))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBookings;