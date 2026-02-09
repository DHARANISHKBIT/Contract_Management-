import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 Simple role condition
    if (username === "admin" && password === "admin123") {
      navigate("/admin-dashboard");
    } else if (username && password) {
      navigate("/admin-dashboard");
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Contract Management System
        </h2>
        <p className="text-gray-500 text-center mt-1">
          Please login to continue
        </p>

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg"
              placeholder="Enter password"
            />
          </div>

          
            <Button text="Login" onClick={handleLogin} type="submit" style={{backgroundColor:"indigo"}}/>
           {/* <Button text="Login" onClick={handleLogin} type="submit" /> */}
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don’t have an account?{" "}
          <span
            className="text-indigo-600 font-medium cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
