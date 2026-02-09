import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button.jsx";
export default function Register() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Create Account
        </h2>
        <p className="text-gray-500 text-center mt-1">
          Register to get started
        </p>

        {/* Form */}
        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Create password"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <Button text="Register" onClick={() => navigate('/')} />
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <span className="text-indigo-600 font-medium cursor-pointer " onClick={() => navigate('/')}>
            Login
          </span>
          
        </p>
      </div>
    </div>
  );
}
