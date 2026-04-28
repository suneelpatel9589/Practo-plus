import React, { useEffect, useMemo, useState } from "react";
import API from './../api';
import { toast } from "react-toastify";
import {

  Users,
  ShieldCheck,
  UserCheck,
  Stethoscope,
  UserRound,
  RefreshCcw,
  Loader2,
  Mail,
  BadgeCheck,
  Search,
  Filter,
  Sparkles,
  Trash2,
  Save,
} from "lucide-react";


function AdminUsers() {
  const token = localStorage.getItem("access") || localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);
  const [roleDrafts, setRoleDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setError("");
      if (users.length === 0) setLoading(true);
      else setRefreshing(true);

      const res = await API.get("/admin-users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : [];
      setUsers(data);

      const drafts = {};
      data.forEach((u) => {
        drafts[u.id] = u.role;
      });
      setRoleDrafts(drafts);
    } catch {
      setError("Unable to load users. Please try again later.");
      toast.error("unable to fetch users. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function updateUserRole(userId) {
    const newRole = roleDrafts[userId];
    if (!newRole) {
      toast.error("Please select a role");
      return;
    }

    try {
      setSavingId(userId);

      const res = await API.patch(
        `/admin-users/${userId}/`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: res.data?.role || newRole } : u
        )
      );

      toast.success("User role updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Role update failed");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteUser(userId) {
    const ok = window.confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {
      setDeletingId(userId);

      await API.delete(`/admin-users/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.detail || "User delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  const adminCount = users.filter((user) => user.role === "ADMIN").length;
  const doctorCount = users.filter((user) => user.role === "DOCTOR").length;
  const patientCount = users.filter((user) => user.role === "PATIENT").length;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = roleFilter === "ALL" ? true : user.role === roleFilter;
      const q = search.trim().toLowerCase();

      const matchesSearch =
        q === "" ||
        user.email?.toLowerCase().includes(q) ||
        user.username?.toLowerCase().includes(q) ||
        String(user.id).includes(q) ||
        user.role?.toLowerCase().includes(q);

      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  function getRoleStyle(role) {
    if (role === "ADMIN") {
      return "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white ring-1 ring-violet-200";
    }
    if (role === "DOCTOR") {
      return "bg-gradient-to-r from-sky-500 to-cyan-500 text-white ring-1 ring-sky-200";
    }
    return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white ring-1 ring-emerald-200";
  }

  function getRoleIcon(role) {
    if (role === "ADMIN") return <ShieldCheck size={16} />;
    if (role === "DOCTOR") return <Stethoscope size={16} />;
    return <UserCheck size={16} />;
  }

  const statCards = [
    {
      title: "Total Users",
      value: users.length,
      icon: <Users size={22} />,
      iconWrap: "bg-gradient-to-br from-slate-900 to-indigo-700 text-white",
      sub: "All registered accounts",
    },
    {
      title: "Admins",
      value: adminCount,
      icon: <ShieldCheck size={22} />,
      iconWrap: "bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700",
      sub: "System controllers",
    },
    {
      title: "Doctors",
      value: doctorCount,
      icon: <Stethoscope size={22} />,
      iconWrap: "bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-700",
      sub: "Medical professionals",
    },
    {
      title: "Patients",
      value: patientCount,
      icon: <UserCheck size={22} />,
      iconWrap: "bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700",
      sub: "End users",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fafc,_#eef2ff)] px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
        <section className="relative overflow-hidden rounded-[22px] sm:rounded-[28px] border border-white/50 bg-slate-950 p-4 sm:p-6 lg:p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(129,140,248,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.18),_transparent_28%)]" />

          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[11px] sm:px-4 sm:text-sm font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur-md">
                <Sparkles size={14} />
                Admin Dashboard
              </div>

              <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold leading-tight">
                Manage Your Users with Ease
              </h1>

              <p className="mt-3 max-w-2xl text-xs sm:text-sm lg:text-base leading-6 text-slate-300">
                Search users, filter roles, update roles, and delete accounts from one modern interface.
              </p>
            </div>

            <button
              onClick={fetchUsers}
              disabled={refreshing}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {refreshing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <RefreshCcw size={18} />
              )}
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[20px] sm:rounded-[24px] border border-slate-200/70 bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/50 p-4 sm:p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {card.value}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
                </div>
                <div className={`rounded-2xl p-3 shrink-0 ${card.iconWrap}`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[22px] sm:rounded-[28px] border border-slate-200/70 bg-gradient-to-r from-white via-slate-50 to-indigo-50/60 p-4 sm:p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email, username, id, or role"
                className="h-11 sm:h-12 w-full rounded-2xl border border-slate-200 bg-white/80 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div className="flex w-full flex-col sm:flex-row gap-3 lg:w-auto">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-sky-50 px-4 py-3 text-sm text-slate-600 w-full sm:w-auto">
                <Filter size={16} className="shrink-0" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full bg-transparent font-medium text-slate-700 outline-none"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="PATIENT">Patient</option>
                </select>
              </div>

              <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-700 px-4 py-3 text-sm font-semibold text-white w-full sm:w-auto">
                {filteredUsers.length} Result{filteredUsers.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-[28px] border border-slate-200/70 bg-white/90 shadow-sm">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="animate-spin" size={22} />
              <span className="text-sm font-medium">Loading users...</span>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-pink-100 text-slate-600">
              <Users size={26} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No users found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try changing the search term or role filter.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5">
            {filteredUsers.map((u) => {
              const roleChanged = roleDrafts[u.id] && roleDrafts[u.id] !== u.role;

              return (
                <article
                  key={u.id}
                  className="group rounded-[22px] sm:rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 p-4 sm:p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
                >
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 via-slate-100 to-sky-100 text-slate-700 ring-1 ring-slate-200">
                        <UserRound size={22} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-sm sm:text-base lg:text-lg font-bold text-slate-900">
                          {u.username || "No Username"}
                        </h2>
                        <p className="truncate text-xs sm:text-sm text-slate-500">
                          {u.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-semibold ${getRoleStyle(
                        u.role
                      )}`}
                    >
                      {getRoleIcon(u.role)}
                      {u.role}
                    </span>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/60 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">User ID</span>
                      <span className="font-semibold text-slate-800">{u.id}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">Username</span>
                      <span className="max-w-[60%] truncate font-semibold text-slate-800">
                        {u.username || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">Current Role</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                        <BadgeCheck size={16} />
                        {u.role}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-sky-50/60 px-4 py-3 text-sm text-slate-600 min-w-0">
                    <Mail size={16} className="shrink-0 text-slate-400" />
                    <span className="truncate">{u.email}</span>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">
                        Change Role
                      </label>
                      <select
                        value={roleDrafts[u.id] || u.role}
                        onChange={(e) =>
                          setRoleDrafts((prev) => ({
                            ...prev,
                            [u.id]: e.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="PATIENT">Patient</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => updateUserRole(u.id)}
                        disabled={!roleChanged || savingId === u.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {savingId === u.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                        Save
                      </button>

                      <button
                        onClick={() => deleteUser(u.id)}
                        disabled={deletingId === u.id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === u.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;