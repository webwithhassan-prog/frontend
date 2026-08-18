import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./pages/public/Home";
import Plans from "./pages/public/Plans";
import Consultation from "./pages/public/Consultation";
import TimetableSchedule from "./pages/public/TimetableSchedule";
import EBooks from "./pages/public/EBooks";
import SuccessStories from "./pages/public/SuccessStories";
import Careers from "./pages/public/Careers";
import Contact from "./pages/public/Contact";
import ZoomAccess from "./pages/public/ZoomAccess";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/public/NotFound";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import TermsOfService from "./pages/public/TermsOfService";

import AdminLayout from "./components/admin/AdminLayout";
import Enrollments from "./pages/admin/Enrollments";
import AdminTrainers from "./pages/admin/Trainers";
import AdminConsultants from "./pages/admin/Consultants";
import Packages from "./pages/admin/Packages";
import Timetable from "./pages/admin/Timetable";
import Professionals from "./pages/admin/Professionals";
import Sales from "./pages/admin/Sales";
import Content from "./pages/admin/Content";
import AdminEBooks from "./pages/admin/EBooks";

import ClientLayout from "./components/client/ClientLayout";
import Profile from "./pages/client/Profile";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { role, loading } = useAuth();

  if (loading) return null;
  if (!role) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;

  return children;
};

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
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
          path="/plans"
          element={
            <PublicLayout>
              <Plans />
            </PublicLayout>
          }
        />
        <Route
          path="/consultation"
          element={
            <PublicLayout>
              <Consultation />
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
          <Route path="dashboard" element={<Enrollments />} />
          <Route path="enrollments" element={<Enrollments />} />
          <Route path="trainers" element={<AdminTrainers />} />
          <Route path="consultants" element={<AdminConsultants />} />
          <Route path="packages" element={<Packages />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="professionals" element={<Professionals />} />
          <Route path="sales" element={<Sales />} />
          <Route path="content" element={<Content />} />
          <Route path="ebooks" element={<AdminEBooks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
