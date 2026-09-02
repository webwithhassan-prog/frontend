import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="text-center">
          <MessageCircle className="mx-auto text-brand-orange mb-3" size={32} />
          <h3 className="font-display text-brand-blue text-sm mb-2">
            WHATSAPP
          </h3>
          <p className="text-brand-blue/70 text-sm mb-4">
            Fastest way to reach us
          </p>
          <Button
            onClick={() => window.open("https://wa.me/yourNumber", "_blank")}
          >
            Chat Now
          </Button>
        </Card>

        <Card className="text-center">
          <InstagramIcon className="mx-auto text-brand-orange mb-3" size={32} />
          <h3 className="font-display text-brand-blue text-sm mb-2">
            INSTAGRAM
          </h3>
          <p className="text-brand-blue/70 text-sm mb-4">
            See our latest sessions
          </p>
          <Button
            onClick={() =>
              window.open(
                "https://www.instagram.com/fitness_zone5566",
                "_blank",
              )
            }
          >
            Follow Us
          </Button>
        </Card>

        <Card className="text-center">
          <Mail className="mx-auto text-brand-orange mb-3" size={32} />
          <h3 className="font-display text-brand-blue text-sm mb-2">EMAIL</h3>
          <p className="text-brand-blue/70 text-sm">support@fitnesszone.com</p>
        </Card>

        <Card className="text-center">
          <MapPin className="mx-auto text-brand-orange mb-3" size={32} />
          <h3 className="font-display text-brand-blue text-sm mb-2">
            BASED IN
          </h3>
          <p className="text-brand-blue/70 text-sm">Lahore, Pakistan</p>
        </Card>
      </div>
    </section>
  );
};

export default Contact;
