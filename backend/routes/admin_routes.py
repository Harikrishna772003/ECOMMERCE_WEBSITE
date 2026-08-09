from flask import Blueprint, request, jsonify
from models.admin import Admin
from models.user import User
from models.product import Product
from models.order import Order
from database.db import db
from sqlalchemy import func

admin = Blueprint("admin", __name__)


# ==========================
# Admin Login
# ==========================
@admin.route("/admin/login", methods=["POST"])
def admin_login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({
            "message": "All Fields are Required"
        }), 400

    admin_user = Admin.query.filter_by(
        username=username,
        password=password
    ).first()

    if not admin_user:
        return jsonify({
            "message": "Invalid Username or Password"
        }), 401

    return jsonify({
        "message": "Login Successful",
        "admin": {
            "id": admin_user.id,
            "username": admin_user.username
        }
    }), 200


# ==========================
# Dashboard Statistics
# ==========================
@admin.route("/admin/dashboard", methods=["GET"])
def dashboard():

    total_users = User.query.count()

    total_products = Product.query.count()

    total_orders = Order.query.count()

    total_revenue = db.session.query(
        func.sum(Order.total_amount)
    ).scalar() or 0

    return jsonify({
        "users": total_users,
        "products": total_products,
        "orders": total_orders,
        "revenue": total_revenue
    })