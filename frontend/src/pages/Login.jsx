import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api/api";
import "../styles/Login.css";

function Login() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });

    };


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async (e) => {

        e.preventDefault();


        // ---------------------------------------------
        // BASIC VALIDATION
        // ---------------------------------------------

        if (!user.email.trim()) {

            alert("Please enter your email.");

            return;

        }


        if (!user.password) {

            alert("Please enter your password.");

            return;

        }


        try {

            setLoading(true);


            // -----------------------------------------
            // LOGIN API
            // -----------------------------------------

            const response = await API.post(
                "/api/login",
                {
                    email: user.email.trim(),
                    password: user.password,
                }
            );


            // -----------------------------------------
            // SAVE JWT TOKEN
            // -----------------------------------------

            localStorage.setItem(
                "token",
                response.data.token
            );


            // -----------------------------------------
            // SAVE LOGGED-IN USER
            // -----------------------------------------

            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.data.user
                )
            );


            // -----------------------------------------
            // SUCCESS MESSAGE
            // -----------------------------------------

            alert(
                response.data.message ||
                "Login successful."
            );


            // -----------------------------------------
            // REDIRECT HOME
            // -----------------------------------------

            navigate("/");

        }

        catch (error) {

            console.log(
                "Login Error:",
                error
            );


            if (error.response) {

                alert(
                    error.response.data?.message ||
                    "Invalid email or password."
                );

            }

            else {

                alert(
                    "Unable to connect to server."
                );

            }

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOGIN PAGE
    // =====================================================

    return (

        <div className="login-page">


            {/* =========================================
                LOGIN CARD
            ========================================= */}

            <div className="login-card">


                {/* =====================================
                    LEFT / BRAND SECTION
                ===================================== */}

                <div className="login-brand">

                    <div className="login-brand-icon">
                        🛍️
                    </div>

                    <h1>
                        ShopEase
                    </h1>

                    <p>
                        Your favourite products,
                        <br />
                        all in one place.
                    </p>

                    <div className="login-brand-points">

                        <span>
                            ✓ Easy Shopping
                        </span>

                        <span>
                            ✓ Secure Login
                        </span>

                        <span>
                            ✓ Fast Checkout
                        </span>

                    </div>

                </div>


                {/* =====================================
                    LOGIN FORM
                ===================================== */}

                <div className="login-form-section">

                    <div className="login-form-header">

                        <h2>
                            Welcome Back
                        </h2>

                        <p>
                            Login to continue shopping
                        </p>

                    </div>


                    <form
                        className="login-form"
                        onSubmit={handleLogin}
                    >


                        {/* =================================
                            EMAIL
                        ================================= */}

                        <div className="login-field">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className="login-input-wrapper">

                                <span className="login-input-icon">
                                    ✉️
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={user.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />

                            </div>

                        </div>


                        {/* =================================
                            PASSWORD
                        ================================= */}

                        <div className="login-field">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="login-input-wrapper">

                                <span className="login-input-icon">
                                    🔒
                                </span>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Enter your password"
                                    value={user.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >

                                    {
                                        showPassword
                                            ? "🙈"
                                            : "👁️"
                                    }

                                </button>

                            </div>

                        </div>


                        {/* =================================
                            LOGIN BUTTON
                        ================================= */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {

                                loading

                                    ?

                                    "Logging in..."

                                    :

                                    "🔐 Login"

                            }

                        </button>


                    </form>


                    {/* =================================
                        REGISTER
                    ================================= */}

                    <div className="login-register">

                        <p>

                            Don't have an account?

                            {" "}

                            <Link to="/register">
                                Create Account
                            </Link>

                        </p>

                    </div>


                </div>

            </div>


            {/* =========================================
                FOOTER TEXT
            ========================================= */}

            <p className="login-footer">

                © ShopEase · Secure & Easy Shopping

            </p>


        </div>

    );

}

export default Login;