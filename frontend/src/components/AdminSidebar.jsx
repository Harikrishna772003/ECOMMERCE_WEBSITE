import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminSidebar.css";

function AdminSidebar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("admin");

    navigate("/admin/login");

  };

  return (

    <div className="admin-sidebar">

      <h2>🛒 ShopEase</h2>

      <Link to="/admin/dashboard">
        📊 Dashboard
      </Link>

      <Link to="/admin/users">
        👥 Users
      </Link>

      <Link to="/admin/products">
        📦 Products
      </Link>

      <Link to="/admin/orders">
        📋 Orders
      </Link>

      <Link to="/admin/coupons">
        🎟 Coupons
      </Link>

      <Link to="/admin/reviews">
        ⭐ Reviews
      </Link>

      <button
        className="logout-btn"
        onClick={logout}
      >
        🚪 Logout
      </button>

    </div>

  );

}

export default AdminSidebar;