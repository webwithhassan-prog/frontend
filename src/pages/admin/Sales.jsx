import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../services/api";
import Card from "../../components/common/Card";
import SkeletonTable from "../../components/common/SkeletonTable";
import { useCurrency } from "../../context/CurrencyContext";
import logo from "../../assets/logo.jpeg";

// Brand palette, matching src/index.css — jsPDF wants plain RGB tuples,
// not CSS variables.
const BRAND_BLUE = [18, 34, 74];
const BRAND_BLUE_LIGHT = [44, 68, 209];
const BRAND_ORANGE = [247, 107, 28];
const BRAND_BLUE_PALE = [234, 241, 255];

const categories = [
  ["package", "Packages"],
  ["ebook", "E-books"],
  ["course", "Courses"],
  ["custom", "Custom invoices"],
];

// "2026-10" -> "October 2026"
const monthLabel = (key) =>
  key
    ? new Date(`${key}-01T00:00:00`).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : "";

const gbp = (n) =>
  `£${(n || 0).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Escapes a value for a CSV cell — wraps in quotes and doubles any embedded
// quotes whenever the value itself could contain a comma, quote, or newline.
const csvCell = (value) => {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const downloadCsv = (filename, rows) => {
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const Sales = () => {
  const [summary, setSummary] = useState({
    daily_total: 0,
    monthly_total: 0,
    daily_total_settled: 0,
    monthly_total_settled: 0,
  });
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { currencies } = useCurrency();

  const symbolFor = (code) =>
    currencies.find((c) => c.code === code)?.symbol || `${code || "INR"} `;

  const fetchSummary = async () => {
    try {
      const res = await api.get("/sales/summary");
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // One calendar month (Pakistan time) of website card payments.
  const loadMonth = async (nextMonth, nextCategory) => {
    setSearching(true);
    try {
      const params = {};
      if (nextMonth) params.month = nextMonth;
      if (nextCategory) params.category = nextCategory;
      const res = await api.get("/sales/search", { params });
      setSearchResults(res.data);
      setMonth(res.data.month);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    loadMonth("", "");
  }, []);

  const loadImageAsDataUrl = (src) =>
    fetch(src)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      );

  const handleExportPdf = async () => {
    if (!searchResults) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const today = new Date();

    // Header band
    doc.setFillColor(...BRAND_BLUE);
    doc.rect(0, 0, pageWidth, 32, "F");

    try {
      const logoDataUrl = await loadImageAsDataUrl(logo);
      doc.addImage(logoDataUrl, "JPEG", 14, 7, 18, 18);
    } catch {
      // Logo is a nice-to-have — a failed fetch shouldn't block the report.
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("FITNESS ZONE", 37, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...BRAND_BLUE_PALE);
    doc.text("Sales Report", 37, 22);

    doc.setFontSize(9);
    doc.text(
      `Generated ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`,
      pageWidth - 14,
      15,
      { align: "right" },
    );
    doc.text(
      `${monthLabel(month)} · ${category ? categories.find(([k]) => k === category)?.[1] : "All categories"}`,
      pageWidth - 14,
      22,
      { align: "right" },
    );

    // Summary strip
    doc.setTextColor(...BRAND_BLUE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      `Total: £${searchResults.total_settled.toLocaleString("en-GB", { maximumFractionDigits: 2 })}  ·  ${searchResults.count} entries`,
      14,
      42,
    );

    autoTable(doc, {
      startY: 48,
      head: [["Date", "Category", "Price shown", "Charged (GBP)", "Base Price (INR)"]],
      body: searchResults.logs.map((log) => [
        new Date(log.date).toLocaleDateString(),
        log.category,
        `${log.currency_code || "INR"} ${(log.amount_display ?? log.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
        `GBP ${(log.amount_settled || 0).toFixed(2)}`,
        `INR ${log.amount.toLocaleString("en-IN")}`,
      ]),
      theme: "striped",
      headStyles: {
        fillColor: BRAND_BLUE,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: BRAND_BLUE_PALE },
      styles: { fontSize: 9, cellPadding: 4, textColor: BRAND_BLUE },
      margin: { left: 14, right: 14 },
      didDrawPage: () => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(...BRAND_BLUE_LIGHT);
        doc.text(
          "FITNESS ZONE • Confidential Sales Report",
          14,
          doc.internal.pageSize.getHeight() - 10,
        );
        doc.text(
          `Page ${pageCount}`,
          pageWidth - 14,
          doc.internal.pageSize.getHeight() - 10,
          { align: "right" },
        );
      },
    });

    doc.save(`sales-${month}-${category || "all"}.pdf`);
  };

  const handleExportCsv = () => {
    if (!searchResults) return;
    const rows = [
      ["Date", "Category", "Currency", "Price shown", "Charged (GBP)", "Base Price (INR)"],
      ...searchResults.logs.map((log) => [
        new Date(log.date).toLocaleDateString(),
        log.category,
        log.currency_code || "INR",
        log.amount_display ?? log.amount,
        (log.amount_settled || 0).toFixed(2),
        log.amount,
      ]),
    ];
    downloadCsv(`sales-${month}-${category || "all"}.csv`, rows);
  };

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Sales & Reporting
      </motion.h1>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <p className="text-brand-blue-light text-sm mb-1">Today's Sales</p>
          <p className="text-3xl font-bold text-brand-blue">
            {loading ? (
              <span className="inline-block h-8 w-32 rounded bg-brand-blue-pale animate-pulse" />
            ) : (
              `£${summary.daily_total_settled.toLocaleString("en-GB", { maximumFractionDigits: 2 })}`
            )}
          </p>
          {!loading && (
            <p className="text-brand-blue-light text-xs mt-1">
              ₹{summary.daily_total.toLocaleString("en-IN")} base price
            </p>
          )}
        </Card>
        <Card>
          <p className="text-brand-blue-light text-sm mb-1">
            This Month's Sales
          </p>
          <p className="text-3xl font-bold text-brand-blue">
            {loading ? (
              <span className="inline-block h-8 w-32 rounded bg-brand-blue-pale animate-pulse" />
            ) : (
              `£${summary.monthly_total_settled.toLocaleString("en-GB", { maximumFractionDigits: 2 })}`
            )}
          </p>
          {!loading && (
            <p className="text-brand-blue-light text-xs mt-1">
              ₹{summary.monthly_total.toLocaleString("en-IN")} base price
            </p>
          )}
        </Card>
      </div>

      {/* Monthly sales — website card payments only. Manual bank/wallet
          payments are listed under Manual Payments. */}
      <h2 className="text-lg font-bold text-brand-blue mb-1">Monthly Sales</h2>
      <p className="text-xs text-brand-blue-light mb-4">
        Website card payments only, in Pakistan time. Manual bank/wallet
        payments are under Manual Payments.
      </p>
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-semibold text-brand-blue">
            Month
            <select
              value={month}
              onChange={(e) => loadMonth(e.target.value, category)}
              className="border border-brand-blue-pale rounded-lg px-4 py-3 text-sm font-normal bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
            >
              {(searchResults?.months || (month ? [month] : [])).map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-brand-blue">
            Category
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                loadMonth(month, e.target.value);
              }}
              className="border border-brand-blue-pale rounded-lg px-4 py-3 text-sm font-normal bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
            >
              <option value="">All categories</option>
              {categories.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {searching && <SkeletonTable columns={4} rows={5} />}

      {searchResults && !searching && (
        <Card className="overflow-x-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <p className="text-brand-blue font-semibold">
              {monthLabel(searchResults.month)}: {gbp(searchResults.total_settled)}{" "}
              <span className="font-normal text-brand-blue-light">
                ({searchResults.count} sale{searchResults.count === 1 ? "" : "s"})
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                disabled={searchResults.logs.length === 0}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                <Download size={14} />
                Export CSV
              </button>
              <button
                onClick={handleExportPdf}
                disabled={searchResults.logs.length === 0}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-brand-blue-light/10 text-brand-blue-light hover:bg-brand-blue-light/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                <FileText size={14} />
                Export PDF
              </button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Price shown</th>
                <th className="py-3 px-2">Charged</th>
                <th className="py-3 px-2">Base Price</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 px-2 text-center text-brand-blue-light">
                    No website sales in {monthLabel(searchResults.month)}
                    {category ? " for this category" : ""}.
                  </td>
                </tr>
              )}
              {searchResults.logs.map((log) => (
                <motion.tr
                  key={log._id}
                  className="border-b border-brand-blue-pale/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="py-3 px-2 text-brand-blue-light">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light capitalize">
                    {log.category}
                  </td>
                  <td className="py-3 px-2 text-brand-blue font-medium">
                    {symbolFor(log.currency_code)}
                    {(log.amount_display ?? log.amount).toLocaleString(
                      undefined,
                      { maximumFractionDigits: 2 },
                    )}
                  </td>
                  <td className="py-3 px-2 text-brand-blue font-semibold tabular-nums">
                    {gbp(log.amount_settled)}
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light">
                    ₹{log.amount.toLocaleString("en-IN")}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default Sales;
