import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/AdminLogin.css";

function AdminLogin() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginAdmin = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post("/api/admin/login", {
        username,
        password
      });

      alert(response.data.message);

      localStorage.setItem(
        "admin",
        JSON.stringify(response.data.admin)
      );

      navigate("/admin/dashboard");

    } catch (error) {

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server Error");
      }

    }

  };

  return (

    <div className="admin-login-page">

      <div className="admin-login-card">

        <h1>Admin Login</h1>

        <form onSubmit={loginAdmin}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>

  );
}

export default AdminLogin;