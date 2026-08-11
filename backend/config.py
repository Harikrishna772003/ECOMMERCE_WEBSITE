import os
import socket
from urllib.parse import quote_plus
from dotenv import load_dotenv

# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


class Config:

    # ========================================================
    # DATABASE - AIVEN MYSQL
    # ========================================================

    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "ecommerce_db")
    DB_SSL_CA = os.getenv("DB_SSL_CA")

    if not DB_USER:
        raise ValueError(
            "DB_USER is missing from environment variables"
        )

    if not DB_PASSWORD:
        raise ValueError(
            "DB_PASSWORD is missing from environment variables"
        )

    if not DB_HOST:
        raise ValueError(
            "DB_HOST is missing from environment variables"
        )

    if not DB_SSL_CA:
        raise ValueError(
            "DB_SSL_CA is missing from environment variables"
        )

    # ========================================================
    # DATABASE NETWORK DIAGNOSTIC
    # ========================================================

    try:
        DB_PORT_INT = int(DB_PORT)

        print(
            f"[DB DEBUG] Testing connection to "
            f"{DB_HOST}:{DB_PORT_INT}"
        )

        with socket.create_connection(
            (DB_HOST, DB_PORT_INT),
            timeout=10
        ):
            print(
                "[DB DEBUG] TCP connection to Aiven MySQL: SUCCESS"
            )

    except Exception as e:
        print(
            f"[DB DEBUG] TCP connection to Aiven MySQL: FAILED - {e}"
        )

    # ========================================================
    # SSL CERTIFICATE
    # ========================================================

    # Render runs Linux, so DB_SSL_CA must NOT be a Windows path.
    #
    # Example:
    # DB_SSL_CA=ca.pem
    #
    # The ca.pem file must exist inside the deployed project.

    if not os.path.isabs(DB_SSL_CA):
        DB_SSL_CA = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            DB_SSL_CA
        )

    DB_SSL_CA = os.path.abspath(DB_SSL_CA)

    print(f"[DB DEBUG] CA certificate path: {DB_SSL_CA}")
    print(
        f"[DB DEBUG] CA certificate exists: "
        f"{os.path.isfile(DB_SSL_CA)}"
    )

    if not os.path.isfile(DB_SSL_CA):
        raise ValueError(
            f"CA certificate not found: {DB_SSL_CA}"
        )

    # ========================================================
    # DATABASE PASSWORD
    # ========================================================

    ENCODED_DB_PASSWORD = quote_plus(DB_PASSWORD)

    # ========================================================
    # SQLALCHEMY DATABASE URI
    # ========================================================

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://"
        f"{DB_USER}:{ENCODED_DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    # ========================================================
    # SQLALCHEMY SSL CONFIGURATION
    # ========================================================

    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {
            "ssl": {
                "ca": DB_SSL_CA
            },
            "connect_timeout": 15
        },
        "pool_pre_ping": True,
        "pool_recycle": 280,
    }

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ========================================================
    # FLASK SECRET KEY
    # ========================================================

    SECRET_KEY = os.getenv("SECRET_KEY")

    if not SECRET_KEY:
        raise ValueError(
            "SECRET_KEY is missing from environment variables"
        )

    # ========================================================
    # JWT SECRET KEY
    # ========================================================

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    if not JWT_SECRET_KEY:
        raise ValueError(
            "JWT_SECRET_KEY is missing from environment variables"
        )

    JWT_ACCESS_TOKEN_EXPIRES = False

    # ========================================================
    # RAZORPAY
    # ========================================================

    RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
    RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

    if not RAZORPAY_KEY_ID:
        raise ValueError(
            "RAZORPAY_KEY_ID is missing from environment variables"
        )

    if not RAZORPAY_KEY_SECRET:
        raise ValueError(
            "RAZORPAY_KEY_SECRET is missing from environment variables"
        )

    # ========================================================
    # GMAIL SMTP
    # ========================================================

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
        raise ValueError(
            "MAIL_USERNAME is missing from environment variables"
        )

    if not MAIL_PASSWORD:
        raise ValueError(
            "MAIL_PASSWORD is missing from environment variables"
        )

    # ========================================================
    # PASSWORD RECOVERY
    # ========================================================

    PASSWORD_RESET_EXPIRES = int(
        os.getenv(
            "PASSWORD_RESET_EXPIRES",
            "3600"
        )
    )

    # ========================================================
    # FRONTEND
    # ========================================================

    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )