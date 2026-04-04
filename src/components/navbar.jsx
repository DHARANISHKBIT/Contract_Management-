import { useState, useEffect, useRef } from "react";
import {
  MdOutlineLibraryBooks,
  MdOutlineDashboard,
  MdOutlinePerson,
  MdOutlineNotifications,
} from "react-icons/md";
import { FiMenu, FiX } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { SiGooglemeet } from "react-icons/si";
import { IoPersonCircle } from "react-icons/io5";
import axios from "axios";

const API = "http://localhost:5000/api/notifications";

export default function Navbar() {
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const fetchUnreadCount = () => {
    if (!token) return;
    axios.get(`${API}/unread-count`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (res.data?.success) setUnreadCount(res.data.count ?? 0); })
      .catch(() => {});
  };

  const fetchNotifications = () => {
    if (!token) return;
    axios.get(API, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) setNotifications(res.data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUnreadCount();
    const t = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(t);
  }, [token]);

  useEffect(() => {
    if (!notifOpen || !token) return;
    fetchNotifications();
  }, [notifOpen, token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const markRead = (id) => {
    if (!token) return;
    axios.patch(`${API}/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
        setUnreadCount((c) => Math.max(0, c - 1));
      })
      .catch(() => {});
  };

  const markAllRead = () => {
    if (!token) return;
    axios.patch(`${API}/read-all`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      })
      .catch(() => {});
  };
  const navItem = (name, label, Icon) => (
    <div
      onClick={() => {
        setActive(name);
        setOpen(false);
        if (name === "dashboard") {
          navigate("/admin-dashboard");
        } else if (name === "contracts") {
          navigate("/contract-page");
        } else if (name === "meetings") {
          if (role === "admin") navigate("/admin-meeting");
          else navigate("/user-meeting");
        } else if (name === "users") {
          if (role === "admin") navigate("/admin-users");
        }
      }}
      className={`flex items-center  gap-2 px-4 py-2 rounded-lg cursor-pointer
        ${
          active === name
            ? "bg-blue-600 text-white"
            : "text-black hover:bg-blue-200"
        }` } 
    >
      <Icon className="text-xl" />
      <span className="text-lg">{label}</span>
    </div>
  );
   const logout = () => {
    localStorage.clear();
    navigate("/");
  };


  return (
    <div className="bg-white shadow-sm px-6 py-3">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="p-2 border-4 border-blue-600 rounded-lg bg-blue-600">
            <MdOutlineLibraryBooks className="text-white text-3xl" />
          </div>

          <div>
            <div className="text-[28px] font-bold">CMS</div>
            <div className="text-sm">Contract Management</div>
          </div>
        </div>

         </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-14">
          {navItem("dashboard", "Dashboard", MdOutlineDashboard)}
          {navItem("contracts", "Contracts", FiMenu)}
          {navItem("meetings", "Meetings", SiGooglemeet)}
          {role === "admin" ? navItem("users", "Users", IoPersonCircle) : null}

        </nav>

        {/* Right: notifications + role + logout (desktop) / notifications + menu (mobile) */}
        <div ref={notifRef} className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <MdOutlineNotifications className="text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-96 max-h-[80vh] overflow-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50">
                <div className="sticky top-0 bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-slate-100">
                  {notifications.length === 0 && (
                    <div className="px-4 py-6 text-center text-slate-500 text-sm">No notifications</div>
                  )}
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => !n.read && markRead(n._id)}
                      className={`px-4 py-3 text-left cursor-pointer hover:bg-slate-50 ${n.read ? "bg-white" : "bg-blue-50/50"}`}
                    >
                      <div className="font-medium text-slate-900 text-sm">{n.title}</div>
                      <div className="text-slate-600 text-xs mt-0.5">{n.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 px-4 py-2 bg-gray-100 rounded-lg items-center">
            <MdOutlinePerson />
            <span className="text-sm">{role}</span>
            <span className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">
              {role}
            </span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:text-red-500"
          >
            <IoIosLogOut />
            Logout
          </button>
        </div>

        {/* Notifications (mobile) + Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <MdOutlineNotifications className="text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-96 max-h-[70vh] overflow-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50">
                <div className="sticky top-0 bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <button type="button" onClick={markAllRead} className="text-sm text-blue-600 hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-slate-100">
                  {notifications.length === 0 && (
                    <div className="px-4 py-6 text-center text-slate-500 text-sm">No notifications</div>
                  )}
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => !n.read && markRead(n._id)}
                      className={`px-4 py-3 text-left cursor-pointer hover:bg-slate-50 ${n.read ? "bg-white" : "bg-blue-50/50"}`}
                    >
                      <div className="font-medium text-slate-900 text-sm">{n.title}</div>
                      <div className="text-slate-600 text-xs mt-0.5">{n.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            className="text-2xl p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 space-y-3">
          {navItem("dashboard", "Dashboard", MdOutlineDashboard)}
          {navItem("contracts", "Contracts", FiMenu)}
          {navItem("meetings", "Meetings", SiGooglemeet)}
          {role === "admin" ? navItem("users", "Users", IoPersonCircle) : null}

          <div className="flex gap-2 px-4 py-2 bg-gray-100 rounded-lg items-center">
            <MdOutlinePerson />
            <span className="text-sm">{role}</span>
            <span className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">
              {String(role || "").toUpperCase()}
            </span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:text-red-500 w-full"
          >
            <IoIosLogOut />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}