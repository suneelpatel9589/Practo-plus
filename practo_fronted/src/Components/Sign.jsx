import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Mail,
  Phone,
  LockKeyhole,
  User,
  ShieldCheck,
  Stethoscope,
  Eye,
  EyeOff,
} from "lucide-react";

function Sign() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "PATIENT",
    password: "",
    confirm_password: "",
    otp: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function sendOTP() {
    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.phone ||
      !form.role ||
      !form.password ||
      !form.confirm_password
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (form.password !== form.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/send-otp/", {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        password: form.password,
      });

      toast.success(res.data.message || "OTP sent successfully");
      setStep(2);
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

  async function verifyOTP() {
    if (!form.otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/verify-otp/", {
        email: form.email,
        otp: form.otp,
      });

      toast.success(res.data.message || "Signup successful");

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const user = res.data.user;

      if (user.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (user.role === "DOCTOR") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    if (!form.email) {
      toast.error("Email is missing");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/send-otp/", {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        password: form.password,
      });

      toast.success(res.data.message || "OTP resent successfully");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[36px] bg-white/90 shadow-2xl ring-1 ring-slate-200/70 backdrop-blur-xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-sky-700 via-cyan-600 to-teal-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              <ShieldCheck size={16} />
              Join Practo
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight">
              Create your health account
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-sky-50/90">
              Register securely with OTP verification and start your healthcare journey.
            </p>
          </div>

          <div className="rounded-[30px] border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-lg">
                <Stethoscope size={26} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Fast & Secure Signup</h3>
                <p className="text-sm text-sky-50/85">
                  OTP verification ensures your account security.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-10">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                {step === 1 ? "Create Account" : "Verify OTP"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {step === 1
                  ? "Fill your details to continue"
                  : "Enter the OTP sent to your email"}
              </p>
            </div>

            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-sky-600 hover:text-sky-700"
              >
                Login
              </Link>
            </p>
          </div>

          <div className="mb-8 flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                step >= 1 ? "bg-sky-600 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              1
            </div>

            <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-500 ${
                  step === 2 ? "w-full" : "w-1/2"
                }`}
              />
            </div>

            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                step === 2 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              2
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputBox
                  label="First Name"
                  icon={<User size={18} />}
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                />

                <InputBox
                  label="Last Name"
                  icon={<User size={18} />}
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </div>

              <InputBox
                label="Email"
                icon={<Mail size={18} />}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
              />

              <InputBox
                label="Phone"
                icon={<Phone size={18} />}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                maxLength={15}
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                >
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                </select>
              </div>

              <PasswordBox
                label="Create Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create password"
                show={showPassword}
                setShow={setShowPassword}
              />

              <PasswordBox
                label="Confirm Password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Confirm password"
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
              />

              <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-700 ring-1 ring-sky-100">
                By signing up, you agree to the terms and basic account verification.
              </div>

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
            <div className="space-y-4">
              <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm text-slate-600">OTP sent to:</p>
                <p className="mt-1 break-all font-semibold text-slate-800">
                  {form.email}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm tracking-[0.3em] text-slate-700 outline-none transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <button
                onClick={verifyOTP}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                onClick={resendOTP}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                Resend OTP
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
  maxLength,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-600">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-200 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
        <span className="text-slate-400">{icon}</span>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
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

export default Sign;