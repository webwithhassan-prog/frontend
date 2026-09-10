import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useCurrency } from "../../context/CurrencyContext";

const CurrencySwitcher = ({ className = "" }) => {
  const { currency, currencies, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? currencies.filter((c) =>
        c.code.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : currencies;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm font-semibold text-brand-blue border border-brand-blue-pale rounded-full px-4 py-2 hover:border-brand-orange hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
        aria-label={`Currency: ${currency.code}. Click to change`}
      >
        <span>{currency.symbol.trim()}</span>
        {currency.code}
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-brand-blue-pale py-1.5 z-20"
            >
              <div className="px-2 pb-1.5 mb-1 border-b border-brand-blue-pale/60 relative">
                <Search
                  size={13}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue/40"
                />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search currency..."
                  className="w-full pl-6 pr-2 py-1.5 text-sm text-brand-blue outline-none"
                />
              </div>
              <div className="max-h-56 overflow-y-auto">
                {filtered.length > 0 ? (
                  filtered.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setIsOpen(false);
                        setQuery("");
                      }}
                      className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:bg-brand-blue-pale ${
                        currency.code === c.code
                          ? "text-brand-orange font-semibold"
                          : "text-brand-blue hover:bg-brand-blue-pale"
                      }`}
                    >
                      <span>{c.code}</span>
                      <span className="text-brand-blue/50">
                        {c.symbol.trim()}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-2 text-sm text-brand-blue/50">
                    No match found.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySwitcher;
