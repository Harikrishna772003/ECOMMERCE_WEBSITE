from flask import Blueprint, jsonify
from sqlalchemy import func, extract

from database.db import db

from models.order import Order
from models.user import User
from models.product import Product
from models.order_item import OrderItem

admin_dashboard = Blueprint(
    "admin_dashboard",
    __name__
)

# ==========================
# Dashboard Statistics
# ==========================
@admin_dashboard.route("/admin/dashboard/stats", methods=["GET"])
def dashboard_stats():

    total_revenue = db.session.query(
        func.sum(Order.final_amount)
    ).scalar() or 0

    total_orders = Order.query.count()

    total_users = User.query.count()

    total_products = Product.query.count()

    return jsonify({

        "total_revenue": float(total_revenue),

        "total_orders": total_orders,

        "total_users": total_users,

        "total_products": total_products

    }), 200


# ==========================
# Monthly Sales
# ==========================
@admin_dashboard.route("/admin/dashboard/monthly-sales", methods=["GET"])
def monthly_sales():

    data = db.session.query(

        extract("month", Order.order_date).label("month"),

        func.sum(Order.final_amount).label("sales")

    ).group_by(

        extract("month", Order.order_date)

    ).order_by(

        extract("month", Order.order_date)

    ).all()

    months = [

        "Jan", "Feb", "Mar", "Apr", "May", "Jun",

        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"

    ]

    result = []

    for row in data:

        result.append({

            "month": months[int(row.month) - 1],

            "sales": float(row.sales)

        })

    return jsonify(result), 200


# ==========================
# Top Selling Products
# ==========================
@admin_dashboard.route("/admin/dashboard/top-products", methods=["GET"])
def top_products():

    products = db.session.query(

        OrderItem.product_name,

        OrderItem.product_image,

        func.sum(OrderItem.quantity).label("sold")

    ).group_by(

        OrderItem.product_name,

        OrderItem.product_image

    ).order_by(

        func.sum(OrderItem.quantity).desc()

    ).limit(5).all()

    result = []

    for product in products:

        result.append({

            "name": product.product_name,

            "image": product.product_image,

            "sold": int(product.sold)

        })

    return jsonify(result), 200


# ==========================
# Category Wise Sales
# ==========================
@admin_dashboard.route("/admin/dashboard/category-sales", methods=["GET"])
def category_sales():

    data = db.session.query(

        Product.category,

        func.count(Product.id)

    ).group_by(

        Product.category

    ).all()

    result = []

    for row in data:

        result.append({

            "category": row[0],

            "count": row[1]

        })

    return jsonify(result), 200


# ==========================
# Recent Orders
# ==========================
@admin_dashboard.route("/admin/dashboard/recent-orders", methods=["GET"])
def recent_orders():

    orders = Order.query.order_by(

        Order.order_date.desc()

    ).limit(5).all()

    result = []

    for order in orders:

        result.append({

            "id": order.id,

            "user_id": order.user_id,

            "amount": order.final_amount,

            "status": order.status,

            "date": str(order.order_date)

        })

    return jsonify(result), 200


# ==========================
# Low Stock Products
# ==========================
@admin_dashboard.route("/admin/dashboard/low-stock", methods=["GET"])
def low_stock_products():

    products = Product.query.filter(
        Product.stock <= 5
    ).order_by(Product.stock.asc()).all()

    result = []

    for product in products:

        result.append({

            "id": product.id,

            "name": product.name,

            "image": product.image,

            "category": product.category,

            "stock": product.stock

        })

    return jsonify(result), 200