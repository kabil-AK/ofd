import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RestaurantRegister() {
  const [formData, setFormData] = useState({
    shopName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { shopName, email, password, confirmPassword, address } = formData;
    if (!shopName || !email || !password || !confirmPassword || !address) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
  
    try {
      const res = await fetch("https://ofd-backend.onrender.com/api/restaurants/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: shopName,
          email,
          password,
          address,
          // Optional placeholder data for required fields
          description: "",
          phone: "",
          shop_image: "",
          shop_banner: "",
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        toast.error(data.message || "Registration failed.");
        return;
      }
  
      toast.success("Registered successfully!");
      navigate("/restaurant/login");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-blue-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Register Your Restaurant</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Shop Name</label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="e.g. Pizza Palace"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
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

            <div>
              <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Location / Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="123 Food Street, Flavor Town"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/restaurant/login")}
            className="text-teal-600 hover:underline cursor-pointer font-medium"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
