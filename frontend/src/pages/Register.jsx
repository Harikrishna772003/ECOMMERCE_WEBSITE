import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/Register.css";

function Register() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async () => {

        if (!user.name || !user.email || !user.password || !user.confirmPassword) {
            alert("Please fill all fields.");
            return;
        }

        if (user.password !== user.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            const response = await API.post(
                "/api/register",
                {
                    full_name: user.name,
                    email: user.email,
                    password: user.password,
                }
            );

            alert(response.data.message);

            console.log(response.data);

            navigate("/login");

        } catch (error) {

            console.error(error);

            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Registration Failed"
                );
            } else {
                alert("Server Error");
            }
        }
    };

    return (

        <div className="register-page">

            <div className="register-box">

                {/* ==========================
                    LEFT SECTION
                ========================== */}

                <div className="register-left">

                    <div className="register-logo">
                        🛍️
                    </div>

                    <h1>
                        ShopEase
                    </h1>

                    <p>
                        Create your account and start shopping today.
                    </p>

                    <div className="register-features">

                        <div className="register-feature">
                            ✓ Easy Shopping
                        </div>

                        <div className="register-feature">
                            ✓ Secure Account
                        </div>

                        <div className="register-feature">
                            ✓ Fast Checkout
                        </div>

                    </div>

                </div>


                {/* ==========================
                    RIGHT SECTION
                ========================== */}

                <div className="register-right">

                    <h2>
                        Create Account
                    </h2>

                    <p className="register-subtitle">
                        Join ShopEase today
                    </p>


                    {/* ==========================
                        FULL NAME
                    ========================== */}

                    <div className="register-input-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={user.name}
                            onChange={handleChange}
                        />

                    </div>


                    {/* ==========================
                        EMAIL
                    ========================== */}

                    <div className="register-input-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={handleChange}
                        />

                    </div>


                    {/* ==========================
                        PASSWORD
                    ========================== */}

                    <div className="register-input-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create your password"
                            value={user.password}
                            onChange={handleChange}
                        />

                    </div>


                    {/* ==========================
                        CONFIRM PASSWORD
                    ========================== */}

                    <div className="register-input-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={user.confirmPassword}
                            onChange={handleChange}
                        />

                    </div>


                    {/* ==========================
                        REGISTER BUTTON
                    ========================== */}

                    <button onClick={handleRegister}>
                        🔐 Create Account
                    </button>


                    {/* ==========================
                        LOGIN LINK
                    ========================== */}

                    <div className="register-login-link">

                        Already have an account?{" "}

                        <Link to="/login">
                            Login
                        </Link>

                    </div>

                </div>

            </div>


            {/* ==========================
                FOOTER TEXT
            ========================== */}

            <div
                style={{
                    position: "absolute",
                    bottom: "18px",
                    width: "100%",
                    textAlign: "center",
                    fontSize: "11px",
                    color: "#94a3b8",
                }}
            >
                © 2026 ShopEase · Secure & Easy Shopping
            </div>

        </div>

    );
}

export default Register;