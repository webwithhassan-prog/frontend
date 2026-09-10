import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../services/api";
import Card from "../../components/common/Card";
import SkeletonTable from "../../components/common/SkeletonTable";
import Button from "../../components/common/Button";
import { useCurrency } from "../../context/CurrencyContext";
import logo from "../../assets/logo.jpeg";

// Brand palette, matching src/index.css — jsPDF wants plain RGB tuples,
// not CSS variables.
const BRAND_BLUE = [18, 34, 74];
const BRAND_BLUE_LIGHT = [44, 68, 209];
const BRAND_ORANGE = [247, 107, 28];
const BRAND_BLUE_PALE = [234, 241, 255];

const categories = ["plan", "package", "ebook", "course", "custom"];

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

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const res = await api.get("/sales/search", {
        params: category ? { category } : {},
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

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
      `Category: ${category ? category[0].toUpperCase() + category.slice(1) : "All"}`,
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
      head: [["Date", "Category", "Currency", "Amount Paid", "Base Price (INR)"]],
      body: searchResults.logs.map((log) => [
        new Date(log.date).toLocaleDateString(),
        log.category,
        log.currency_code || "INR",
        `${symbolFor(log.currency_code)}${(log.amount_display ?? log.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
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

    doc.save(`sales-${category || "all"}-${today.toISOString().slice(0, 10)}.pdf`);
  };

  const handleExportCsv = () => {
    if (!searchResults) return;
    const rows = [
      ["Date", "Category", "Currency", "Amount Paid", "Base Price (INR)"],
      ...searchResults.logs.map((log) => [
        new Date(log.date).toLocaleDateString(),
        log.category,
        log.currency_code || "INR",
        (log.amount_display ?? log.amount).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        }),
        log.amount,
      ]),
    ];
    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(`sales-${category || "all"}-${today}.csv`, rows);
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

      {/* Category Search (30-day retained log) */}
      <h2 className="text-lg font-bold text-brand-blue mb-4">
        Search Sales by Category (last 30 days)
      </h2>
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange capitalize"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
          <Button onClick={handleSearch}>
            <span className="flex items-center gap-2">
              <Search size={16} /> Search
            </span>
          </Button>
        </div>
      </Card>

      {searching && <SkeletonTable columns={4} rows={5} />}

      {searchResults && !searching && (
        <Card className="overflow-x-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <p className="text-brand-blue font-semibold">
              Total: £
              {searchResults.total_settled.toLocaleString("en-GB", {
                maximumFractionDigits: 2,
              })}{" "}
              ({searchResults.count} entries)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                disabled={searchResults.logs.length === 0}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={14} />
                Export CSV
              </button>
              <button
                onClick={handleExportPdf}
                disabled={searchResults.logs.length === 0}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-brand-blue-light/10 text-brand-blue-light hover:bg-brand-blue-light/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                <th className="py-3 px-2">Amount Paid</th>
                <th className="py-3 px-2">Base Price</th>
              </tr>
            </thead>
            <tbody>
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
