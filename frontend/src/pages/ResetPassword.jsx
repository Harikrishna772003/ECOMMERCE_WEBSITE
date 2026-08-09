import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import API from "../api/api";


function ResetPassword() {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    // =========================================================
    // GET TOKEN FROM EMAIL URL
    // =========================================================

    const token =
        searchParams.get("token");


    // =========================================================
    // STATE
    // =========================================================

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    const handleResetPassword = async (e) => {

        e.preventDefault();


        // -----------------------------------------------------
        // TOKEN CHECK
        // -----------------------------------------------------

        if (!token) {

            alert(
                "Reset link is invalid or missing."
            );

            navigate("/login");

            return;
        }


        // -----------------------------------------------------
        // PASSWORD REQUIRED
        // -----------------------------------------------------

        if (!newPassword) {

            alert(
                "Please enter a new password."
            );

            return;
        }


        // -----------------------------------------------------
        // PASSWORD LENGTH
        // -----------------------------------------------------

        if (newPassword.length < 6) {

            alert(
                "Password must contain at least 6 characters."
            );

            return;
        }


        // -----------------------------------------------------
        // CONFIRM PASSWORD
        // -----------------------------------------------------

        if (!confirmPassword) {

            alert(
                "Please confirm your new password."
            );

            return;
        }


        // -----------------------------------------------------
        // MATCH CHECK
        // -----------------------------------------------------

        if (
            newPassword !==
            confirmPassword
        ) {

            alert(
                "Passwords do not match."
            );

            return;
        }


        // -----------------------------------------------------
        // API
        // -----------------------------------------------------

        try {

            setLoading(true);


            const response =
                await API.post(
                    "/api/reset-password",
                    {
                        token: token,

                        password:
                            newPassword,

                        confirm_password:
                            confirmPassword
                    }
                );


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            alert(
                response.data.message ||
                "Password reset successfully."
            );


            // -------------------------------------------------
            // CLEAR PASSWORD FIELDS
            // -------------------------------------------------

            setNewPassword("");

            setConfirmPassword("");


            // -------------------------------------------------
            // LOGIN
            // -------------------------------------------------

            navigate("/login");

        }

        catch (error) {

            console.error(
                "RESET PASSWORD ERROR:",
                error
            );


            if (error.response) {

                alert(
                    error.response.data?.message ||
                    "Unable to reset password."
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


    // =========================================================
    // INVALID TOKEN PAGE
    // =========================================================

    if (!token) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#f4f7fb",
                    padding: "20px"
                }}
            >

                <div
                    style={{
                        width: "100%",
                        maxWidth: "500px",
                        background: "#ffffff",
                        padding: "40px",
                        borderRadius: "15px",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.10)",
                        textAlign: "center"
                    }}
                >

                    <div
                        style={{
                            fontSize: "50px",
                            marginBottom: "15px"
                        }}
                    >
                        🔒
                    </div>


                    <h1
                        style={{
                            color: "#1e3a8a",
                            marginBottom: "10px"
                        }}
                    >
                        Invalid Reset Link
                    </h1>


                    <p
                        style={{
                            color: "#555",
                            marginBottom: "25px"
                        }}
                    >
                        This password recovery link is
                        missing or invalid.
                    </p>


                    <button
                        onClick={() =>
                            navigate("/login")
                        }
                        style={{
                            width: "100%",
                            padding: "13px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#2563eb",
                            color: "#ffffff",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Back to Login
                    </button>

                </div>

            </div>

        );

    }


    // =========================================================
    // RESET PASSWORD PAGE
    // =========================================================

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f7fb",
                padding: "20px"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    background: "#ffffff",
                    padding: "40px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.10)"
                }}
            >

                {/* =================================================
                    LOGO
                ================================================= */}

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "25px"
                    }}
                >

                    <div
                        style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "50%",
                            background: "#2563eb",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "35px",
                            margin: "0 auto 15px"
                        }}
                    >
                        🛍️
                    </div>


                    <h1
                        style={{
                            margin: 0,
                            color: "#1e3a8a",
                            fontSize: "30px"
                        }}
                    >
                        ShopEase
                    </h1>

                </div>


                {/* =================================================
                    TITLE
                ================================================= */}

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "25px"
                    }}
                >

                    <h2
                        style={{
                            marginBottom: "8px",
                            color: "#111827"
                        }}
                    >
                        Reset Password
                    </h2>


                    <p
                        style={{
                            color: "#6b7280"
                        }}
                    >
                        Create a new password for your account.
                    </p>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={
                        handleResetPassword
                    }
                >

                    {/* =============================================
                        NEW PASSWORD
                    ============================================= */}

                    <div
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        <label
                            style={{
                                display: "block",
                                fontWeight: "600",
                                marginBottom: "8px",
                                color: "#111827"
                            }}
                        >
                            New Password
                        </label>


                        <div
                            style={{
                                position: "relative"
                            }}
                        >

                            <input
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter new password"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "13px 45px 13px 13px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "15px"
                                }}
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(
                                        !showNewPassword
                                    )
                                }
                                disabled={loading}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform:
                                        "translateY(-50%)",
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    fontSize: "18px"
                                }}
                            >
                                {showNewPassword
                                    ? "🙈"
                                    : "👁️"}
                            </button>

                        </div>


                        <small
                            style={{
                                display: "block",
                                marginTop: "6px",
                                color: "#6b7280"
                            }}
                        >
                            Password must contain at least
                            6 characters.
                        </small>

                    </div>


                    {/* =============================================
                        CONFIRM PASSWORD
                    ============================================= */}

                    <div
                        style={{
                            marginBottom: "25px"
                        }}
                    >

                        <label
                            style={{
                                display: "block",
                                fontWeight: "600",
                                marginBottom: "8px",
                                color: "#111827"
                            }}
                        >
                            Confirm New Password
                        </label>


                        <div
                            style={{
                                position: "relative"
                            }}
                        >

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    confirmPassword
                                }
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "13px 45px 13px 13px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "15px"
                                }}
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                disabled={loading}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform:
                                        "translateY(-50%)",
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    fontSize: "18px"
                                }}
                            >
                                {showConfirmPassword
                                    ? "🙈"
                                    : "👁️"}
                            </button>

                        </div>

                    </div>


                    {/* =============================================
                        RESET BUTTON
                    ============================================= */}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            border: "none",
                            borderRadius: "8px",
                            background:
                                loading
                                    ? "#93a8e8"
                                    : "#2563eb",
                            color: "#ffffff",
                            fontWeight: "bold",
                            fontSize: "15px",
                            cursor:
                                loading
                                    ? "not-allowed"
                                    : "pointer"
                        }}
                    >

                        {loading
                            ? "Resetting Password..."
                            : "Reset Password"}

                    </button>

                </form>


                {/* =================================================
                    BACK TO LOGIN
                ================================================= */}

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "20px"
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        disabled={loading}
                        style={{
                            border: "none",
                            background: "transparent",
                            color: "#1e40af",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        ← Back to Login
                    </button>

                </div>

            </div>

        </div>

    );

}


export default ResetPassword;