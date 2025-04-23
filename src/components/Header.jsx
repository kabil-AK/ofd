import { useAuth } from "../utils/idb.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { BellDot, Package, ShoppingCart } from "lucide-react";
import logo from "../assets/logo.svg";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-teal-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-2xl font-bold flex items-center cursor-pointer"
        onClick={()=>{navigate("/")}}
        >
          <span role="img" aria-label="plate"><img src={logo} className="w-12 h-12" /></span> MealGo
        </h1>
        <nav className="hidden md:flex space-x-8">
            <button onClick={()=>{navigate("/")}} className="text-gray-200 hover:text-white">
              Home
            </button>
            <button onClick={()=>{navigate("/restaurants")}} className="text-gray-200 hover:text-white">
              Restaurants
            </button>
            <button onClick={()=>{navigate("/about-us")}} className="text-gray-200 hover:text-white">
              About Us
            </button>
          </nav>

          {user ? (
  <div className="flex items-center space-x-4">
    <button
      onClick={() => navigate("/cart")}
      className="flex items-center px-3 py-2 rounded-md bg-white text-black hover:bg-gray-100 transition"
    >
      <ShoppingCart className="mr-2" />
      Cart
    </button>
    <button
      onClick={() => navigate("/my-orders")}
      className="flex items-center px-3 py-2 rounded-md bg-white text-black hover:bg-gray-100 transition"
    >
      <Package className="mr-2" />
      Orders
    </button>
    <button
      onClick={() => navigate("/notifications")}
      className="flex items-center px-3 py-2 rounded-md bg-white text-black hover:bg-gray-100 transition"
    >
      <BellDot className="mr-2" />
      Alerts
    </button>
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center px-3 py-2 rounded-md bg-white text-black hover:bg-gray-100 transition"
      >
        <span>{user.name}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 w-36 mt-2 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <button
              onClick={() => navigate("/profile")}
              className="w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/my-orders")}
              className="w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              My Orders
            </button>
            <button
              onClick={logout}
              className="w-full px-2 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
) : (
  <button
    onClick={() => navigate("/login")}
    className="px-4 py-2 bg-white text-teal-600 rounded-md hover:bg-gray-100 transition"
  >
    Login
  </button>
)}

      </div>
      
    </header>
  );
}
