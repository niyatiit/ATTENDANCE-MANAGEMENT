/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Login() {
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const loginUser = async (data) => {
    data.role = role;

    axios
      .post("https://attendance-management-nine.vercel.app/login", data, { withCredentials: true })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/faculty");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Sign in to your Account</h1>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit(loginUser)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your email</label>
            <input
              {...register("email", { required: true })}
              type="text"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Your password</label>
            <input
              {...register("password", { required: true })}
              type="password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="student"
                onChange={() => setRole("student")}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Student</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="role"
                value="faculty"
                onChange={() => setRole("faculty")}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Faculty</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
