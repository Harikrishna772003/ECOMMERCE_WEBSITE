from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask_mail import Message
from urllib.parse import quote

from database.db import db
from models.user import User
from extensions import mail


# ============================================================
# AUTH BLUEPRINT
# ============================================================

auth = Blueprint("auth", __name__)


# ============================================================
# PASSWORD RESET TOKEN
# ============================================================

def generate_reset_token(email):
    """
    Create a secure, time-limited password reset token.
    """

    serializer = URLSafeTimedSerializer(
        current_app.config["SECRET_KEY"]
    )

    token = serializer.dumps(
        email,
        salt="password-reset"
    )

    return token


# ============================================================
# VERIFY PASSWORD RESET TOKEN
# ============================================================

def verify_reset_token(token):
    """
    Verify password reset token.

    Returns:
        email -> valid token
        None  -> invalid/expired token
    """

    if not token:
        return None

    serializer = URLSafeTimedSerializer(
        current_app.config["SECRET_KEY"]
    )

    try:

        email = serializer.loads(
            token,
            salt="password-reset",
            max_age=current_app.config.get(
                "PASSWORD_RESET_EXPIRES",
                3600
            )
        )

        return email

    except SignatureExpired:

        print("PASSWORD RESET TOKEN EXPIRED")

        return None

    except BadSignature:

        print("PASSWORD RESET TOKEN INVALID")

        return None

    except Exception as error:

        print(
            "PASSWORD RESET TOKEN ERROR:",
            error
        )

        return None


# ============================================================
# REGISTER
# ============================================================

@auth.route(
    "/register",
    methods=["POST"]
)
def register():

    data = request.get_json() or {}

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")

    # --------------------------------------------------------
    # REQUIRED FIELDS
    # --------------------------------------------------------

    if not full_name or not email or not password:

        return jsonify({
            "message": "All fields are required"
        }), 400

    # --------------------------------------------------------
    # CLEAN DATA
    # --------------------------------------------------------

    full_name = str(full_name).strip()
    email = str(email).strip().lower()

    # --------------------------------------------------------
    # PASSWORD LENGTH
    # --------------------------------------------------------

    if len(password) < 6:

        return jsonify({
            "message": (
                "Password must contain at least 6 characters"
            )
        }), 400

    # --------------------------------------------------------
    # CHECK EMAIL
    # --------------------------------------------------------

    existing_user = User.query.filter_by(
        email=email
    ).first()

    if existing_user:

        return jsonify({
            "message": "Email already exists"
        }), 400

    # --------------------------------------------------------
    # HASH PASSWORD
    # --------------------------------------------------------

    hashed_password = generate_password_hash(
        password
    )

    # --------------------------------------------------------
    # CREATE USER
    # --------------------------------------------------------

    new_user = User(
        full_name=full_name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)

    db.session.commit()

    return jsonify({
        "message": "User Registered Successfully"
    }), 201


# ============================================================
# LOGIN
# ============================================================

@auth.route(
    "/login",
    methods=["POST"]
)
def login():

    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    # --------------------------------------------------------
    # REQUIRED
    # --------------------------------------------------------

    if not email or not password:

        return jsonify({
            "message": (
                "Email and Password are required"
            )
        }), 400

    email = str(email).strip().lower()

    # --------------------------------------------------------
    # FIND USER
    # --------------------------------------------------------

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:

        return jsonify({
            "message": "User not found"
        }), 404

    # --------------------------------------------------------
    # ACTIVE STATUS
    # --------------------------------------------------------

    if not user.is_active:

        return jsonify({
            "message": "Your account is inactive"
        }), 403

    # --------------------------------------------------------
    # VERIFY PASSWORD
    # --------------------------------------------------------

    if not check_password_hash(
        user.password,
        password
    ):

        return jsonify({
            "message": "Invalid Password"
        }), 401

    # --------------------------------------------------------
    # CREATE JWT
    # --------------------------------------------------------

    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({

        "message": "Login Successful",

        "token": access_token,

        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email
        }

    }), 200


# ============================================================
# FORGOT PASSWORD
# ============================================================

@auth.route(
    "/forgot-password",
    methods=["POST"]
)
def forgot_password():

    data = request.get_json() or {}

    email = data.get("email")

    # --------------------------------------------------------
    # REQUIRED
    # --------------------------------------------------------

    if not email:

        return jsonify({
            "message": "Email address is required"
        }), 400

    email = str(email).strip().lower()

    # --------------------------------------------------------
    # FIND USER
    # --------------------------------------------------------

    user = User.query.filter_by(
        email=email
    ).first()

    # --------------------------------------------------------
    # SECURITY
    # --------------------------------------------------------

    if not user:

        return jsonify({
            "message": (
                "If an account exists with this email, "
                "a password recovery link has been sent."
            )
        }), 200

    # --------------------------------------------------------
    # GENERATE RESET TOKEN
    # --------------------------------------------------------

    token = generate_reset_token(
        user.email
    )

    # --------------------------------------------------------
    # ENCODE TOKEN FOR URL
    # --------------------------------------------------------

    encoded_token = quote(
        token,
        safe=""
    )

    # --------------------------------------------------------
    # FRONTEND URL
    # --------------------------------------------------------

    frontend_url = current_app.config.get(
        "FRONTEND_URL",
        "http://localhost:5173"
    ).rstrip("/")

    reset_url = (
        f"{frontend_url}/reset-password"
        f"?token={encoded_token}"
    )

    print(
        "PASSWORD RESET URL:",
        reset_url
    )

    # --------------------------------------------------------
    # SEND EMAIL
    # --------------------------------------------------------

    try:

        message = Message(

            subject="ShopEase - Password Recovery",

            sender=current_app.config[
                "MAIL_DEFAULT_SENDER"
            ],

            recipients=[
                user.email
            ]

        )

        # ====================================================
        # PLAIN TEXT EMAIL
        # ====================================================

        message.body = f"""

Hello {user.full_name},

We received a request to reset your ShopEase account password.

Click the link below to create a new password:

{reset_url}

This password recovery link will expire in 1 hour.

If you did not request a password reset,
you can safely ignore this email.

Regards,
ShopEase Team

"""

        # ====================================================
        # HTML EMAIL
        # ====================================================

        message.html = f"""
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
ShopEase Password Recovery
</title>

</head>


<body
style="
font-family:Arial,sans-serif;
background:#f4f7fb;
padding:40px;
"
>


<div
style="
max-width:600px;
margin:auto;
background:white;
padding:35px;
border-radius:12px;
box-shadow:0 10px 30px rgba(0,0,0,.08);
"
>


<h2
style="
color:#2563eb;
margin-bottom:10px;
"
>
ShopEase
</h2>


<h3>
Password Recovery
</h3>


<p>
Hello <strong>{user.full_name}</strong>,
</p>


<p>
We received a request to reset your
ShopEase account password.
</p>


<p>
Click the button below to create a new password.
</p>


<div
style="
text-align:center;
margin:30px 0;
"
>


<a
href="{reset_url}"
style="
display:inline-block;
background:#2563eb;
color:white;
padding:14px 28px;
text-decoration:none;
border-radius:8px;
font-weight:bold;
"
>

Reset Password

</a>


</div>


<p>
This recovery link will expire in
<strong>1 hour</strong>.
</p>


<p>
If you did not request this password reset,
you can safely ignore this email.
</p>


<hr>


<p
style="
font-size:12px;
color:#777;
"
>

ShopEase · Secure & Easy Shopping

</p>


</div>


</body>

</html>
"""

        mail.send(message)

        print(
            "PASSWORD RESET EMAIL SENT:",
            user.email
        )

    except Exception as error:

        print(
            "PASSWORD RESET EMAIL ERROR:",
            error
        )

        return jsonify({
            "message": (
                "Unable to send recovery email. "
                "Please check your mail configuration."
            )
        }), 500

    return jsonify({
        "message": (
            "If the email is registered, "
            "a password recovery link has been sent."
        )
    }), 200


# ============================================================
# RESET PASSWORD
# ============================================================

@auth.route(
    "/reset-password",
    methods=["POST"]
)
def reset_password():

    data = request.get_json() or {}

    # --------------------------------------------------------
    # TOKEN
    # --------------------------------------------------------

    token = data.get("token")

    # --------------------------------------------------------
    # ACCEPT BOTH PASSWORD NAMES
    # --------------------------------------------------------

    new_password = (
        data.get("password")
        or data.get("new_password")
    )

    confirm_password = (
        data.get("confirm_password")
        or data.get("confirmPassword")
    )

    # --------------------------------------------------------
    # REQUIRED TOKEN
    # --------------------------------------------------------

    if not token:

        return jsonify({
            "message": "Reset token is required"
        }), 400

    # --------------------------------------------------------
    # REQUIRED PASSWORD
    # --------------------------------------------------------

    if not new_password:

        return jsonify({
            "message": "New password is required"
        }), 400

    # --------------------------------------------------------
    # CONFIRM PASSWORD
    # --------------------------------------------------------

    if not confirm_password:

        return jsonify({
            "message": "Confirm password is required"
        }), 400

    # --------------------------------------------------------
    # CLEAN TOKEN
    # --------------------------------------------------------

    token = str(token).strip()

    # --------------------------------------------------------
    # VERIFY TOKEN
    # --------------------------------------------------------

    email = verify_reset_token(
        token
    )

    if not email:

        return jsonify({
            "message": (
                "Reset link is invalid or expired. "
                "Please request a new recovery link."
            )
        }), 400

    email = str(email).strip().lower()

    print(
        "PASSWORD RESET REQUEST FOR:",
        email
    )

    # --------------------------------------------------------
    # FIND USER
    # --------------------------------------------------------

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:

        return jsonify({
            "message": "User account not found"
        }), 404

    # --------------------------------------------------------
    # PASSWORD LENGTH
    # --------------------------------------------------------

    if len(new_password) < 6:

        return jsonify({
            "message": (
                "Password must contain at least 6 characters"
            )
        }), 400

    # --------------------------------------------------------
    # CONFIRM PASSWORD
    # --------------------------------------------------------

    if new_password != confirm_password:

        return jsonify({
            "message": "Passwords do not match"
        }), 400

    # --------------------------------------------------------
    # SAME PASSWORD CHECK
    # --------------------------------------------------------

    if check_password_hash(
        user.password,
        new_password
    ):

        return jsonify({
            "message": (
                "New password must be different "
                "from your old password"
            )
        }), 400

    # --------------------------------------------------------
    # HASH PASSWORD
    # --------------------------------------------------------

    user.password = generate_password_hash(
        new_password
    )

    # --------------------------------------------------------
    # SAVE
    # --------------------------------------------------------

    db.session.commit()

    print(
        "PASSWORD RESET SUCCESSFUL:",
        email
    )

    return jsonify({
        "message": (
            "Password reset successfully. "
            "You can now login with your new password."
        )
    }), 200