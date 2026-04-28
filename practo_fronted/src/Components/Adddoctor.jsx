import React, { useState, useMemo } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Upload,
  UserRound,
  BriefcaseMedical,
  IndianRupee,
  Stethoscope,
  ImagePlus,
  FileText,
  Sparkles,
} from "lucide-react";
import API from "../api";

function AddDoctor() {
  const navigate = useNavigate();

  const specializationOptions = [
    "Cardiologist",
    "Dentist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Psychiatrist",
    "Gynecologist",
    "ENT Specialist",
    "General Physician",
  ];

  const [formData, setFormData] = useState({
    doctor_name: "",
    specialization: "",
    experience: "",
    consultation_fee: "",
    bio: "",
    image: null,
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("access") || localStorage.getItem("token");

  const commissionPercent = 7;

  const feeDetails = useMemo(() => {
    const fee = Number(formData.consultation_fee || 0);
    const commission = (fee * commissionPercent) / 100;
    const doctorReceives = fee - commission;

    return {
      fee: fee.toFixed(2),
      commission: commission.toFixed(2),
      doctorReceives: doctorReceives.toFixed(2),
    };
  }, [formData.consultation_fee]);

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files?.[0];
      setFormData((prev) => ({
        ...prev,
        image: file || null,
      }));
      setPreview(file ? URL.createObjectURL(file) : "");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateForm() {
    if (!formData.doctor_name.trim()) {
      toast.error("Doctor name is required");
      return true;
    }

    if (!formData.specialization) {
      toast.error("Specialization is required");
      return true;
    }

    if (!formData.experience || Number(formData.experience) < 0) {
      toast.error("Experience should be a non-negative number");
      return true;
    }

    if (!formData.consultation_fee || Number(formData.consultation_fee) <= 0) {
      toast.error("Consultation fee should be greater than zero");
      return true;
    }

    return false;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) return;

    try {
      setLoading(true);

      const data = new FormData();
      data.append("doctor_name", formData.doctor_name);
      data.append("specialization", formData.specialization);
      data.append("experience", formData.experience);
      data.append("consultation_fee", formData.consultation_fee);
      data.append("bio", formData.bio);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await API.post("/doctors/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data?.message || "Doctor added successfully ", {
        autoClose: 2000,
      });

      setFormData({
        doctor_name: "",
        specialization: "",
        experience: "",
        consultation_fee: "",
        bio: "",
        image: null,
      });
      setPreview("");

      setTimeout(() => {
        navigate("/doctor-dashboard");
      }, 1500);
    } catch (err) {
      const backendError =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.response?.data?.doctor_name?.[0] ||
        err.response?.data?.specialization?.[0] ||
        err.response?.data?.experience?.[0] ||
        err.response?.data?.consultation_fee?.[0] ||
        "Doctor add nahi hua";

      toast.error(backendError, {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      doctor_name: "",
      specialization: "",
      experience: "",
      consultation_fee: "",
      bio: "",
      image: null,
    });
    setPreview("");
    toast.info("Form reset ho gaya");
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-xl text-center">
          <h2 className="text-xl font-bold text-red-600">Login Required</h2>
        </div>
      </div>
    );
  }

  if (user?.role !== "DOCTOR") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-xl text-center">
          <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-5 py-6 text-white sm:px-7 sm:py-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                  <Sparkles size={14} />
                  Add Doctor
                </div>
                <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                  Create Doctor Profile
                </h1>
              </div>

              <button
                onClick={() => navigate("/doctor-dashboard")}
                className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                Back
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
                <div className="rounded-[28px] border border-slate-100 bg-slate-50/80 p-5 shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-32 w-32 overflow-hidden rounded-full bg-white shadow-md ring-4 ring-white">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <UserRound size={48} />
                        </div>
                      )}
                    </div>

                    <label className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100">
                      <ImagePlus size={16} />
                      Upload Image
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Stethoscope size={16} />
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      name="doctor_name"
                      value={formData.doctor_name}
                      onChange={handleChange}
                      placeholder="Dr. Rakesh Jain"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <BriefcaseMedical size={16} />
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
                    >
                      <option value="">Select specialization</option>
                      {specializationOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Experience
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Experience"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <IndianRupee size={16} />
                        Consultation Fee
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="consultation_fee"
                        value={formData.consultation_fee}
                        onChange={handleChange}
                        placeholder="Consultation Fee"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
                      />
                    </div>
                  </div>

                  {Number(formData.consultation_fee) > 0 && (
                    <div className="rounded-[24px] border border-sky-100 bg-sky-50 p-4">
                      <h3 className="text-sm font-bold text-sky-800">
                        Commission Summary
                      </h3>

                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Total Fee</span>
                          <span className="font-semibold text-slate-800">
                            ₹{feeDetails.fee}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">
                            Platform Commission ({commissionPercent}%)
                          </span>
                          <span className="font-semibold text-red-600">
                            ₹{feeDetails.commission}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-sky-200 pt-2">
                          <span className="font-semibold text-slate-700">
                            Doctor Receives
                          </span>
                          <span className="font-bold text-green-700">
                            ₹{feeDetails.doctorReceives}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <FileText size={16} />
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      rows="5"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Short bio..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Upload size={16} />
                  {loading ? "Adding..." : "Add Doctor"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDoctor;