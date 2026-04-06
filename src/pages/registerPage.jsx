import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import { API_BASE } from "../config/api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    // role can be 'admin' (organization) or 'user' (vendor)
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Registration successful");
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <form className="mt-6 space-y-4" onSubmit={handleRegister}>
          <input
            name="username"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={handleChange}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="user">Vendor</option>
            <option value="admin">Organization (admin)</option>
          </select>

          <Button text="Register" type="submit" />
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <span className="text-indigo-600 cursor-pointer" onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
