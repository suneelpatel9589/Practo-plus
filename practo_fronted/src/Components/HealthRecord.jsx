import React, { useEffect, useMemo, useState } from "react";

import {
  Stethoscope,
  FlaskConical,
  Pill,
  FileText,
  BadgeCheck,
  Activity,
  ClipboardList,
  Package,
} from "lucide-react";
import API from "../api";

function HealthRecord() {
  const token = localStorage.getItem("access") || localStorage.getItem("token");


  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");

  const [appointments, setAppointments] = useState([]);
  const [labOrders, setLabOrders] = useState([]);
  const [medicineOrders, setMedicineOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  function authHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function pickFirstArray(obj, keys = []) {
    for (const key of keys) {
      if (Array.isArray(obj?.[key])) return obj[key];
    }
    return [];
  }

  function normalizeHealthData(payload) {
    if (Array.isArray(payload)) {
      return {
        appointments: payload,
        labOrders: [],
        medicineOrders: [],
        prescriptions: [],
      };
    }

    const data =
      payload?.results && typeof payload.results === "object"
        ? payload.results
        : payload || {};

    return {
      appointments: toArray(
        pickFirstArray(data, [
          "appointments",
          "appointment_records",
          "appointmentHistory",
          "appointment_history",
        ])
      ),
      labOrders: toArray(
        pickFirstArray(data, [
          "lab_orders",
          "labOrders",
          "lab_tests",
          "labtests",
          "lab_records",
        ])
      ),
      medicineOrders: toArray(
        pickFirstArray(data, [
          "medicine_orders",
          "medicineOrders",
          "orders",
          "medicine_records",
          "pharmacy_orders",
        ])
      ),
      prescriptions: toArray(
        pickFirstArray(data, [
          "prescriptions",
          "prescription_records",
          "doctor_prescriptions",
        ])
      ),
    };
  }

  async function fetchHealthRecords() {
    try {
      setLoading(true);
      setErrorText("");

      let finalAppointments = [];
      let finalLabOrders = [];
      let finalMedicineOrders = [];
      let finalPrescriptions = [];

      try {
        const res = await API.get("/health-records/", authHeaders());
        const normalized = normalizeHealthData(res.data || {});

        finalAppointments = normalized.appointments;
        finalLabOrders = normalized.labOrders;
        finalMedicineOrders = normalized.medicineOrders;
        finalPrescriptions = normalized.prescriptions;
      } catch (err) {
        console.log("health-records failed:", err.response?.data || err.message);
      }

      if (
        finalAppointments.length === 0 &&
        finalLabOrders.length === 0 &&
        finalMedicineOrders.length === 0 &&
        finalPrescriptions.length === 0
      ) {
        const [appointmentsRes, labOrdersRes, ordersRes] = await Promise.allSettled([
          API.get(`/appointments/`, authHeaders()),
          API.get(`/lab-orders/`, authHeaders()),
          API.get(`/medicine-orders/`, authHeaders()),
        ]);

        if (appointmentsRes.status === "fulfilled") {
          finalAppointments = toArray(appointmentsRes.value.data);
        }

        if (labOrdersRes.status === "fulfilled") {
          finalLabOrders = toArray(labOrdersRes.value.data);
        }

        if (ordersRes.status === "fulfilled") {
          finalMedicineOrders = toArray(ordersRes.value.data);
        }
      }

      setAppointments(finalAppointments);
      setLabOrders(finalLabOrders);
      setMedicineOrders(finalMedicineOrders);
      setPrescriptions(finalPrescriptions);
    } catch (error) {
      console.error("Health records fetch error:", error.response?.data || error.message);
      setErrorText(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Health records load nahi hue"
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date) {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusColor(status) {
    const value = String(status || "").toUpperCase();

    if (
      value === "COMPLETED" ||
      value === "CONFIRMED" ||
      value === "DELIVERED" ||
      value === "SUCCESS"
    ) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (value === "CANCELLED" || value === "FAILED") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  const stats = useMemo(
    () => [
      { title: "Appointments", value: appointments.length, icon: Stethoscope },
      { title: "Lab Tests", value: labOrders.length, icon: FlaskConical },
      { title: "Medicines", value: medicineOrders.length, icon: Pill },
      { title: "Prescriptions", value: prescriptions.length, icon: FileText },
    ],
    [appointments, labOrders, medicineOrders, prescriptions]
  );

  const tabs = [
    { key: "appointments", label: "Appointments", icon: Stethoscope },
    { key: "labtests", label: "Lab Tests", icon: FlaskConical },
    { key: "medicines", label: "Medicines", icon: Pill },
    { key: "prescriptions", label: "Prescriptions", icon: FileText },
  ];

  function EmptyState({ title, subtitle, icon: Icon }) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
          <Icon size={24} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-800">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
    );
  }

  function SectionCard({ children }) {
    return (
      <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md">
        {children}
      </div>
    );
  }

  function InfoBox({ label, value, dark = false }) {
    return (
      <div className={`rounded-2xl px-4 py-3 ${dark ? "bg-slate-900" : "bg-slate-50"}`}>
        <p className={`text-xs ${dark ? "text-slate-300" : "text-slate-400"}`}>
          {label}
        </p>
        <p
          className={`mt-1 break-words text-sm font-semibold ${
            dark ? "text-white" : "text-slate-800"
          }`}
        >
          {value}
        </p>
      </div>
    );
  }

  function renderAppointments() {
    if (appointments.length === 0) {
      return (
        <EmptyState
          icon={ClipboardList}
          title="No appointment records"
          
        />
      );
    }

    return (
      <div className="grid gap-4">
        {appointments.map((item, index) => (
          <SectionCard key={item.id || index}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold text-slate-800">
                  Appointment {item.id || index + 1}
                </h3>

                <div
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold ${getStatusColor(
                    item.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {item.status || "PENDING"}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoBox
                  label="Doctor"
                  value={item.doctor_details?.doctor_name || item.doctor_name || "Doctor"}
                />
                <InfoBox
                  label="Specialization"
                  value={item.doctor_details?.specialization || item.specialization || "N/A"}
                />
                <InfoBox
                  label="Date & Time"
                  value={formatDate(item.appointment_date || item.date)}
                />
                <InfoBox
                  label="Payment"
                  value={item.payment_method || "N/A"}
                  dark
                />
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-400">Symptoms</p>
                <p className="mt-1 text-sm text-slate-700">
                  {item.symptoms || "No symptoms added"}
                </p>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    );
  }

  function renderLabTests() {
    if (labOrders.length === 0) {
      return (
        <EmptyState
          icon={FlaskConical}
          title="No lab test records"
         
        />
      );
    }

    return (
      <div className="grid gap-4">
        {labOrders.map((item, index) => (
          <SectionCard key={item.id || index}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold text-slate-800">
                  Lab Order {item.id || index + 1}
                </h3>

                <div
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold ${getStatusColor(
                    item.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {item.status || "PENDING"}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoBox
                  label="Doctor"
                  value={item.doctor_details?.doctor_name || item.doctor_name || "N/A"}
                />
                <InfoBox
                  label="Date"
                  value={formatDate(item.created_at || item.order_date || item.date)}
                />
                <InfoBox label="Payment" value={item.payment_method || "N/A"} />
                <InfoBox
                  label="Status"
                  value={item.status || "PENDING"}
                  dark
                />
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-400">Tests</p>
                <p className="mt-1 text-sm text-slate-700">
                  {item.items?.length
                    ? item.items.map((test) => test.test_name || test.name).join(", ")
                    : "No tests found"}
                </p>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    );
  }

  function renderMedicines() {
    if (medicineOrders.length === 0) {
      return (
        <EmptyState
          icon={Package}
          title="No medicine orders"
         
        />
      );
    }

    return (
      <div className="grid gap-4">
        {medicineOrders.map((item, index) => (
          <SectionCard key={item.id || index}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold text-slate-800">
                  Order #{item.id || index + 1}
                </h3>

                <div
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold ${getStatusColor(
                    item.status
                  )}`}
                >
                  <BadgeCheck size={14} />
                  {item.status || "PENDING"}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoBox
                  label="Order Date"
                  value={formatDate(item.created_at || item.order_date || item.date)}
                />
                <InfoBox label="Payment" value={item.payment_method || "N/A"} />
                <InfoBox
                  label="Total"
                  value={`₹${Number(item.total_amount || item.total || 0).toFixed(2)}`}
                />
                <InfoBox
                  label="Status"
                  value={item.status || "PENDING"}
                  dark
                />
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-400">Medicines</p>
                <p className="mt-1 text-sm text-slate-700">
                  {item.items?.length
                    ? item.items.map((med) => med.medicine_name || med.name).join(", ")
                    : item.medicine_name || "No medicines found"}
                </p>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    );
  }

  function renderPrescriptions() {
    if (prescriptions.length === 0) {
      return (
        <EmptyState
          icon={FileText}
          title="No prescriptions found"
       
        />
      );
    }

    return (
      <div className="grid gap-4">
        {prescriptions.map((item, index) => (
          <SectionCard key={item.id || index}>
            <div className="grid gap-3 xl:grid-cols-4">
              <InfoBox
                label="Doctor"
                value={item.doctor_name || item.doctor_details?.doctor_name || "Doctor"}
              />
              <InfoBox
                label="Date"
                value={formatDate(item.created_at || item.date)}
              />
              <InfoBox
                label="Appointment"
                value={`#${item.appointment || item.appointment_id || "N/A"}`}
              />
              <InfoBox label="Type" value="Prescription" dark />
            </div>

            <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-400">Medicines / Advice</p>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-700">
                {item.notes ||
                  item.medicines ||
                  item.prescription_text ||
                  "No prescription notes"}
              </p>
            </div>
          </SectionCard>
        ))}
      </div>
    );
  }

  function renderActiveSection() {
    if (activeTab === "appointments") return renderAppointments();
    if (activeTab === "labtests") return renderLabTests();
    if (activeTab === "medicines") return renderMedicines();
    return renderPrescriptions();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl">
          <div className="relative overflow-hidden bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-6 py-8 text-white md:px-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  <Activity size={16} />
                  Personal Medical Dashboard
                </div>
                <h1 className="mt-4 text-3xl font-bold md:text-4xl">
                  Health Records
                </h1>
               
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[460px]">
                {stats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-800">
                        <Icon size={18} />
                      </div>
                      <p className="mt-3 text-2xl font-bold">{item.value}</p>
                      <p className="text-xs text-cyan-50/90">{item.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6">
            {loading ? (
              <div className="rounded-[28px] bg-slate-50 p-10 text-center text-slate-600">
                Loading health records...
              </div>
            ) : errorText ? (
              <div className="rounded-[28px] bg-rose-50 p-6 text-center text-rose-700">
                {errorText}
              </div>
            ) : (
              <>
                <div className="mb-6 overflow-x-auto">
                  <div className="inline-flex min-w-full gap-2 rounded-[24px] bg-slate-100 p-2 md:min-w-0">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.key;

                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold whitespace-nowrap transition ${
                            isActive
                              ? "bg-white text-sky-700 shadow-sm"
                              : "text-slate-600 hover:bg-white/70"
                          }`}
                        >
                          <Icon size={16} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {renderActiveSection()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthRecord;