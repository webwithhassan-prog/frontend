import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../components/common/Card";
import CompleteAccountForm from "../../components/common/CompleteAccountForm";

// Reached from the "set your password" link emailed after a guest checkout
// or a verified manual payment claim — the account already exists (created
// behind the scenes), this is just where they finish setting it up.
const CompleteAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  return (
    <section className="max-w-md mx-auto px-6 py-24">
      <motion.h1
        className="font-display text-3xl text-brand-blue text-center mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        YOU'RE IN
      </motion.h1>
      <p className="text-brand-blue/70 text-center mb-8">
        Just confirm your phone number and set a password to access your
        account.
      </p>

      <Card>
        <CompleteAccountForm
          token={token}
          onDone={() => navigate("/client")}
        />
      </Card>
    </section>
  );
};

export default CompleteAccount;
