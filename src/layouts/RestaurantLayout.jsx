import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ResHeader from "../components/ResHeader";

export default function RestaurantLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ResHeader />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-white overflow-y-auto h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
