import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, LockKeyhole, ShieldCheck, Stethoscope } from "lucide-react";
import { toast } from "react-toastify";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleLogin() {
    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/login/", {
        email: form.email,
        password: form.password,
      });

      const user = response.data.user;

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(response.data.message || "Login successful");

      if (user.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (user.role === "DOCTOR") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.non_field_errors?.[0] ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] bg-white/90 shadow-2xl ring-1 ring-slate-200/70 backdrop-blur-xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-sky-700 via-cyan-600 to-teal-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              <ShieldCheck size={16} />
              Welcome Back
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight">
              Login to your health account
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-sky-50/90">
              Book doctors, order medicines, and manage your healthcare easily.
            </p>
          </div>

          <div className="rounded-[30px] border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-lg">
                <Stethoscope size={26} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Fast & Secure Login</h3>
                <p className="text-sm text-sky-50/85">
                  Safe access to your health account.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Login</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your details to continue
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-200 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-200 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            New user?{" "}
            <Link
              to="/sign"
              className="font-semibold text-sky-600 hover:text-sky-700"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;