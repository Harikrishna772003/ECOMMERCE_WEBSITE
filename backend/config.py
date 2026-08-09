import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

# Load environment variables from backend/.env
load_dotenv()


class Config:

    # ============================================================
    # DATABASE
    # ============================================================

    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_NAME = os.getenv("DB_NAME", "ecommerce_db")

    if not DB_USER:
        raise ValueError("DB_USER is missing from backend/.env")

    if not DB_PASSWORD:
        raise ValueError("DB_PASSWORD is missing from backend/.env")

    # Encode password so special characters such as @ are handled safely
    ENCODED_DB_PASSWORD = quote_plus(DB_PASSWORD)

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://"
        f"{DB_USER}:{ENCODED_DB_PASSWORD}"
        f"@{DB_HOST}/{DB_NAME}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False


    # ============================================================
    # FLASK SECRET KEY
    # ============================================================

    SECRET_KEY = os.getenv("SECRET_KEY")

    if not SECRET_KEY:
        raise ValueError("SECRET_KEY is missing from backend/.env")


    # ============================================================
    # JWT SECRET KEY
    # ============================================================

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    if not JWT_SECRET_KEY:
        raise ValueError("JWT_SECRET_KEY is missing from backend/.env")

    JWT_ACCESS_TOKEN_EXPIRES = False


    # ============================================================
    # RAZORPAY
    # ============================================================

    RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")

    RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

    if not RAZORPAY_KEY_ID:
        raise ValueError("RAZORPAY_KEY_ID is missing from backend/.env")

    if not RAZORPAY_KEY_SECRET:
        raise ValueError("RAZORPAY_KEY_SECRET is missing from backend/.env")


    # ============================================================
    # GMAIL SMTP
    # ============================================================

    MAIL_SERVER = "smtp.gmail.com"

    MAIL_PORT = 587

    MAIL_USE_TLS = True

    MAIL_USE_SSL = False

    MAIL_USERNAME = os.getenv("MAIL_USERNAME")

    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    MAIL_DEFAULT_SENDER = os.getenv(
        "MAIL_DEFAULT_SENDER",
        MAIL_USERNAME
    )

    if not MAIL_USERNAME:
        raise ValueError("MAIL_USERNAME is missing from backend/.env")

    if not MAIL_PASSWORD:
        raise ValueError("MAIL_PASSWORD is missing from backend/.env")


    # ============================================================
    # PASSWORD RECOVERY
    # ============================================================

    PASSWORD_RESET_EXPIRES = int(
        os.getenv("PASSWORD_RESET_EXPIRES", "3600")
    )


    # ============================================================
    # FRONTEND
    # ============================================================

    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )