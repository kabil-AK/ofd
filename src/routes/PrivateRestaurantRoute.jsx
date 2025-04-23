import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/idb.jsx";

export default function PrivateRestaurantRoute() {
  const { hotel, loading } = useAuth();

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return hotel ? <Outlet /> : <Navigate to="/restaurant/login" />;
}
