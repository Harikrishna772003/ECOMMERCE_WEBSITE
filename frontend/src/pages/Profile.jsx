import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/Profile.css";


function Profile() {

    const navigate = useNavigate();

    // =====================================================
    // LOGGED-IN USER
    // =====================================================

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const token = localStorage.getItem("token");

    // =====================================================
    // ACTIVE SECTION
    // =====================================================

    const [activeSection, setActiveSection] =
        useState("profile");

    // =====================================================
    // USER INFORMATION
    // =====================================================

    const [username, setUsername] = useState(
        storedUser?.full_name ||
        storedUser?.name ||
        storedUser?.username ||
        "User"
    );

    const email =
        storedUser?.email ||
        "";

    // =====================================================
    // USERNAME EDIT
    // =====================================================

    const [showUsernameEdit, setShowUsernameEdit] =
        useState(false);

    const [newUsername, setNewUsername] =
        useState(username);

    const [usernameLoading, setUsernameLoading] =
        useState(false);

    // =====================================================
    // PASSWORD
    // =====================================================

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    });

    const [passwordLoading, setPasswordLoading] =
        useState(false);

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

    const [recoveryEmail, setRecoveryEmail] =
        useState(email);

    const [recoveryLoading, setRecoveryLoading] =
        useState(false);

    // =====================================================
    // PASSWORD INPUT
    // =====================================================

    const handlePasswordChange = (e) => {

        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });

    };

    // =====================================================
    // UPDATE USERNAME
    // =====================================================

    const saveUsername = async () => {

        const trimmedUsername =
            newUsername.trim();

        if (!trimmedUsername) {

            alert("Username cannot be empty.");

            return;
        }

        if (trimmedUsername.length < 2) {

            alert(
                "Username must contain at least 2 characters."
            );

            return;
        }

        if (trimmedUsername.length > 100) {

            alert(
                "Username cannot exceed 100 characters."
            );

            return;
        }

        if (!token) {

            alert(
                "Your session has expired. Please login again."
            );

            navigate("/login");

            return;
        }

        try {

            setUsernameLoading(true);

            const response = await API.put(
                "/api/profile/update-username",
                {
                    full_name: trimmedUsername
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setUsername(
                trimmedUsername
            );

            setNewUsername(
                trimmedUsername
            );

            const updatedUser = {
                ...storedUser,
                full_name: trimmedUsername
            };

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            setShowUsernameEdit(false);

            alert(
                response.data.message ||
                "Username updated successfully."
            );

        }
        catch (error) {

            console.error(
                "Username Update Error:",
                error
            );

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Unable to update username."
                );

                if (
                    error.response.status === 401
                ) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");
                }

            }
            else {

                alert(
                    "Unable to connect to the server."
                );
            }

        }
        finally {

            setUsernameLoading(false);

        }
    };

    // =====================================================
    // CANCEL USERNAME
    // =====================================================

    const cancelUsernameEdit = () => {

        setNewUsername(username);

        setShowUsernameEdit(false);

    };

    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const changePassword = async () => {

        const currentPassword =
            passwordData.current_password.trim();

        const newPassword =
            passwordData.new_password;

        const confirmPassword =
            passwordData.confirm_password;

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            alert(
                "Please fill all password fields."
            );

            return;
        }

        if (newPassword.length < 6) {

            alert(
                "New password must contain at least 6 characters."
            );

            return;
        }

        if (newPassword !== confirmPassword) {

            alert(
                "New passwords do not match."
            );

            return;
        }

        if (currentPassword === newPassword) {

            alert(
                "New password must be different from current password."
            );

            return;
        }

        if (!token) {

            alert(
                "Your session has expired. Please login again."
            );

            navigate("/login");

            return;
        }

        try {

            setPasswordLoading(true);

            const response = await API.post(
                "/api/profile/change-password",
                {
                    current_password:
                        currentPassword,

                    new_password:
                        newPassword,

                    confirm_password:
                        confirmPassword
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setPasswordData({
                current_password: "",
                new_password: "",
                confirm_password: ""
            });

            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);

            alert(
                response.data.message ||
                "Password changed successfully."
            );

            setActiveSection("profile");

        }
        catch (error) {

            console.error(
                "Change Password Error:",
                error
            );

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Unable to change password."
                );

                if (
                    error.response.status === 401 &&
                    error.response.data.message !==
                    "Current password is incorrect"
                ) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");
                }

            }
            else {

                alert(
                    "Unable to connect to the server."
                );
            }

        }
        finally {

            setPasswordLoading(false);

        }
    };

    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

    const sendRecoveryLink = async () => {

        const cleanEmail =
            recoveryEmail.trim().toLowerCase();

        if (!cleanEmail) {

            alert(
                "Please enter your email address."
            );

            return;
        }

        if (
            !cleanEmail.includes("@") ||
            !cleanEmail.includes(".")
        ) {

            alert(
                "Please enter a valid email address."
            );

            return;
        }

        try {

            setRecoveryLoading(true);

            const response = await API.post(
                "/api/forgot-password",
                {
                    email: cleanEmail
                }
            );

            alert(
                response.data.message ||
                "Recovery link sent successfully."
            );

        }
        catch (error) {

            console.error(
                "Password Recovery Error:",
                error
            );

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Unable to send recovery link."
                );

            }
            else {

                alert(
                    "Unable to connect to the server."
                );
            }

        }
        finally {

            setRecoveryLoading(false);

        }
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        const confirmLogout =
            window.confirm(
                "Are you sure you want to logout?"
            );

        if (!confirmLogout) {
            return;
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    // =====================================================
    // MENU
    // =====================================================

    const menuItems = [

        {
            id: "profile",
            icon: "👤",
            title: "Profile Information",
            description:
                "Manage your personal information"
        },

        {
            id: "settings",
            icon: "⚙️",
            title: "Settings",
            description:
                "Manage your account settings"
        },

        {
            id: "password",
            icon: "🔑",
            title: "Change Password",
            description:
                "Change your current password"
        },

        {
            id: "forgot",
            icon: "📧",
            title: "Forgot Password",
            description:
                "Recover access to your account"
        }

    ];

    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div className="profile-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="profile-header">

                <div>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your ShopEase account
                    </p>

                </div>

                <button
                    className="profile-home-btn"
                    onClick={() => navigate("/")}
                >
                    🏠 Back to Home
                </button>

            </div>


            {/* =================================================
                PROFILE LAYOUT
            ================================================= */}

            <div className="profile-layout">

                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="profile-sidebar">

                    <div className="profile-user-card">

                        <div className="profile-avatar">

                            {username
                                ? username
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"
                            }

                        </div>

                        <h2>
                            {username}
                        </h2>

                        <p>
                            {email}
                        </p>

                    </div>


                    <div className="profile-menu">

                        {menuItems.map(
                            (item) => (

                                <button
                                    key={item.id}
                                    className={
                                        activeSection === item.id
                                            ? "profile-menu-item active"
                                            : "profile-menu-item"
                                    }
                                    onClick={() =>
                                        setActiveSection(
                                            item.id
                                        )
                                    }
                                >

                                    <span className="profile-menu-icon">
                                        {item.icon}
                                    </span>

                                    <span className="profile-menu-text">

                                        <strong>
                                            {item.title}
                                        </strong>

                                        <small>
                                            {item.description}
                                        </small>

                                    </span>

                                    <span className="profile-menu-arrow">
                                        ›
                                    </span>

                                </button>

                            )
                        )}

                    </div>


                    <button
                        className="profile-logout-btn"
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>

                </aside>


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <main className="profile-content">

                    {/* =================================================
                        PROFILE INFORMATION
                    ================================================= */}

                    {activeSection === "profile" && (

                        <section className="profile-section">

                            <div className="section-title">

                                <div>

                                    <h2>
                                        Profile Information
                                    </h2>

                                    <p>
                                        View and manage your account information.
                                    </p>

                                </div>

                            </div>


                            <div className="profile-info-grid">

                                {/* USERNAME */}

                                <div className="profile-info-card">

                                    <div className="info-card-icon">
                                        👤
                                    </div>

                                    <div className="info-card-content">

                                        <span>
                                            Username
                                        </span>

                                        {!showUsernameEdit ? (

                                            <div className="info-value-row">

                                                <strong>
                                                    {username}
                                                </strong>

                                                <button
                                                    className="edit-btn"
                                                    onClick={() => {

                                                        setNewUsername(
                                                            username
                                                        );

                                                        setShowUsernameEdit(
                                                            true
                                                        );

                                                    }}
                                                >
                                                    ✏️ Edit
                                                </button>

                                            </div>

                                        ) : (

                                            <div className="username-edit">

                                                <input
                                                    type="text"
                                                    value={newUsername}
                                                    maxLength={100}
                                                    onChange={(e) =>
                                                        setNewUsername(
                                                            e.target.value
                                                        )
                                                    }
                                                    autoFocus
                                                />

                                                <div>

                                                    <button
                                                        className="save-btn"
                                                        onClick={
                                                            saveUsername
                                                        }
                                                        disabled={
                                                            usernameLoading
                                                        }
                                                    >
                                                        {usernameLoading
                                                            ? "Saving..."
                                                            : "Save"
                                                        }
                                                    </button>

                                                    <button
                                                        className="cancel-btn"
                                                        onClick={
                                                            cancelUsernameEdit
                                                        }
                                                        disabled={
                                                            usernameLoading
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                </div>


                                {/* EMAIL */}

                                <div className="profile-info-card">

                                    <div className="info-card-icon">
                                        ✉️
                                    </div>

                                    <div className="info-card-content">

                                        <span>
                                            Email Address
                                        </span>

                                        <strong>
                                            {email}
                                        </strong>

                                    </div>

                                </div>


                                {/* STATUS */}

                                <div className="profile-info-card">

                                    <div className="info-card-icon">
                                        🛡️
                                    </div>

                                    <div className="info-card-content">

                                        <span>
                                            Account Status
                                        </span>

                                        <strong className="account-active">
                                            ● Active
                                        </strong>

                                    </div>

                                </div>


                                {/* SECURITY */}

                                <div className="profile-info-card">

                                    <div className="info-card-icon">
                                        🔐
                                    </div>

                                    <div className="info-card-content">

                                        <span>
                                            Security
                                        </span>

                                        <strong>
                                            Password Protected
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            <div className="profile-quick-actions">

                                <h3>
                                    Quick Actions
                                </h3>

                                <div className="quick-action-grid">

                                    <button
                                        onClick={() =>
                                            navigate("/wishlist")
                                        }
                                    >
                                        ❤️
                                        <span>
                                            My Wishlist
                                        </span>
                                    </button>

                                    <button
                                        onClick={() =>
                                            navigate("/products")
                                        }
                                    >
                                        🛍️
                                        <span>
                                            Continue Shopping
                                        </span>
                                    </button>

                                    <button
                                        onClick={() =>
                                            setActiveSection(
                                                "settings"
                                            )
                                        }
                                    >
                                        ⚙️
                                        <span>
                                            Settings
                                        </span>
                                    </button>

                                </div>

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        SETTINGS
                    ================================================= */}

                    {activeSection === "settings" && (

                        <section className="profile-section">

                            <div className="section-title">

                                <h2>
                                    ⚙️ Settings
                                </h2>

                                <p>
                                    Manage your account preferences.
                                </p>

                            </div>


                            <div className="settings-card">

                                <div className="settings-row">

                                    <div>

                                        <h3>
                                            Account Settings
                                        </h3>

                                        <p>
                                            Manage your username and
                                            account information.
                                        </p>

                                    </div>

                                    <button
                                        onClick={() =>
                                            setActiveSection(
                                                "profile"
                                            )
                                        }
                                    >
                                        Manage
                                    </button>

                                </div>


                                <div className="settings-row">

                                    <div>

                                        <h3>
                                            Password & Security
                                        </h3>

                                        <p>
                                            Keep your account secure by
                                            managing your password.
                                        </p>

                                    </div>

                                    <button
                                        onClick={() =>
                                            setActiveSection(
                                                "password"
                                            )
                                        }
                                    >
                                        Manage
                                    </button>

                                </div>


                                <div className="settings-row">

                                    <div>

                                        <h3>
                                            Forgot Password
                                        </h3>

                                        <p>
                                            Recover access to your account
                                            if you forget your password.
                                        </p>

                                    </div>

                                    <button
                                        onClick={() =>
                                            setActiveSection(
                                                "forgot"
                                            )
                                        }
                                    >
                                        Recover
                                    </button>

                                </div>

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        CHANGE PASSWORD
                    ================================================= */}

                    {activeSection === "password" && (

                        <section className="profile-section">

                            <div className="section-title">

                                <h2>
                                    🔑 Change Password
                                </h2>

                                <p>
                                    Update your account password securely.
                                </p>

                            </div>


                            <div className="password-card">

                                <div className="password-card-header">

                                    <div className="security-icon">
                                        🔐
                                    </div>

                                    <div>

                                        <h3>
                                            Change Your Password
                                        </h3>

                                        <p>
                                            Enter your current password
                                            and choose a new password.
                                        </p>

                                    </div>

                                </div>


                                {/* CURRENT PASSWORD */}

                                <div className="password-input-group">

                                    <label>
                                        Current Password
                                    </label>

                                    <div className="password-input-wrapper">

                                        <input
                                            type={
                                                showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="current_password"
                                            placeholder="Enter current password"
                                            value={
                                                passwordData.current_password
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    !showCurrentPassword
                                                )
                                            }
                                        >
                                            {showCurrentPassword
                                                ? "🙈"
                                                : "👁️"
                                            }
                                        </button>

                                    </div>

                                </div>


                                {/* NEW PASSWORD */}

                                <div className="password-input-group">

                                    <label>
                                        New Password
                                    </label>

                                    <div className="password-input-wrapper">

                                        <input
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="new_password"
                                            placeholder="Enter new password"
                                            value={
                                                passwordData.new_password
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword
                                                )
                                            }
                                        >
                                            {showNewPassword
                                                ? "🙈"
                                                : "👁️"
                                            }
                                        </button>

                                    </div>

                                    <small>
                                        Use at least 6 characters.
                                    </small>

                                </div>


                                {/* CONFIRM PASSWORD */}

                                <div className="password-input-group">

                                    <label>
                                        Confirm New Password
                                    </label>

                                    <div className="password-input-wrapper">

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirm_password"
                                            placeholder="Confirm new password"
                                            value={
                                                passwordData.confirm_password
                                            }
                                            onChange={
                                                handlePasswordChange
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword
                                                ? "🙈"
                                                : "👁️"
                                            }
                                        </button>

                                    </div>

                                </div>


                                <div className="password-actions">

                                    <button
                                        className="change-password-btn"
                                        onClick={
                                            changePassword
                                        }
                                        disabled={
                                            passwordLoading
                                        }
                                    >
                                        {passwordLoading
                                            ? "Changing Password..."
                                            : "🔐 Change Password"
                                        }
                                    </button>

                                    <button
                                        className="password-cancel-btn"
                                        onClick={() => {

                                            setPasswordData({
                                                current_password: "",
                                                new_password: "",
                                                confirm_password: ""
                                            });

                                            setActiveSection(
                                                "profile"
                                            );

                                        }}
                                        disabled={
                                            passwordLoading
                                        }
                                    >
                                        Cancel
                                    </button>

                                </div>


                                <div className="password-forgot">

                                    <span>
                                        Forgot your password?
                                    </span>

                                    <button
                                        onClick={() =>
                                            setActiveSection(
                                                "forgot"
                                            )
                                        }
                                    >
                                        Recover Account
                                    </button>

                                </div>

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        FORGOT PASSWORD
                    ================================================= */}

                    {activeSection === "forgot" && (

                        <section className="profile-section">

                            <div className="section-title">

                                <h2>
                                    📧 Forgot Password
                                </h2>

                                <p>
                                    Recover access to your ShopEase account.
                                </p>

                            </div>


                            <div className="security-placeholder">

                                <div className="security-icon">
                                    📩
                                </div>

                                <h3>
                                    Password Recovery
                                </h3>

                                <p>
                                    Enter your registered email address.
                                    We will send you a secure password
                                    recovery link.
                                </p>


                                <div className="recovery-form">

                                    <input
                                        type="email"
                                        placeholder="Enter registered email"
                                        value={recoveryEmail}
                                        onChange={(e) =>
                                            setRecoveryEmail(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={sendRecoveryLink}
                                        disabled={recoveryLoading}
                                    >
                                        {recoveryLoading
                                            ? "Sending..."
                                            : "📧 Send Recovery Link"
                                        }
                                    </button>

                                </div>

                                <p
                                    style={{
                                        marginTop: "15px",
                                        fontSize: "12px",
                                        color: "#6b7280"
                                    }}
                                >
                                    The recovery link will expire
                                    after 1 hour.
                                </p>

                            </div>

                        </section>

                    )}

                </main>

            </div>

        </div>
    );
}

export default Profile;