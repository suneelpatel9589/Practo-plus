import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Search,
  MapPin,
  BriefcaseMedical,
  IndianRupee,
  Star,
  UserRound,
  CalendarCheck2,
} from "lucide-react";
import API from "../api";


export default function DoctorPage() {
  const navigate = useNavigate();

  const [doctorsData, setDoctorsData] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("All");
  const [sortBy, setSortBy] = useState("experience");

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    try {
      setLoadingDoctors(true);

      const res = await API.get("/doctors/");

      const mappedDoctors = res.data.map((item) => ({
        id: item.id,
        user: item.user,
        name: item.doctor_name || "Doctor",
        specialization: item.specialization || "General Physician",
        exp: Number(item.experience) || 0,
        fee: Number(item.consultation_fee) || 0,
        bio: item.bio || "",
        image: item.image || "",
      }));

      setDoctorsData(mappedDoctors);
    } catch (error) {
      console.error("Doctors fetch error:", error.response?.data || error.message);
      toast.error("Failed to fetch doctors. Please try again.");
    } finally {
      setLoadingDoctors(false);
    }
  }

  const specializations = useMemo(() => {
    const specs = doctorsData.map((d) => d.specialization).filter(Boolean);
    return ["All", ...new Set(specs)];
  }, [doctorsData]);

  const filteredDoctors = useMemo(() => {
    const value = search.toLowerCase().trim();

    let result = doctorsData.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(value) ||
        d.specialization.toLowerCase().includes(value) ||
        d.bio.toLowerCase().includes(value);

      const matchesSpec =
        selectedSpec === "All" || d.specialization === selectedSpec;

      return matchesSearch && matchesSpec;
    });

    if (sortBy === "experience") {
      result.sort((a, b) => b.exp - a.exp);
    } else if (sortBy === "fee-low") {
      result.sort((a, b) => a.fee - b.fee);
    } else if (sortBy === "fee-high") {
      result.sort((a, b) => b.fee - a.fee);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [doctorsData, search, selectedSpec, sortBy]);

  function handleBookAppointment(doctor) {
    navigate("/appoiment", {
      state: {
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        fee: doctor.fee,
        image: doctor.image,
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-[32px] bg-white shadow-2xl">
          <div className="grid gap-6 bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-6 py-8 text-white md:grid-cols-2 md:px-8">
            <div>
              <p className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
                Trusted Healthcare Platform
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                Find the right doctor for your care
              </h1>
             
            </div>

            <div className="grid grid-cols-3 gap-4 self-center">
              <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur">
                <h3 className="text-2xl font-bold">{doctorsData.length}+</h3>
                <p className="text-sm text-white/80">Doctors</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur">
                <h3 className="text-2xl font-bold">24/7</h3>
                <p className="text-sm text-white/80">Support</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur">
                <h3 className="text-2xl font-bold">Easy</h3>
                <p className="text-sm text-white/80">Booking</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-lg backdrop-blur">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search doctor, specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              {specializations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="experience">Sort by Experience</option>
              <option value="fee-low">Fee: Low to High</option>
              <option value="fee-high">Fee: High to Low</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {specializations.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedSpec(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedSpec === item
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loadingDoctors ? (
          <div className="rounded-[28px] bg-white/80 p-10 text-center shadow-lg">
            <h3 className="text-2xl font-semibold text-slate-800">
              Loading doctors...
            </h3>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="rounded-[28px] bg-white/80 p-10 text-center shadow-lg">
            <h3 className="text-2xl font-semibold text-slate-800">
              No doctors found
            </h3>
           
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="group overflow-hidden rounded-[30px] border border-white/70 bg-white/85 shadow-xl backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative">
                  <div className="h-64 w-full overflow-hidden bg-slate-100">
                    {doc.image ? (
                      <img
                        src={
                          doc.image.startsWith("http")
                            ? doc.image
                            : `${import.meta.env.VITE_API_URL}/media/${doc.image}`
                        }
                        alt={doc.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <UserRound size={54} />
                      </div>
                    )}
                  </div>

                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-cyan-700 shadow">
                    Available
                  </div>

                  <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                    <Star size={13} fill="currentColor" />
                    4.8
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {doc.name}
                  </h2>

                  <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-cyan-700">
                    <BriefcaseMedical size={15} />
                    {doc.specialization}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="text-cyan-600" />
                      India
                    </p>
                    <p>🩺 {doc.exp} years experience</p>
                    <p className="flex items-center gap-1 text-lg font-semibold text-slate-800">
                      <IndianRupee size={16} />
                      {doc.fee} consultation fee
                    </p>
                    <p className="text-xs text-slate-400">Doctor ID: {doc.id}</p>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                    {doc.bio || "Experienced doctor available for consultation."}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => handleBookAppointment(doc)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]"
                    >
                      <CalendarCheck2 size={16} />
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}