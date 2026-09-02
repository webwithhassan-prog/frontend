import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin, Building2, User } from "lucide-react";
import InstagramIcon from "../../components/common/InstagramIcon";

const Contact = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl md:text-4xl text-brand-blue text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        GET IN TOUCH
      </motion.h1>
      <p className="text-brand-blue/70 text-center mb-14">
        Questions about packages, sessions, or consultations? Fitness Zone is a
        message away.
      </p>

      <motion.div
        className="max-w-2xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl overflow-hidden shadow-md border border-brand-blue-pale">
          <div className="bg-[#4082C0] px-8 py-5 flex items-center gap-3">
            <Building2 className="text-white" size={20} />
            <h3 className="font-display text-white text-sm tracking-[0.15em]">
              COMPANY INFORMATION
            </h3>
          </div>

          <div className="bg-white px-8 py-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="bg-brand-orange/10 rounded-full p-2.5 h-fit">
                <User className="text-brand-orange" size={16} />
              </div>
              <div>
                <p className="text-brand-blue/50 text-xs italic mb-1">
                  Director / Founder
                </p>
                <p className="text-brand-blue font-semibold">
                  M Abu Bakar Siddique
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-brand-orange/10 rounded-full p-2.5 h-fit">
                <MapPin className="text-brand-orange" size={16} />
              </div>
              <div>
                <p className="text-brand-blue/50 text-xs italic mb-1">
                  Registered Office
                </p>
                <p className="text-brand-blue font-semibold leading-relaxed">
                  Office 20790, 182–184 High Street North
                  <br />
                  London, United Kingdom
                  <br />
                  E6 2JA
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: MessageCircle,
            label: "WHATSAPP",
            desc: "Fastest way to reach us",
            onClick: () => window.open("https://wa.me/yourNumber", "_blank"),
          },
          {
            icon: InstagramIcon,
            label: "INSTAGRAM",
            desc: "See our latest sessions",
            onClick: () =>
              window.open(
                "https://www.instagram.com/fitness_zone5566",
                "_blank",
              ),
          },
          {
            icon: Mail,
            label: "EMAIL",
            desc: "fitnesszoneofficial.uk26@gmail.com",
            onClick: () =>
              (window.location.href =
                "mailto:fitnesszoneofficial.uk26@gmail.com"),
          },
          {
            icon: MapPin,
            label: "BASED IN",
            desc: "London, United Kingdom",
            onClick: null,
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div
              onClick={item.onClick || undefined}
              className={`h-full rounded-2xl overflow-hidden shadow-md border border-brand-blue-pale bg-white transition-transform ${
                item.onClick
                  ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg"
                  : ""
              }`}
            >
              <div className="bg-[#4082C0] px-5 py-3 flex items-center gap-2">
                <item.icon className="text-white shrink-0" size={16} />
                <h3 className="font-display text-white text-xs tracking-wide">
                  {item.label}
                </h3>
              </div>
              <div className="px-5 py-6 text-center">
                <p className="text-brand-blue/70 text-sm break-words">
                  {item.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Contact;
