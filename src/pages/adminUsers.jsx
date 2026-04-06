import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiExternalLink, FiInfo, FiPlus, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { API_BASE } from "../config/api";

const USERS_API = `${API_BASE}/users`;
const ASSIGNED_USERS_URL = `${USERS_API}/assigned-to-my-contracts`;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function buildPrefilledFormUrl(email) {
  const formUrl = import.meta.env.VITE_USER_DETAILS_FORM_URL || "";
  const emailEntry = import.meta.env.VITE_USER_DETAILS_EMAIL_ENTRY || "";
  if (!formUrl || !emailEntry) return null;
  const url = new URL(formUrl);
  url.searchParams.set("usp", "pp_url");
  url.searchParams.set(`entry.${emailEntry}`, email);
  return url.toString();
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [role] = useState(() => localStorage.getItem("role"));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addForm, setAddForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const getToken = () => localStorage.getItem("token");

  const loadUsers = async () => {
    const token = getToken();
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(ASSIGNED_USERS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) setUsers(Array.isArray(res.data.data) ? res.data.data : []);
      else setError(res.data?.message || "Failed to load users");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/", { replace: true });
        return;
      }
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role !== "admin") {
      navigate("/admin-dashboard", { replace: true });
      return;
    }
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, role]);

  const filtered = users.filter((u) => {
    const query = q.trim().toLowerCase();
    if (!query) return true;
    return (
      String(u.username || "").toLowerCase().includes(query) ||
      String(u.email || "").toLowerCase().includes(query) ||
      String(u.role || "").toLowerCase().includes(query)
    );
  });

  const openDetailsForm = (email) => {
    if (!email) return;
    const formLink = buildPrefilledFormUrl(String(email).trim().toLowerCase());
    if (!formLink) {
      alert(
        "Google Form link is not configured.\n\nSet VITE_USER_DETAILS_FORM_URL and VITE_USER_DETAILS_EMAIL_ENTRY in my-project/.env"
      );
      return;
    }
    window.open(formLink, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (u, e) => {
    e?.stopPropagation?.();
    if (!window.confirm(`Delete user "${u.username}"? This cannot be undone.`)) return;
    const token = getToken();
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    try {
      const res = await axios.delete(`${USERS_API}/${u.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setUsers((prev) => prev.filter((x) => x.id !== u.id));
        if (selectedUser?.id === u.id) setSelectedUser(null);
      } else {
        alert(res.data?.message || "Delete failed");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, role: newRole } = addForm;
    if (!String(username).trim()) {
      alert("Username is required");
      return;
    }
    if (!isValidEmail(email)) {
      alert("Please enter a valid email");
      return;
    }
    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    const token = getToken();
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    setAddSubmitting(true);
    try {
      const res = await axios.post(
        `${USERS_API}/admin/create`,
        {
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: newRole,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data?.success && res.data.data) {
        const row = res.data.data;
        setUsers((prev) => {
          if (prev.some((x) => x.id === row.id)) return prev;
          return [row, ...prev];
        });
        setAddForm({ username: "", email: "", password: "", role: "user" });
        setAddOpen(false);
        alert("User created successfully");
      } else {
        alert(res.data?.message || "Failed to create user");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    } finally {
      setAddSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto w-full min-w-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-2 tracking-tight">
              Users
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">
              Users assigned to your contracts — view details, add, or remove
            </p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 w-full sm:w-auto sm:shrink-0">
            <button
              type="button"
              onClick={loadUsers}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all w-full sm:w-auto"
            >
              <FiRefreshCw />
              Refresh
            </button>
            <button
              type="button"
              style={{ backgroundColor: "#6a6cfc" }}
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-medium shadow-lg hover:opacity-95 transition-all w-full sm:w-auto"
            >
              <FiPlus />
              Add new user
            </button>
          </div>
        </div>

        <div className="mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by username, email, role..."
            className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 shadow-sm"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-4 px-4 lg:px-6 py-4 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-700">
              <div className="col-span-3">Username</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            {filtered.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-12 gap-4 px-4 lg:px-6 py-4 border-b border-slate-100 items-center hover:bg-slate-50"
              >
                <div className="col-span-3 font-semibold text-slate-900 truncate" title={u.username}>
                  {u.username || "—"}
                </div>
                <div className="col-span-4 text-slate-700 break-all text-sm">{u.email || "—"}</div>
                <div className="col-span-2 text-slate-800">{u.role || "user"}</div>
                <div className="col-span-3 flex justify-end gap-2">
                  <button
                    type="button"
                    title="View details"
                    onClick={() => setSelectedUser(u)}
                    className="p-2.5 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <FiInfo className="text-xl" />
                  </button>
                  <button
                    type="button"
                    title="Delete user"
                    onClick={(e) => handleDelete(u, e)}
                    className="p-2.5 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {filtered.map((u) => (
              <div key={u.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 break-words">{u.username || "—"}</p>
                    <p className="text-sm text-slate-600 break-all mt-1">{u.email || "—"}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium uppercase px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {u.role || "user"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(u)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium text-sm"
                  >
                    <FiInfo className="text-lg" />
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(u, e)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 bg-white text-red-600 font-medium text-sm"
                  >
                    <FiTrash2 className="text-lg" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="px-6 py-10 text-center text-slate-500">No users found.</div>
          )}
        </div>
      </div>

      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900">User details</h2>
                <p className="text-slate-600 text-sm mt-1">Information for this user</p>
              </div>
              <button
                type="button"
                className="px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>

            <div className="px-4 sm:px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3">
                <div className="text-sm font-semibold text-slate-700">Username</div>
                <div className="sm:col-span-2 text-slate-900 break-words">{selectedUser.username || "—"}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3">
                <div className="text-sm font-semibold text-slate-700">Email</div>
                <div className="sm:col-span-2 text-slate-900 break-all">{selectedUser.email || "—"}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3">
                <div className="text-sm font-semibold text-slate-700">Role</div>
                <div className="sm:col-span-2 text-slate-900">{selectedUser.role || "user"}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3">
                <div className="text-sm font-semibold text-slate-700">Created</div>
                <div className="sm:col-span-2 text-slate-900 text-sm">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "—"}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3">
                <div className="text-sm font-semibold text-slate-700">Updated</div>
                <div className="sm:col-span-2 text-slate-900 text-sm">
                  {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : "—"}
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-sm font-medium text-slate-800"
                onClick={() => openDetailsForm(selectedUser.email)}
              >
                <FiExternalLink />
                Open full details form
              </button>
            </div>
          </div>
        </div>
      )}

      {addOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
          onClick={() => !addSubmitting && setAddOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200">
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900">Add new user</h2>
              <p className="text-slate-600 text-sm mt-1">
                Creates an account in the system. Assign the user on a contract to show them in this list.
              </p>
            </div>
            <form onSubmit={handleAddSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Username</label>
                <input
                  required
                  value={addForm.username}
                  onChange={(e) => setAddForm((f) => ({ ...f, username: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={addForm.password}
                  onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  disabled={addSubmitting}
                  onClick={() => setAddOpen(false)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  style={{ backgroundColor: "#6a6cfc" }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl text-white font-medium disabled:opacity-50"
                >
                  {addSubmitting ? "Creating…" : "Create user"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
