import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import RestaurantLayout from "../layouts/RestaurantLayout";
import UserLogin from "../pages/user/Login";
import UserRegister from "../pages/user/Register";
import RestaurantLogin from "../pages/restaurant/Login";
import RestaurantRegister from "../pages/restaurant/Register";
import RestaurantProfile from "../pages/restaurant/RestaurantProfile";
import Home from "../pages/user/Home";
import MenuList from "../pages/user/MenuList";
import Cart from "../pages/user/Cart";
import MyOrders from "../pages/user/MyOrders";
import OrderDetails from "../pages/user/OrderDetails";
import PrivateRestaurantRoute from "./PrivateRestaurantRoute";
import Menu from "../pages/restaurant/menu/Menu";
import ResOrders from "../pages/restaurant/ResOrders";
import ViewUpdateOrder from "../pages/restaurant/ViewUpdateOrder";
import Notifications from "../pages/restaurant/Notifications";
import UserNotifications from "../pages/user/UserNotifications";
import Restaurants from "../pages/user/Restaurants";
import MyProfile from "../pages/user/MyProfile";
import ViewRestaurant from "../pages/user/ViewRestaurant";
import ScrollToTop from "../components/ScrollToTop";
import MenuDetails from "../pages/user/MenuDetails";

export default function AppRouter() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/menu/:restaurantId" element={<MenuList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />
          <Route path="/notifications" element={<UserNotifications />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:hotelId" element={<ViewRestaurant />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/menu-details/:menuId" element={<MenuDetails />} />
          {/* Add more user routes here */}
          <Route path="/" element={<Home />} />
        </Route>

        {/* Public Restaurant Routes (NO layout) */}
        <Route path="/restaurant/login" element={<RestaurantLogin />} />
        <Route path="/restaurant/register" element={<RestaurantRegister />} />

        {/* Protected Restaurant Routes */}
        <Route element={<PrivateRestaurantRoute />}>
          <Route element={<RestaurantLayout />}>
            <Route path="/restaurant/dashboard" element={<p >Hello</p>} />
            <Route path="/restaurant/menu" element={<Menu />} />
            <Route path="/restaurant/profile" element={<RestaurantProfile />} />
            <Route path="/restaurant/orders" element={<ResOrders />} />
            <Route path="/restaurant/orders/:id" element={<ViewUpdateOrder />} />
            <Route path="/restaurant/notifications" element={<Notifications />} />
            {/* Add more protected restaurant routes here */}
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}
