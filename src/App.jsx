import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { SettingsProvider } from "./context/SettingsContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import OfferPopup from "./components/common/OfferPopup";
import FloatingActions from "./components/common/FloatingActions";
import Loader from "./components/common/Loader";
import usePageTracking from "./hooks/usePageTracking";
import usePageMeta from "./hooks/usePageMeta";

import Home from "./pages/public/Home";
const Plans = lazy(() => import("./pages/public/Plans"));
const Trainers = lazy(() => import("./pages/public/Trainers"));
const TimetableSchedule = lazy(() => import("./pages/public/TimetableSchedule"));
const EBooks = lazy(() => import("./pages/public/EBooks"));
const SuccessStories = lazy(() => import("./pages/public/SuccessStories"));
const Careers = lazy(() => import("./pages/public/Careers"));
const Contact = lazy(() => import("./pages/public/Contact"));
const ZoomAccess = lazy(() => import("./pages/public/ZoomAccess"));
const PaymentSuccess = lazy(() => import("./pages/public/PaymentSuccess"));
const InvoiceSuccess = lazy(() => import("./pages/public/InvoiceSuccess"));
const PayNow = lazy(() => import("./pages/public/PayNow"));
const PaymentCancelled = lazy(() => import("./pages/public/PaymentCancelled"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const NotFound = lazy(() => import("./pages/public/NotFound"));
const About = lazy(() => import("./pages/public/About"));
const PrivacyPolicy = lazy(() => import("./pages/public/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/public/TermsOfService"));
const RefundPolicy = lazy(() => import("./pages/public/RefundPolicy"));

const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Enrollments = lazy(() => import("./pages/admin/Enrollments"));
const AdminTrainers = lazy(() => import("./pages/admin/Trainers"));
const Packages = lazy(() => import("./pages/admin/Packages"));
const Timetable = lazy(() => import("./pages/admin/Timetable"));
const TrainerApplications = lazy(() => import("./pages/admin/TrainerApplications"));
const Sales = lazy(() => import("./pages/admin/Sales"));
const CustomInvoices = lazy(() => import("./pages/admin/CustomInvoices"));
const HomeContent = lazy(() => import("./pages/admin/HomeContent"));
const AdminEBooks = lazy(() => import("./pages/admin/EBooks"));
const Promotions = lazy(() => import("./pages/admin/Promotions"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminCourses = lazy(() => import("./pages/admin/Courses"));
const RecordedGallery = lazy(() => import("./pages/admin/RecordedGallery"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));

const ClientLayout = lazy(() => import("./components/client/ClientLayout"));
const Profile = lazy(() => import("./pages/client/Profile"));

const ProtectedRoute = ({ children, allowedRole }) => {
  const { role, loading } = useAuth();

  if (loading) return null;
  if (!role) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;

  return children;
};

function PublicLayout({ children }) {
  usePageTracking();
  usePageMeta();
  return (
    <>
      <Navbar />
      {/* Suspense lives here, not around the whole route tree, so a lazy
          page load only swaps the content area — the navbar/footer chrome
          stays mounted instead of flashing away on every navigation. */}
      <Suspense fallback={<Loader size={56} className="py-32" />}>
        {children}
      </Suspense>
      <Footer />
      <OfferPopup />
      <FloatingActions />
    </>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      {/* Outer boundary: only needed for the very first load of a lazy
          layout itself (AdminLayout/ClientLayout), before it has mounted
          its own inner Suspense around its <Outlet/>. */}
      <Suspense fallback={<Loader size={56} className="py-32" />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PublicLayout>
              <PrivacyPolicy />
            </PublicLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <PublicLayout>
              <TermsOfService />
            </PublicLayout>
          }
        />
        <Route
          path="/refund-policy"
          element={
            <PublicLayout>
              <RefundPolicy />
            </PublicLayout>
          }
        />
        <Route
          path="/plans"
          element={
            <PublicLayout>
              <Plans />
            </PublicLayout>
          }
        />
        <Route
          path="/trainers"
          element={
            <PublicLayout>
              <Trainers />
            </PublicLayout>
          }
        />
        <Route
          path="/timetable"
          element={
            <PublicLayout>
              <TimetableSchedule />
            </PublicLayout>
          }
        />
        <Route
          path="/ebooks"
          element={
            <PublicLayout>
              <EBooks />
            </PublicLayout>
          }
        />
        <Route
          path="/success-stories"
          element={
            <PublicLayout>
              <SuccessStories />
            </PublicLayout>
          }
        />
        <Route
          path="/careers"
          element={
            <PublicLayout>
              <Careers />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />
        <Route
          path="/join"
          element={
            <PublicLayout>
              <ZoomAccess />
            </PublicLayout>
          }
        />
        <Route
          path="/payment-success"
          element={
            <PublicLayout>
              <PaymentSuccess />
            </PublicLayout>
          }
        />
        <Route
          path="/invoice-success"
          element={
            <PublicLayout>
              <InvoiceSuccess />
            </PublicLayout>
          }
        />
        <Route
          path="/pay"
          element={
            <PublicLayout>
              <PayNow />
            </PublicLayout>
          }
        />
        <Route
          path="/payment-cancelled"
          element={
            <PublicLayout>
              <PaymentCancelled />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicLayout>
              <Signup />
            </PublicLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicLayout>
              <ForgotPassword />
            </PublicLayout>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicLayout>
              <ResetPassword />
            </PublicLayout>
          }
        />

        {/* Client — single Profile page */}
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="dashboard" element={<Navigate to="/client" replace />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin panel — nested routes inside AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Analytics />} />
          <Route path="enrollments" element={<Enrollments />} />
          <Route path="trainers" element={<AdminTrainers />} />
          <Route path="packages" element={<Packages />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="trainer-applications" element={<TrainerApplications />} />
          <Route path="sales" element={<Sales />} />
          <Route path="custom-invoices" element={<CustomInvoices />} />
          <Route path="home-content" element={<HomeContent />} />
          <Route path="ebooks" element={<AdminEBooks />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="recorded-gallery" element={<RecordedGallery />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
      <CurrencyProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#12224A",
            color: "#fff",
            fontSize: "14px",
            borderRadius: "9999px",
            padding: "10px 20px",
          },
          success: {
            iconTheme: { primary: "#F76B1C", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
      <AppRoutes />
      </CurrencyProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
