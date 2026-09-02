import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
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
  TrendingUp,
  LogOut,
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
  { label: "Analytics", to: "/admin/analytics", icon: TrendingUp },
];

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-brand-blue-pale">
      <aside className="w-64 bg-brand-blue text-white flex flex-col">
        <div className="px-6 py-6 text-xl font-bold border-b border-white/10">
          Fitness Zone Admin
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
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

        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-4 text-sm font-medium border-t border-white/10 hover:bg-white/5"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
