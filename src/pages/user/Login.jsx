import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../utils/idb";

export default function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {login} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://ofd-backend.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed")
        throw new Error(data.message || "Login failed");
        
      }

      // Save token or user data if needed here
      // Example: localStorage.setItem("token", data.token);
      if(data.status){

        login(data.user);
      }
      toast.success(data.message || "Login Successful");

      navigate("/"); // or any page after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          User Login
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Welcome back! Please log in to your account.
        </p>

        {error && (
          <div className="text-red-600 text-sm text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-teal-600 hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
