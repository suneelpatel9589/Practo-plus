import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  PencilLine,
  Upload,
  UserRound,
  BriefcaseMedical,
  IndianRupee,
  FileText,
  ImagePlus,
} from "lucide-react";
import API from "../api";

function EditDoctor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("access") || localStorage.getItem("token");

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

  const [oldImage, setOldImage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

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

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await API.get(`/doctors/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          doctor_name: res.data.doctor_name || "",
          specialization: res.data.specialization || "",
          experience: res.data.experience || "",
          consultation_fee: res.data.consultation_fee || "",
          bio: res.data.bio || "",
          image: null,
        });

        setOldImage(res.data.image || "");
      } catch (error) {
        console.error("Fetch error:", error);
        setMessageType("error");
        toast.error("Failed to load doctor data. Please try again.");
      } finally {
        setPageLoading(false);
      }
    }

    fetchDoctor();
  }, [id, token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("doctor_name", formData.doctor_name);
      data.append("specialization", formData.specialization);
      data.append("experience", formData.experience);
      data.append("consultation_fee", formData.consultation_fee);
      data.append("bio", formData.bio);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await API.put(`/doctors/${id}/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      
      toast.success("Profile updated successfully!");

      setTimeout(() => {
        navigate("/doctor-dashboard");
      }, 1000);
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      setMessageType("error");
      toast.error("Failed to update profile. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-8">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="h-24 rounded-[28px] bg-white/80 shadow-lg" />
          <div className="mt-6 h-[520px] rounded-[28px] bg-white/80 shadow-lg" />
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
                  <PencilLine size={14} />
                  Edit Doctor Profile
                </div>
                <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                  Update Your Profile
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
            {message && (
              <div
                className={`mb-5 rounded-2xl px-4 py-3 text-sm font-medium ${
                  messageType === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
                <div className="rounded-[28px] border border-slate-100 bg-slate-50/80 p-5 shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-32 w-32 overflow-hidden rounded-full bg-white shadow-md ring-4 ring-white">
                      {preview || oldImage ? (
                        <img
                          src={
                            preview ||
                            (oldImage?.startsWith("http")
                              ? oldImage
                              : `${API.defaults.baseURL}${oldImage}`)
                          }
                          alt="Doctor"
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
                      Change Image
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
                      <UserRound size={16} />
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      name="doctor_name"
                      value={formData.doctor_name}
                      onChange={handleChange}
                      placeholder="Doctor Name"
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
                      placeholder="Bio"
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
                  {loading ? "Updating..." : "Update Profile"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/doctor-dashboard")}
                  className="rounded-2xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditDoctor;