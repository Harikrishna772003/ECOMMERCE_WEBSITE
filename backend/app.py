from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from database.db import db
from extensions import mail


# ============================================================
# IMPORT MODELS
# ============================================================

from models.user import User
from models.product import Product
from models.cart import Cart
from models.order import Order
from models.order_item import OrderItem
from models.wishlist import Wishlist
from models.review import Review
from models.coupon import Coupon
from models.admin import Admin
from models.notification import Notification


# ============================================================
# IMPORT USER ROUTES
# ============================================================

from routes.auth_routes import auth
from routes.product_routes import product
from routes.cart_routes import cart
from routes.order_routes import order
from routes.wishlist_routes import wishlist
from routes.review_routes import review
from routes.payment_routes import payment
from routes.invoice_routes import invoice
from routes.coupon_routes import coupon
from routes.notification_routes import notification
from routes.profile_routes import profile


# ============================================================
# IMPORT ADMIN ROUTES
# ============================================================

from routes.admin_routes import admin
from routes.admin_product_routes import admin_product
from routes.admin_order_routes import admin_order
from routes.admin_dashboard_routes import admin_dashboard
from routes.admin_coupon_routes import admin_coupon
from routes.admin_review_routes import admin_review
from routes.admin_user_routes import admin_user


# ============================================================
# CREATE FLASK APPLICATION
# ============================================================

app = Flask(__name__)


# ============================================================
# LOAD CONFIGURATION
# ============================================================

app.config.from_object(Config)


# ============================================================
# JWT CONFIGURATION
# ============================================================

# Use the JWT key from Config
app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY

# Keep access token active until logout/token removal
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False


# ============================================================
# INITIALIZE EXTENSIONS
# ============================================================

db.init_app(app)

jwt = JWTManager(app)

mail.init_app(app)


# ============================================================
# ENABLE CORS
# ============================================================

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)


# ============================================================
# REGISTER USER ROUTES
# ============================================================

app.register_blueprint(
    auth,
    url_prefix="/api"
)

app.register_blueprint(
    product,
    url_prefix="/api"
)

app.register_blueprint(
    cart,
    url_prefix="/api"
)

app.register_blueprint(
    order,
    url_prefix="/api"
)

app.register_blueprint(
    wishlist,
    url_prefix="/api"
)

app.register_blueprint(
    review,
    url_prefix="/api"
)

app.register_blueprint(
    payment,
    url_prefix="/api"
)

app.register_blueprint(
    invoice,
    url_prefix="/api"
)

app.register_blueprint(
    coupon,
    url_prefix="/api"
)

app.register_blueprint(
    notification,
    url_prefix="/api"
)


# ============================================================
# PROFILE ROUTES
# ============================================================

app.register_blueprint(
    profile,
    url_prefix="/api"
)


# ============================================================
# REGISTER ADMIN ROUTES
# ============================================================

app.register_blueprint(
    admin,
    url_prefix="/api"
)

app.register_blueprint(
    admin_product,
    url_prefix="/api"
)

app.register_blueprint(
    admin_order,
    url_prefix="/api"
)

app.register_blueprint(
    admin_dashboard,
    url_prefix="/api"
)

app.register_blueprint(
    admin_coupon,
    url_prefix="/api"
)

app.register_blueprint(
    admin_review,
    url_prefix="/api"
)

app.register_blueprint(
    admin_user,
    url_prefix="/api"
)


# ============================================================
# HOME / HEALTH CHECK
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "Welcome to ShopEase Backend 🚀",
        "status": "Running Successfully"
    }), 200


# ============================================================
# API HEALTH CHECK
# ============================================================

@app.route("/api/health", methods=["GET"])
def health_check():

    return jsonify({
        "message": "ShopEase API is working",
        "status": "OK"
    }), 200


# ============================================================
# 404 ERROR HANDLER
# ============================================================

@app.errorhandler(404)
def page_not_found(error):

    return jsonify({
        "message": "API endpoint not found",
        "status": 404
    }), 404


# ============================================================
# 405 ERROR HANDLER
# ============================================================

@app.errorhandler(405)
def method_not_allowed(error):

    return jsonify({
        "message": "HTTP method not allowed",
        "status": 405
    }), 405


# ============================================================
# 500 ERROR HANDLER
# ============================================================

@app.errorhandler(500)
def internal_server_error(error):

    db.session.rollback()

    return jsonify({
        "message": "Internal server error",
        "status": 500
    }), 500


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

with app.app_context():

    db.create_all()


# ============================================================
# RUN APPLICATION
# ============================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )