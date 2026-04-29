import React, { useEffect, useState } from "react";
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

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function sendOTP() {
    if (!form.email) {
      toast.error("Please enter email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/forgot-password/", {
        email: form.email,
      });

      toast.success(res.data.message || "OTP sent successfully");
      setStep(2);
      setTimer(30);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    if (timer > 0) return;

    if (!form.email) {
      toast.error("Email is missing");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/forgot-password/", {
        email: form.email,
      });

      toast.success(res.data.message || "OTP resent successfully");
      setTimer(30);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to resend OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword() {
    if (!form.otp || !form.password || !form.confirm_password) {
      toast.error("Please fill all fields");
      return;
    }

    if (form.password !== form.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/reset-password/", {
        email: form.email,
        otp: form.otp,
        password: form.password,
        confirm_password: form.confirm_password,
      });

      toast.success(res.data.message || "Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Password reset failed"
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
              Secure Recovery
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight">
              Reset your password
            </h1>

          
          </div>

          <div className="rounded-[30px] border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-lg">
                <Stethoscope size={26} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Safe & Fast Reset</h3>
                <p className="text-sm text-sky-50/85">
                  OTP verification keeps your account safe.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {step === 1
                ? "Enter your email to receive OTP"
                : "Enter OTP and create new password"}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <InputBox
                label="Email"
                icon={<Mail size={18} />}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />

              <button
                onClick={sendOTP}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-100">
                OTP sent to{" "}
                <span className="font-semibold text-slate-800">
                  {form.email}
                </span>
              </div>

              <InputBox
                label="OTP"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
              />

              <PasswordBox
                label="New Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter new password"
                show={showPassword}
                setShow={setShowPassword}
              />

              <PasswordBox
                label="Confirm Password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Confirm new password"
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
              />

              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                onClick={resendOTP}
                disabled={loading || timer > 0}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>

              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="w-full text-sm font-medium text-slate-500 transition hover:text-slate-700 disabled:opacity-50"
              >
                Back
              </button>
            </div>
          )}

          <p className="mt-6 text-sm text-slate-500">
            Remember password?{" "}
            <Link
              to="/login"
              className="font-semibold text-sky-600 hover:text-sky-700"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputBox({
  label,
  icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-600">
        {label}
      </label>

      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-200 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
        {icon && <span className="text-slate-400">{icon}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

function PasswordBox({
  label,
  name,
  value,
  onChange,
  placeholder,
  show,
  setShow,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-600">
        {label}
      </label>

      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-200 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
        <LockKeyhole size={18} className="text-slate-400" />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="text-slate-400 transition hover:text-slate-700"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;