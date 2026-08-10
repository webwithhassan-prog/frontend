import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/authContext";
import logo from "../../assets/logo.jpeg";

const ClientLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-brand-blue-pale">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Fitness Zone"
              className="h-9 w-9 object-contain"
            />
            <span className="font-display text-brand-blue text-sm tracking-wide">
              FITNESS <span className="text-brand-orange">ZONE</span>
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-brand-blue/70 hover:text-brand-blue"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
