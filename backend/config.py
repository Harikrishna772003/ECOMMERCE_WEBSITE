import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    # ============================================================
    # DATABASE
    # ============================================================

    SQLALCHEMY_DATABASE_URI = (
        "mysql+pymysql://root:Admin%4012345@localhost/ecommerce_db"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False


    # ============================================================
    # FLASK SECRET KEY
    # ============================================================

    SECRET_KEY = "shopease_secret_key"


    # ============================================================
    # JWT SECRET KEY
    # ============================================================

    JWT_SECRET_KEY = "shopease_secret_key"

    JWT_ACCESS_TOKEN_EXPIRES = False


    # ============================================================
    # RAZORPAY
    # ============================================================

    RAZORPAY_KEY_ID = "rzp_test_TLohgMMcMxd0FZ"

    RAZORPAY_KEY_SECRET = "zPcpbMtVkXRWzfb8t6qSufAk"


    # ============================================================
    # GMAIL SMTP
    # ============================================================

    MAIL_SERVER = "smtp.gmail.com"

    MAIL_PORT = 587

    MAIL_USE_TLS = True

    MAIL_USE_SSL = False

    MAIL_USERNAME = "kittuyadav73375@gmail.com"

    MAIL_PASSWORD = "alul zrtr rdwm pzqm"

    MAIL_DEFAULT_SENDER = "kittuyadav73375@gmail.com"


    # ============================================================
    # PASSWORD RECOVERY
    # ============================================================

    PASSWORD_RESET_EXPIRES = 3600

    FRONTEND_URL = "http://localhost:5173"