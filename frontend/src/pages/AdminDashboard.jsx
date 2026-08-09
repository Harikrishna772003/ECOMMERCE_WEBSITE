import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import MonthlySalesChart from "../components/MonthlySalesChart";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminDashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        total_users: 0,
        total_products: 0,
        total_orders: 0,
        total_revenue: 0
    });

    const [topProducts, setTopProducts] = useState([]);

    const [recentOrders, setRecentOrders] = useState([]);

    const [lowStock, setLowStock] = useState([]);

    useEffect(() => {

        const admin = localStorage.getItem("admin");

        if (!admin) {

            navigate("/admin/login");

            return;

        }

        fetchDashboard();

        fetchTopProducts();

        fetchRecentOrders();

        fetchLowStock();

    }, []);

    const fetchDashboard = async () => {

        try {

            const response = await API.get(
                "/api/admin/dashboard/stats"
            );

            setStats(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const fetchTopProducts = async () => {

        try {

            const response = await API.get(
                "/api/admin/dashboard/top-products"
            );

            setTopProducts(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const fetchRecentOrders = async () => {

        try {

            const response = await API.get(
                "/api/admin/dashboard/recent-orders"
            );

            setRecentOrders(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const fetchLowStock = async () => {

        try {

            const response = await API.get(
                "/api/admin/dashboard/low-stock"
            );

            setLowStock(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const logout = () => {

        localStorage.removeItem("admin");

        navigate("/admin/login");

    };

    return (<div className="admin-layout">

    <AdminSidebar />

    <div className="admin-content">

        <div className="admin-navbar">

            <h2>📊 ShopEase Analytics Dashboard</h2>

            <button onClick={logout}>
                Logout
            </button>

        </div>

        {/* Dashboard Cards */}

        <div className="dashboard-cards">

            <div className="card users-card">

                <h2>{stats.total_users}</h2>

                <p>👥 Total Users</p>

            </div>

            <div className="card products-card">

                <h2>{stats.total_products}</h2>

                <p>📦 Products</p>

            </div>

            <div className="card orders-card">

                <h2>{stats.total_orders}</h2>

                <p>🛒 Orders</p>

            </div>

            <div className="card revenue-card">

                <h2>

                    ₹ {Number(stats.total_revenue).toFixed(2)}

                </h2>

                <p>💰 Revenue</p>

            </div>

        </div>

        {/* Monthly Sales */}

        <div className="chart-container">

            <h2>📈 Monthly Sales</h2>

            <MonthlySalesChart />

        </div>

        {/* Top Selling Products */}

        <div className="dashboard-section">

            <h2>🏆 Top Selling Products</h2>

            <div className="top-products">

                {topProducts.length > 0 ? (

                    topProducts.map((product, index) => (

                        <div
                            key={index}
                            className="top-product-card"
                        >

                            <img
                                src={product.image}
                                alt={product.name}
                            />

                            <h4>{product.name}</h4>

                            <p>

                                Sold : <b>{product.sold}</b>

                            </p>

                        </div>

                    ))

                ) : (

                    <h3>No Products Sold Yet</h3>

                )}

            </div>

        </div>

        {/* Low Stock Alert */}

        <div className="dashboard-section">

            <h2>⚠ Low Stock Alerts</h2>

            <table className="admin-table">

                <thead>

                    <tr>

                        <th>Image</th>

                        <th>Product</th>

                        <th>Category</th>

                        <th>Stock</th>

                    </tr>

                </thead>

                <tbody>

                    {lowStock.length > 0 ? (

                        lowStock.map((product) => (

                            <tr key={product.id}>

                                <td>

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        width="55"
                                    />

                                </td>

                                <td>{product.name}</td>

                                <td>{product.category}</td>

                                <td>

                                    <span
                                        className={
                                            product.stock === 0
                                                ? "status-red"
                                                : "status-yellow"
                                        }
                                    >

                                        {product.stock}

                                    </span>

                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan="4"
                                style={{
                                    textAlign: "center"
                                }}
                            >

                                All Products Have Healthy Stock ✅

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>

        {/* Recent Orders */}

        <div className="dashboard-section">

            <h2>📦 Recent Orders</h2>

            <table className="admin-table">

                <thead>

                    <tr>

                        <th>Order ID</th>

                        <th>User</th>

                        <th>Amount</th>

                        <th>Status</th>

                        <th>Date</th>

                    </tr>

                </thead>

                <tbody>

                    {recentOrders.length > 0 ? (

                        recentOrders.map((order) => (

                            <tr key={order.id}>

                                <td>{order.id}</td>

                                <td>{order.user_id}</td>

                                <td>₹ {order.amount}</td>

                                <td>{order.status}</td>

                                <td>{order.date}</td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan="5"
                                style={{
                                    textAlign: "center"
                                }}
                            >

                                No Orders Found

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>

        {/* Quick Actions */}
                {/* Quick Actions */}

        <div className="dashboard-links">

            <Link to="/admin/users">
                👥 Manage Users
            </Link>

            <Link to="/admin/products">
                📦 Products
            </Link>

            <Link to="/admin/orders">
                🛒 Orders
            </Link>

            <Link to="/admin/reviews">
                ⭐ Reviews
            </Link>

            <Link to="/admin/coupons">
                🎟 Coupons
            </Link>

        </div>

    </div>

</div>

    );

}

export default AdminDashboard;