import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Stethoscope,
  BriefcaseMedical,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import API from "../api";
import { toast } from "react-toastify";

function AdminDoctors() {
  const token = localStorage.getItem("access");

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/doctors/");
      setDoctors(res.data);
    } catch (err) {
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  }

  async function approveDoctor(id) {
    try {
      setActionLoading(`approve-${id}`);
      await API.patch(
        `/doctors/${id}/approve/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchDoctors();
    } catch (err) {
      toast.error("Failed to approve doctor");
    } finally {
      setActionLoading(null);
    }
  }

  async function rejectDoctor(id) {
    try {
      setActionLoading(`reject-${id}`);
      await API.patch(
        `/doctors/${id}/reject/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchDoctors();
    } catch (err) {
      toast.error("Failed to reject doctor");
    } finally {
      setActionLoading(null);
    }
  }

  const approvedCount = doctors.filter((doc) => doc.is_approved).length;
  const pendingCount = doctors.filter((doc) => !doc.is_approved).length;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[28px] bg-gradient-to-r from-slate-950 via-slate-900 to-sky-900 p-6 text-white shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                <ShieldCheck size={16} />
                Admin Panel
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">Manage Doctors</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">
                Review, approve, and manage doctor applications to ensure quality healthcare services on our platform.
              </p>
            </div>

            <button
              onClick={fetchDoctors}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02]"
            >
              <RefreshCcw size={18} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Doctors</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {doctors.length}
                </h2>
              </div>
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <Stethoscope size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Approved</p>
                <h2 className="mt-2 text-3xl font-bold text-emerald-600">
                  {approvedCount}
                </h2>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <h2 className="mt-2 text-3xl font-bold text-amber-600">
                  {pendingCount}
                </h2>
              </div>
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                <BriefcaseMedical size={24} />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="animate-spin" size={22} />
              <span className="text-sm font-medium">Loading doctors...</span>
            </div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="rounded-[28px] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Stethoscope size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No doctors found</h3>
            <p className="mt-2 text-sm text-slate-500">
              There are no doctor records available right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doc) => {
              const isApproving = actionLoading === `approve-${doc.id}`;
              const isRejecting = actionLoading === `reject-${doc.id}`;

              return (
                <div
                  key={doc.id}
                  className="group rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-700">
                        <Stethoscope size={24} />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {doc.doctor_name || "Doctor Name"}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {doc.specialization || "Specialization not available"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        doc.is_approved
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {doc.is_approved ? "Approved" : "Pending"}
                    </span>
                  </div>

                  <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Experience</span>
                      <span className="font-semibold text-slate-800">
                        {doc.experience ?? 0} years
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Consultation Fee</span>
                      <span className="font-semibold text-slate-800">
                        ₹{doc.consultation_fee ?? 0}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => approveDoctor(doc.id)}
                      disabled={isApproving || isRejecting}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          Approve
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => rejectDoctor(doc.id)}
                      disabled={isApproving || isRejecting}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isRejecting ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle size={18} />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDoctors;