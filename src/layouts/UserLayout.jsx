import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Facebook, Instagram, Twitter } from "lucide-react";
import logo from "../assets/logo.svg";

export default function UserLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <Header />
      <main className="flex-grow w-full  mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-md">
          <Outlet />
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
            <h1 className="text-2xl font-bold flex items-center">
          <span role="img" aria-label="plate"><img src={logo} className="w-12 h-12" /></span> MealGo
        </h1>
              <p className="text-gray-400 mb-4">Discover the best food from over 1,000 restaurants.</p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-rose-500 transition"
                >
                  <span className="sr-only">Facebook</span>
                  <span className="text-sm"><Facebook /></span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-rose-500 transition"
                >
                  <span className="sr-only">Twitter</span>
                  <span className="text-sm"><Twitter /></span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-rose-500 transition"
                >
                  <span className="sr-only">Instagram</span>
                  <span className="text-sm"><Instagram /></span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Restaurants</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                  onClick={()=>{navigate("/restaurant/register")}}
                  className="text-gray-400 hover:text-white transition">
                    Partner With Us
                  </button>
                </li>
                
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">Subscribe to get special offers, free giveaways, and updates.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-1 focus:ring-rose-500 w-full"
                />
                <button className="px-4 py-2 bg-rose-500 text-white rounded-r-lg hover:bg-rose-600 transition">
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} FoodFinder. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 text-sm hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 text-sm hover:text-white transition">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 text-sm hover:text-white transition">
                Cookies Settings
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
