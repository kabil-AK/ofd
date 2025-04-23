import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

export default function UserRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("https://ofd-backend.onrender.com/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed")
        throw new Error(data.message || "Registration failed.");
      }
      toast.success(data.message || "Registration Successful");
      // Success: redirect to login
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          User Register
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Create an account to start ordering delicious food.
        </p>

        {error && (
          <div className="text-red-600 text-sm text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-teal-600 hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
