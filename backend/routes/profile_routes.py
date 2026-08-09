from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask_mail import Message
from urllib.parse import quote, unquote

from database.db import db
from models.user import User
from extensions import mail


# ============================================================
# PROFILE BLUEPRINT
# ============================================================

profile = Blueprint("profile", __name__)


# ============================================================
# GET CURRENT USER
# ============================================================

def get_current_user():

    identity = get_jwt_identity()

    if identity is None:
        return None

    # --------------------------------------------------------
    # Try ID first
    # --------------------------------------------------------

    try:

        user_id = int(identity)

        user = User.query.get(user_id)

        if user:
            return user

    except (ValueError, TypeError):
        pass

    # --------------------------------------------------------
    # Try EMAIL
    # This supports JWT tokens created with user.email
    # --------------------------------------------------------

    try:

        email = str(identity).strip().lower()

        user = User.query.filter_by(
            email=email
        ).first()

        if user:
            return user

    except Exception:
        pass

    return None


# ============================================================
# PROFILE RESPONSE
# ============================================================

def user_response(user):

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "is_active": user.is_active,
        "created_at": (
            user.created_at.isoformat()
            if user.created_at
            else None
        )
    }


# ============================================================
# GET PROFILE
# ============================================================

@profile.route(
    "/profile",
    methods=["GET"]
)
@jwt_required()
def get_profile():

    user = get_current_user()

    if not user:

        return jsonify({
            "message": "User not found"
        }), 404

    return jsonify({
        "message": "Profile fetched successfully",
        "user": user_response(user)
    }), 200


# ============================================================
# UPDATE USERNAME
# ============================================================

@profile.route(
    "/profile/update-username",
    methods=["PUT"]
)
@jwt_required()
def update_username():

    user = get_current_user()

    if not user:

        return jsonify({
            "message": "User not found"
        }), 404

    data = request.get_json() or {}

    new_username = data.get("full_name")

    if new_username is None:
        new_username = data.get("username")

    if new_username is None:

        return jsonify({
            "message": "Username is required"
        }), 400

    new_username = str(
        new_username
    ).strip()

    if not new_username:

        return jsonify({
            "message": "Username cannot be empty"
        }), 400

    if len(new_username) < 2:

        return jsonify({
            "message": (
                "Username must contain at least 2 characters"
            )
        }), 400

    if len(new_username) > 100:

        return jsonify({
            "message": (
                "Username cannot exceed 100 characters"
            )
        }), 400

    if new_username == user.full_name:

        return jsonify({
            "message": "Username is already the same"
        }), 400

    try:

        user.full_name = new_username

        db.session.commit()

        return jsonify({
            "message": "Username updated successfully",
            "user": user_response(user)
        }), 200

    except Exception as error:

        db.session.rollback()

        print(
            "USERNAME UPDATE ERROR:",
            error
        )

        return jsonify({
            "message": "Unable to update username"
        }), 500


# ============================================================
# UPDATE PHONE
# ============================================================

@profile.route(
    "/profile/update-phone",
    methods=["PUT"]
)
@jwt_required()
def update_phone():

    user = get_current_user()

    if not user:

        return jsonify({
            "message": "User not found"
        }), 404

    data = request.get_json() or {}

    phone = data.get("phone")

    if phone is None:

        return jsonify({
            "message": "Phone number is required"
        }), 400

    phone = str(phone).strip()

    # --------------------------------------------------------
    # Allow removing phone number
    # --------------------------------------------------------

    if phone == "":

        user.phone = None

    else:

        if not phone.isdigit():

            return jsonify({
                "message": (
                    "Phone number must contain only digits"
                )
            }), 400

        if len(phone) != 10:

            return jsonify({
                "message": (
                    "Phone number must contain exactly 10 digits"
                )
            }), 400

        user.phone = phone

    try:

        db.session.commit()

        return jsonify({
            "message": "Phone number updated successfully",
            "user": user_response(user)
        }), 200

    except Exception as error:

        db.session.rollback()

        print(
            "PHONE UPDATE ERROR:",
            error
        )

        return jsonify({
            "message": "Unable to update phone number"
        }), 500


# ============================================================
# CHANGE PASSWORD
# ============================================================

@profile.route(
    "/profile/change-password",
    methods=["POST"]
)
@jwt_required()
def change_password():

    user = get_current_user()

    if not user:

        return jsonify({
            "message": "User not found"
        }), 404

    data = request.get_json() or {}

    current_password = data.get(
        "current_password"
    )

    new_password = data.get(
        "new_password"
    )

    confirm_password = data.get(
        "confirm_password"
    )

    # --------------------------------------------------------
    # REQUIRED FIELDS
    # --------------------------------------------------------

    if not current_password:

        return jsonify({
            "message": "Current password is required"
        }), 400

    if not new_password:

        return jsonify({
            "message": "New password is required"
        }), 400

    if not confirm_password:

        return jsonify({
            "message": "Confirm password is required"
        }), 400

    # --------------------------------------------------------
    # VERIFY CURRENT PASSWORD
    # --------------------------------------------------------

    if not check_password_hash(
        user.password,
        current_password
    ):

        return jsonify({
            "message": "Current password is incorrect"
        }), 401

    # --------------------------------------------------------
    # PASSWORD LENGTH
    # --------------------------------------------------------

    if len(new_password) < 6:

        return jsonify({
            "message": (
                "New password must contain at least 6 characters"
            )
        }), 400

    # --------------------------------------------------------
    # CONFIRM PASSWORD
    # --------------------------------------------------------

    if new_password != confirm_password:

        return jsonify({
            "message": "New passwords do not match"
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
                "from current password"
            )
        }), 400

    # --------------------------------------------------------
    # UPDATE PASSWORD
    # --------------------------------------------------------

    try:

        user.password = generate_password_hash(
            new_password
        )

        db.session.commit()

        return jsonify({
            "message": "Password changed successfully"
        }), 200

    except Exception as error:

        db.session.rollback()

        print(
            "CHANGE PASSWORD ERROR:",
            error
        )

        return jsonify({
            "message": "Unable to change password"
        }), 500


# ============================================================
# CREATE PASSWORD RESET TOKEN
# ============================================================

def create_reset_token(email):

    serializer = URLSafeTimedSerializer(
        current_app.config["SECRET_KEY"]
    )

    return serializer.dumps(
        email,
        salt="password-reset"
    )


# ============================================================
# VERIFY PASSWORD RESET TOKEN
# ============================================================

def verify_reset_token(token):

    serializer = URLSafeTimedSerializer(
        current_app.config["SECRET_KEY"]
    )

    try:

        return serializer.loads(
            token,
            salt="password-reset",
            max_age=current_app.config.get(
                "PASSWORD_RESET_EXPIRES",
                3600
            )
        )

    except SignatureExpired:

        return None

    except BadSignature:

        return None


# ============================================================
# FORGOT PASSWORD
#
# Supports both:
#
# /api/profile/forgot-password
# /api/forgot-password
#
# This fixes the frontend/backend route mismatch.
# ============================================================

@profile.route(
    "/profile/forgot-password",
    methods=["POST"]
)
@profile.route(
    "/forgot-password",
    methods=["POST"]
)
def forgot_password():

    data = request.get_json() or {}

    email = data.get("email")

    # --------------------------------------------------------
    # REQUIRED EMAIL
    # --------------------------------------------------------

    if not email:

        return jsonify({
            "message": "Email is required"
        }), 400

    email = str(
        email
    ).strip().lower()

    # --------------------------------------------------------
    # FIND USER
    # --------------------------------------------------------

    user = User.query.filter_by(
        email=email
    ).first()

    # --------------------------------------------------------
    # SECURITY RESPONSE
    # Do not reveal whether email exists.
    # --------------------------------------------------------

    if not user:

        return jsonify({
            "message": (
                "If the email is registered, "
                "a recovery link has been sent."
            )
        }), 200

    # --------------------------------------------------------
    # CREATE RESET TOKEN
    # --------------------------------------------------------

    token = create_reset_token(
        user.email
    )

    # --------------------------------------------------------
    # FRONTEND URL
    # --------------------------------------------------------

    frontend_url = current_app.config.get(
        "FRONTEND_URL",
        "http://localhost:5173"
    ).rstrip("/")

    # URL-encode the token so special characters are preserved
    # correctly when the link is opened from Gmail/browser.
    encoded_token = quote(token, safe="")

    reset_url = (
        f"{frontend_url}/reset-password"
        f"?token={encoded_token}"
    )

    # --------------------------------------------------------
    # SEND EMAIL
    # --------------------------------------------------------

    try:

        message = Message(
            subject="ShopEase - Password Recovery",
            sender=current_app.config.get(
                "MAIL_DEFAULT_SENDER"
            ),
            recipients=[
                user.email
            ]
        )

        # ----------------------------------------------------
        # PLAIN TEXT EMAIL
        # ----------------------------------------------------

        message.body = f"""
Hello {user.full_name},

We received a request to reset your ShopEase account password.

Click the link below to create a new password:

{reset_url}

This link will expire in 1 hour.

If you did not request this password reset,
you can safely ignore this email.

Regards,
ShopEase Team
"""

        # ----------------------------------------------------
        # HTML EMAIL
        # ----------------------------------------------------

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
We received a request to reset your ShopEase
account password.
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
padding:13px 25px;
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
            f"PASSWORD RECOVERY EMAIL SENT TO: {user.email}"
        )

    except Exception as error:

        print(
            "PASSWORD RECOVERY EMAIL ERROR:",
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
            "a recovery link has been sent."
        )
    }), 200


# ============================================================
# RESET PASSWORD
#
# Supports both:
#
# /api/profile/reset-password
# /api/reset-password
#
# The frontend can therefore use /api/reset-password.
# ============================================================

@profile.route(
    "/profile/reset-password",
    methods=["POST"]
)
@profile.route(
    "/reset-password",
    methods=["POST"]
)
def reset_password():

    data = request.get_json() or {}

    token = data.get(
        "token"
    )

    # The token may arrive URL-encoded from the frontend.
    # Decode it before verifying the itsdangerous signature.
    if token:
        token = unquote(str(token).strip())

    new_password = data.get(
        "new_password"
    )

    # Support frontend sending "password"
    if new_password is None:

        new_password = data.get(
            "password"
        )

    confirm_password = data.get(
        "confirm_password"
    )

    # --------------------------------------------------------
    # REQUIRED TOKEN
    # --------------------------------------------------------

    if not token:

        return jsonify({
            "message": "Reset token is required"
        }), 400

    # --------------------------------------------------------
    # REQUIRED NEW PASSWORD
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
    # VERIFY TOKEN
    # --------------------------------------------------------

    email = verify_reset_token(
        token
    )

    if not email:

        return jsonify({
            "message": (
                "Reset link is invalid or expired"
            )
        }), 400

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
                "from old password"
            )
        }), 400

    # --------------------------------------------------------
    # UPDATE PASSWORD
    # --------------------------------------------------------

    try:

        user.password = generate_password_hash(
            new_password
        )

        db.session.commit()

        return jsonify({
            "message": (
                "Password reset successfully. "
                "You can now login with your new password."
            )
        }), 200

    except Exception as error:

        db.session.rollback()

        print(
            "PASSWORD RESET ERROR:",
            error
        )

        return jsonify({
            "message": "Unable to reset password"
        }), 500