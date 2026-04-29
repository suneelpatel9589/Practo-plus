import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Mail,
  LockKeyhole,
  ShieldCheck,
  Stethoscope,
  Eye,
  EyeOff,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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

      const response = await axios.post("http://127.0.0.1:8000/login/", {
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
      const data = error.response?.data;

      let message = "Invalid email or password";

      if (data) {
        if (typeof data === "string") {
          message = data;
        } else if (data.error) {
          message = data.error;
        } else if (data.message) {
          message = data.message;
        } else if (Array.isArray(data.non_field_errors)) {
          const first = data.non_field_errors[0];
          if (typeof first === "string") {
            message = first;
          } else if (first?.error) {
            message = first.error;
          }
        } else if (data.detail) {
          message = data.detail;
        }
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] bg-white/90 shadow-2xl ring-1 ring-slate-200/70 backdrop-blur-xl lg:grid-cols-2">

        {/* LEFT */}
        <div className="hidden bg-gradient-to-br from-sky-700 via-cyan-600 to-teal-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm">
              <ShieldCheck size={16} />
              Welcome Back
            </div>

            <h1 className="mt-6 text-4xl font-bold">
              Login to your health account
            </h1>

            <p className="mt-4 text-sm text-sky-50/90">
              Book doctors, order medicines, and manage your healthcare easily.
            </p>
          </div>

          <div className="rounded-[30px] bg-white/10 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-700">
                <Stethoscope size={26} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Secure Login</h3>
                <p className="text-sm text-sky-50/85">
                  Safe access to your account
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-6 sm:p-8 md:p-10">
          <h2 className="text-3xl font-bold text-slate-900">Login</h2>
          <p className="text-sm text-slate-500">
            Enter your details to continue
          </p>

          <div className="mt-6 space-y-5">
            <InputBox
              label="Email"
              icon={<Mail size={18} />}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            {/* PASSWORD */}
            <div>
              <label className="mb-1 text-sm text-slate-600">Password</label>

              <div className="flex items-center gap-2 border rounded-2xl px-4 py-3">
                <LockKeyhole size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-blue-600 text-sm">
                Forgot Password?
              </Link>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-2xl"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="mt-6 text-sm text-center">
            New user?{" "}
            <Link to="/sign" className="text-blue-600">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputBox({ label, icon, type, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm text-slate-600">{label}</label>

      <div className="flex items-center gap-2 border rounded-2xl px-4 py-3 mt-1">
        {icon}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full outline-none"
        />
      </div>
    </div>
  );
}

export default Login;