import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../utils/idb";

export default function RestaurantLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  
  const {hotellogin} = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("https://ofd-backend.onrender.com/api/restaurants/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed.");
        return;
      }

      if(data.status){
        toast.success("Login successful!");
        hotellogin(data.restaurant);
        navigate("/restaurant/orders"); 
      }
      
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };
  //https://ofd-backend.onrender.com/

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-blue-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Restaurant Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="restaurant@example.com"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/restaurant/register")}
            className="text-teal-600 hover:underline cursor-pointer font-medium"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
