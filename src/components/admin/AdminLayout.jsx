import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Stethoscope,
  Package,
  CalendarClock,
  Briefcase,
  BarChart3,
  Video,
  BookOpen,
  Megaphone,
  Tag,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Overview", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Enrollments", to: "/admin/enrollments", icon: Users },
  { label: "Trainers", to: "/admin/trainers", icon: Dumbbell },
  { label: "Consultants", to: "/admin/consultants", icon: Stethoscope },
  { label: "Packages", to: "/admin/packages", icon: Package },
  { label: "Timetable", to: "/admin/timetable", icon: CalendarClock },
  { label: "Professionals", to: "/admin/professionals", icon: Briefcase },
  { label: "Sales", to: "/admin/sales", icon: BarChart3 },
  { label: "Content", to: "/admin/content", icon: Video },
  { label: "E-Books", to: "/admin/ebooks", icon: BookOpen },
  { label: "Offers", to: "/admin/offers", icon: Megaphone },
  { label: "Coupons", to: "/admin/coupons", icon: Tag },
  { label: "Analytics", to: "/admin/analytics", icon: TrendingUp },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const NavLinks = ({ onNavigate }) => (
    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium relative ${
              isActive ? "bg-white/10" : "hover:bg-white/5"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={18} />
              {item.label}
              {isActive && (
                <motion.span
                  layoutId="admin-active-indicator"
                  className="absolute left-0 top-0 h-full w-1 bg-brand-orange rounded-r"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-brand-blue-pale">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-brand-blue text-white flex-col">
        <div className="px-6 py-6 text-xl font-bold border-b border-white/10">
          Fitness Zone Admin
        </div>
        <NavLinks />
        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-4 text-sm font-medium border-t border-white/10 hover:bg-white/5"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between bg-brand-blue text-white px-4 py-3.5">
        <span className="font-bold text-sm">Fitness Zone Admin</span>
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-brand-blue text-white flex flex-col z-50"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
                <span className="text-lg font-bold">Fitness Zone Admin</span>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <NavLinks onNavigate={() => setIsSidebarOpen(false)} />
              <button
                onClick={logout}
                className="flex items-center gap-3 px-6 py-4 text-sm font-medium border-t border-white/10 hover:bg-white/5"
              >
                <LogOut size={18} />
                Logout
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
