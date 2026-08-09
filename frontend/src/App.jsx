import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";

// ============================================================
// USER PAGES
// ============================================================

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import OrderDetails from "./pages/OrderDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";

// ============================================================
// ADMIN PAGES
// ============================================================

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminCoupons from "./pages/AdminCoupons";
import AdminReviews from "./pages/AdminReviews";

// ============================================================
// COMMON PAGES
// ============================================================

import NotFound from "./pages/NotFound";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ====================================================
                    USER LAYOUT
                ==================================================== */}

                <Route element={<Layout />}>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/product/:id"
                        element={<ProductDetails />}
                    />

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    <Route
                        path="/wishlist"
                        element={<Wishlist />}
                    />

                    <Route
                        path="/checkout"
                        element={<Checkout />}
                    />

                    <Route
                        path="/orders"
                        element={<Orders />}
                    />

                    <Route
                        path="/order/details/:orderId"
                        element={<OrderDetails />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                </Route>


                {/* ====================================================
                    AUTH ROUTES
                ==================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ====================================================
                    PASSWORD RESET
                ==================================================== */}

                {/* IMPORTANT:
                    This route must NOT be inside Layout.
                */}

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* ====================================================
                    ADMIN ROUTES
                ==================================================== */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/users"
                    element={<AdminUsers />}
                />

                <Route
                    path="/admin/products"
                    element={<AdminProducts />}
                />

                <Route
                    path="/admin/orders"
                    element={<AdminOrders />}
                />

                <Route
                    path="/admin/coupons"
                    element={<AdminCoupons />}
                />

                <Route
                    path="/admin/reviews"
                    element={<AdminReviews />}
                />


                {/* ====================================================
                    404 PAGE
                ==================================================== */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;