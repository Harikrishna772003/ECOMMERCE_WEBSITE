from flask import Blueprint, jsonify
from database.db import db
from models.user import User

admin_user = Blueprint("admin_user", __name__)


# ==========================
# Get All Users
# ==========================
@admin_user.route("/admin/users", methods=["GET"])
def get_users():

    users = User.query.order_by(User.id.desc()).all()

    result = []

    for user in users:

        result.append({

            "id": user.id,

            "full_name": user.full_name,

            "email": user.email,

            "phone": user.phone if user.phone else "-",

            "is_active": user.is_active,

            "created_at": str(user.created_at)

        })

    return jsonify(result), 200


# ==========================
# Block / Unblock User
# ==========================
@admin_user.route("/admin/users/toggle/<int:user_id>", methods=["PUT"])
def toggle_user(user_id):

    user = db.session.get(User, user_id)

    if not user:

        return jsonify({
            "message": "User Not Found"
        }), 404

    user.is_active = not user.is_active

    db.session.commit()

    return jsonify({

        "message": "User Status Updated",

        "is_active": user.is_active

    }), 200


# ==========================
# Delete User
# ==========================
@admin_user.route("/admin/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):

    user = db.session.get(User, user_id)

    if not user:

        return jsonify({
            "message": "User Not Found"
        }), 404

    db.session.delete(user)

    db.session.commit()

    return jsonify({
        "message": "User Deleted Successfully"
    }), 200