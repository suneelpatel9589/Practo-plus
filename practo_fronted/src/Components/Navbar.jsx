import React, { useState } from "react";
import {
  ShieldCheck,
  LogIn,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token =
    localStorage.getItem("access") || localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔥 IMPORTANT FIX
  const role = user?.role?.toUpperCase();

  const publicLinks = [
    { label: "Doctor", path: "/doctors" },
    { label: "Medicine", path: "/medicine" },
    { label: "Lab Test", path: "/labtest" },
  ];

  const patientLinks = [
    { label: "Doctor", path: "/doctors" },
    { label: "Medicine", path: "/medicine" },
    { label: "Lab Test", path: "/labtest" },
  ];

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-red-200 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg">
            <ShieldCheck size={20} />
          </div>
          <div className="text-lg font-bold text-slate-900">
            Practo Care
          </div>
        </Link>

        {/* DESKTOP */}
        <div className="hidden items-center gap-4 md:flex">
          
          {/* PUBLIC */}
          {!token &&
            publicLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-sm font-medium text-slate-700 hover:text-sky-700"
              >
                {link.label}
              </Link>
            ))}

          {/* PATIENT */}
          {token && role === "PATIENT" && (
            <>
              {patientLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-sm font-medium text-slate-700 hover:text-sky-700"
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Dashboard
              </button>

              <button
                onClick={logout}
                className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Logout
              </button>
            </>
          )}

          {/* DOCTOR */}
          {token && role === "DOCTOR" && (
            <>
              <Link
                to="/add-doctor"
                className="text-sm font-medium text-slate-700 hover:text-sky-700"
              >
                 Add Profile
              </Link>

              <button
                onClick={() => navigate("/doctor-dashboard")}
                className="rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Doctor Dashboard
              </button>

              <button
                onClick={logout}
                className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Logout
              </button>
            </>
          )}

          {/* ADMIN */}
          {token && role === "ADMIN" && (
            <>
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="rounded-full bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Admin Dashboard
              </button>

              <button
                onClick={logout}
                className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-semibold text-white"
              >
                Logout
              </button>
            </>
          )}

          {/* LOGIN */}
          {!token && (
            <Link
              to="/sign"
              className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white"
            >
              Login / Sign In
            </Link>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-slate-200 p-2 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-2 px-4 py-4">

            {!token &&
              publicLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2"
                >
                  {link.label}
                </Link>
              ))}

            {token && role === "PATIENT" && (
              <>
                {patientLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2"
                  >
                    {link.label}
                  </Link>
                ))}

                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setOpen(false);
                  }}
                  className="w-full bg-green-500 py-2 text-white rounded-full"
                >
                  Dashboard
                </button>

                <button
                  onClick={logout}
                  className="w-full bg-red-500 py-2 text-white rounded-full"
                >
                  Logout
                </button>
              </>
            )}

            {token && role === "DOCTOR" && (
              <>
                <Link
                  to="/add-doctor"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2"
                >
                  Add Doctor
                </Link>

                <button
                  onClick={() => {
                    navigate("/doctor-dashboard");
                    setOpen(false);
                  }}
                  className="w-full bg-green-500 py-2 text-white rounded-full"
                >
                  Doctor Dashboard
                </button>

                <button
                  onClick={logout}
                  className="w-full bg-red-500 py-2 text-white rounded-full"
                >
                  Logout
                </button>
              </>
            )}

            {token && role === "ADMIN" && (
              <>
                <button
                  onClick={() => {
                    navigate("/admin-dashboard");
                    setOpen(false);
                  }}
                  className="w-full bg-purple-600 py-2 text-white rounded-full"
                >
                  Admin Dashboard
                </button>

                <button
                  onClick={logout}
                  className="w-full bg-red-500 py-2 text-white rounded-full"
                >
                  Logout
                </button>
              </>
            )}

            {!token && (
              <Link
                to="/sign"
                onClick={() => setOpen(false)}
                className="w-full block text-center bg-sky-500 text-white py-2 rounded-full"
              >
                Login / Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;