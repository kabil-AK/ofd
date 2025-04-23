import { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  Utensils,
  ChevronLeft,
  ChevronRight,
  BellDot
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  const navItems = [
    { label: "Orders", icon: <Receipt size={20} />, path: "/restaurant/orders" },
    { label: "Menu", icon: <Utensils size={20} />, path: "/restaurant/menu" },
    {label : "Notifications", icon: <BellDot size={20} />, path: "/restaurant/notifications"},
  ];

  return (
    <aside
      className={`${
        isExpanded ? "w-64" : "w-20"
      } bg-gray-100 h-screen p-4 transition-all duration-300 shadow-md`}
    >
      <div className="flex justify-end mb-6">
        <button
          onClick={toggleSidebar}
          className="text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <ul className="space-y-4">
        {navItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className="flex items-center space-x-3 text-gray-800 hover:bg-gray-200 rounded-md px-2 py-2 transition"
              data-tooltip-id="my-tooltip"
  data-tooltip-content={item.label}
            >
              {item.icon}
              
              {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
