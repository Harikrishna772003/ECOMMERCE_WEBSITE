import csv
import json
import random
import re
import sys

from app import app
from database.db import db
from models.product import Product
from models.review import Review
from models.user import User


# ============================================================
# SHOP EASE
# AMAZON PRODUCTS IMPORTER
# ============================================================
#
# CSV FILE:
#     amazon-products.csv
#
# PLACE THIS FILE IN:
#     backend/amazon-products.csv
#
# IMPORTANT:
#     This script DOES NOT delete existing products.
#
#     Existing products are preserved.
#
#     Only new products are inserted.
#
# ============================================================


CSV_FILE = "amazon-products.csv"

# Existing ShopEase users used for generated sample reviews
USER_IDS = [1, 2, 3, 4]

# Stable random generator
random_generator = random.Random(2026)


# ============================================================
# FIX LARGE CSV FIELD ERROR
# ============================================================

try:
    csv.field_size_limit(sys.maxsize)
except OverflowError:
    csv.field_size_limit(10**9)


# ============================================================
# HELPERS
# ============================================================

def clean_text(value):
    """
    Convert a value into a clean string.
    """

    if value is None:
        return ""

    value = str(value).strip()

    if value.lower() in (
        "",
        "nan",
        "none",
        "null",
        "n/a",
        "na"
    ):
        return ""

    return value


# ============================================================
# PRICE
# ============================================================

def parse_price(value):
    """
    Convert different price formats into float.

    Examples:
        ₹3,995.00
        $39.99
        3995
        3995.0
        3,995
    """

    value = clean_text(value)

    if not value:
        return 0.0

    # Remove commas
    value = value.replace(",", "")

    # Keep digits and decimal point
    value = re.sub(r"[^0-9.]", "", value)

    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0


# ============================================================
# IMAGE URL
# ============================================================

def first_image_url(value):
    """
    Extract the first valid image URL.

    Handles:
        normal URL
        comma-separated URLs
        JSON-style image lists
    """

    value = clean_text(value)

    if not value:
        return ""

    urls = []

    # --------------------------------------------------------
    # Try JSON first
    # --------------------------------------------------------

    if value.startswith("["):

        try:
            data = json.loads(value)

            if isinstance(data, list):

                for item in data:

                    item = clean_text(item)

                    if item:
                        urls.append(item)

        except Exception:
            pass

    # --------------------------------------------------------
    # Extract URLs using regex
    # --------------------------------------------------------

    if not urls:

        matches = re.findall(
            r'https?://[^\s,"\']+',
            value
        )

        urls.extend(matches)

    # --------------------------------------------------------
    # Comma separated fallback
    # --------------------------------------------------------

    if not urls:

        for item in value.split(","):

            item = clean_text(item)

            if item:
                urls.append(item)

    # --------------------------------------------------------
    # Return first valid URL
    # --------------------------------------------------------

    for url in urls:

        url = url.strip()

        if not url:
            continue

        # Remove trailing punctuation
        url = url.rstrip("]}")

        # Prefer HTTPS
        if url.startswith("http://"):
            url = "https://" + url[7:]

        if url.startswith("https://"):
            return url

    return ""


# ============================================================
# DESCRIPTION
# ============================================================

def make_description(row):

    description = clean_text(
        row.get("description")
    )

    if not description:
        description = clean_text(
            row.get("product_description")
        )

    details = clean_text(
        row.get("product_details")
    )

    # --------------------------------------------------------
    # Try to extract useful information from product_details
    # --------------------------------------------------------

    if details:

        try:

            details_data = json.loads(details)

            extra_parts = []

            if isinstance(details_data, dict):

                for key in (
                    "material_and_care",
                    "size_and_fit",
                    "product_details",
                    "features"
                ):

                    value = clean_text(
                        details_data.get(key)
                    )

                    if value:
                        extra_parts.append(value)

            if extra_parts:

                if description:

                    description += (
                        " | "
                        + " | ".join(extra_parts)
                    )

                else:

                    description = " | ".join(
                        extra_parts
                    )

        except Exception:
            pass

    if not description:

        description = (
            "Quality product available at ShopEase."
        )

    return description[:5000]


# ============================================================
# CATEGORY
# ============================================================

def get_category(row):

    category = clean_text(
        row.get("category")
    )

    if not category:

        category = clean_text(
            row.get("root_bs_category")
        )

    if not category:

        category = clean_text(
            row.get("bs_category")
        )

    if not category:

        category = clean_text(
            row.get("subcategory_rank")
        )

    if not category:

        category = "Other"

    return category[:100]


# ============================================================
# RATING
# ============================================================

def get_rating(row):

    value = clean_text(
        row.get("rating")
    )

    if not value:
        return 0.0

    try:

        rating = float(value)

        return max(
            0.0,
            min(5.0, rating)
        )

    except (
        ValueError,
        TypeError
    ):

        return 0.0


# ============================================================
# RATING TO INTEGER
# ============================================================

def rating_to_integer(rating):

    if rating <= 0:
        return 0

    return max(
        1,
        min(
            5,
            int(round(rating))
        )
    )


# ============================================================
# REVIEW COMMENTS
# ============================================================

def review_comments(
    rating,
    product_name
):

    if rating >= 5:

        return [

            f"Excellent product. Really happy with the quality of {product_name}.",

            "Amazing purchase. The product quality is excellent.",

            "Very satisfied with this product. Highly recommended.",

            "Great value and a very good shopping experience."
        ]

    if rating >= 4:

        return [

            "Very good product and the quality is impressive.",

            "Happy with the purchase. Good quality for the price.",

            "Nice product and I would recommend it.",

            "Good overall experience with this product."
        ]

    if rating >= 3:

        return [

            "Good product overall and reasonably priced.",

            "The product is decent and meets expectations.",

            "A satisfactory purchase with good overall quality.",

            "Good product, although there is some room for improvement."
        ]

    if rating >= 2:

        return [

            "The product is okay, but the quality could be improved.",

            "Average experience with this product.",

            "The product is usable, but I expected a little more.",

            "Decent purchase, although improvements would be welcome."
        ]

    return [

        "The product did not fully meet my expectations.",

        "The quality could be improved.",

        "Average experience with this product.",

        "There is room for improvement in the overall product quality."
    ]


# ============================================================
# STOCK
# ============================================================

def generate_stock(product_id):

    try:

        product_id = int(product_id)

        return 5 + (product_id % 96)

    except (
        ValueError,
        TypeError
    ):

        return random_generator.randint(
            5,
            100
        )


# ============================================================
# NORMALIZE PRODUCT NAME
# ============================================================

def normalize_name(name):

    name = clean_text(name)

    name = name.lower()

    name = re.sub(
        r"\s+",
        " ",
        name
    )

    return name.strip()


# ============================================================
# CREATE REVIEWS
# ============================================================

def create_sample_reviews(
    product,
    row,
    available_users
):

    if not available_users:
        return 0

    rating = get_rating(row)

    if rating <= 0:
        return 0

    integer_rating = rating_to_integer(
        rating
    )

    if integer_rating <= 0:
        return 0

    comments = review_comments(
        integer_rating,
        product.name
    )

    inserted = 0

    for index, user_id in enumerate(
        available_users
    ):

        if index >= len(comments):
            break

        # ----------------------------------------------------
        # Prevent duplicate review
        # ----------------------------------------------------

        existing = Review.query.filter_by(

            user_id=user_id,

            product_id=product.id

        ).first()

        if existing:
            continue

        # ----------------------------------------------------
        # Create review
        # ----------------------------------------------------

        new_review = Review(

            user_id=user_id,

            product_id=product.id,

            rating=integer_rating,

            comment=comments[index]
        )

        db.session.add(
            new_review
        )

        inserted += 1

    return inserted


# ============================================================
# BUILD PRODUCT NAME
# ============================================================

def build_product_name(row):

    title = clean_text(
        row.get("title")
    )

    if not title:

        title = clean_text(
            row.get("name")
        )

    description = clean_text(
        row.get("description")
    )

    if not description:

        description = clean_text(
            row.get("product_description")
        )

    # --------------------------------------------------------
    # Prefer title
    # --------------------------------------------------------

    if title:

        # Keep the product name clean.
        #
        # We do NOT append the entire description here
        # because Amazon descriptions can be extremely long.
        #
        return title[:150]

    # --------------------------------------------------------
    # Fallback
    # --------------------------------------------------------

    if description:

        return description[:150]

    return ""


# ============================================================
# MAIN IMPORT
# ============================================================

def main():

    print()
    print("=" * 70)
    print("SHOP EASE - AMAZON PRODUCTS IMPORT")
    print("=" * 70)

    print()
    print(
        f"CSV file: {CSV_FILE}"
    )

    print()
    print(
        "Existing products will NOT be deleted."
    )

    print(
        "Only new products will be inserted."
    )

    # ========================================================
    # OPEN CSV
    # ========================================================

    try:

        file_handle = open(

            CSV_FILE,

            "r",

            encoding="utf-8-sig",

            newline=""

        )

    except FileNotFoundError:

        print()
        print("ERROR: CSV FILE NOT FOUND")
        print()
        print(
            f"Expected file: {CSV_FILE}"
        )
        print()
        print(
            "Make sure amazon-products.csv is inside:"
        )
        print(
            "E:\\ECOMMERCE_WEBSITE\\backend"
        )

        return

    # ========================================================
    # READ CSV
    # ========================================================

    with file_handle:

        reader = csv.DictReader(
            file_handle
        )

        if not reader.fieldnames:

            print()
            print(
                "ERROR: CSV has no columns."
            )

            return

        print()
        print(
            f"CSV columns detected: {len(reader.fieldnames)}"
        )

        print()
        print(
            "Columns:"
        )

        print(
            ", ".join(reader.fieldnames)
        )

        rows = list(reader)

    print()
    print(
        f"Products received from CSV : {len(rows)}"
    )

    # ========================================================
    # EXISTING PRODUCTS
    # ========================================================

    existing_products = (
        db.session.query(
            Product.id,
            Product.name
        ).all()
    )

    existing_ids = {

        int(product_id)

        for product_id, name
        in existing_products

        if product_id is not None
    }

    existing_names = {

        normalize_name(name)

        for product_id, name
        in existing_products

        if name
    }

    print(
        f"Existing products in DB    : {len(existing_ids)}"
    )

    # ========================================================
    # NEXT PRODUCT ID
    # ========================================================

    if existing_ids:

        next_product_id = (
            max(existing_ids) + 1
        )

    else:

        next_product_id = 1

    print(
        f"Next available product ID  : {next_product_id}"
    )

    # ========================================================
    # AVAILABLE USERS
    # ========================================================

    available_users = [

        user_id

        for user_id in USER_IDS

        if db.session.get(
            User,
            user_id
        )

    ]

    print(
        f"Users available for reviews: {available_users}"
    )

    # ========================================================
    # COUNTERS
    # ========================================================

    products_inserted = 0

    products_skipped = 0

    invalid_products = 0

    reviews_inserted = 0

    reviews_skipped = 0

    duplicate_names = 0

    processed_rows = 0

    # ========================================================
    # PROCESS ROWS
    # ========================================================

    for row_number, row in enumerate(
        rows,
        start=2
    ):

        processed_rows += 1

        try:

            # =================================================
            # PRODUCT NAME
            # =================================================

            name = build_product_name(
                row
            )

            if not name:

                invalid_products += 1

                continue

            normalized_name = normalize_name(
                name
            )

            # =================================================
            # DUPLICATE NAME CHECK
            # =================================================

            if normalized_name in existing_names:

                products_skipped += 1

                duplicate_names += 1

                continue

            # =================================================
            # DESCRIPTION
            # =================================================

            product_description = (
                make_description(row)
            )

            # =================================================
            # PRICE
            # =================================================

            price = parse_price(

                row.get(
                    "final_price"
                )

            )

            if price <= 0:

                price = parse_price(

                    row.get(
                        "initial_price"
                    )

                )

            if price <= 0:

                invalid_products += 1

                continue

            # =================================================
            # IMAGE
            # =================================================

            image = first_image_url(

                row.get(
                    "images"
                )

            )

            if not image:

                image = first_image_url(

                    row.get(
                        "image_url"
                    )

                )

            if not image:

                invalid_products += 1

                continue

            # =================================================
            # CATEGORY
            # =================================================

            category = get_category(
                row
            )

            # =================================================
            # PRODUCT ID
            # =================================================

            product_id = next_product_id

            next_product_id += 1

            # Make absolutely sure ID doesn't exist.
            while product_id in existing_ids:

                product_id = next_product_id

                next_product_id += 1

            # =================================================
            # STOCK
            # =================================================

            stock = generate_stock(
                product_id
            )

            # =================================================
            # CREATE PRODUCT
            # =================================================

            product = Product(

                id=product_id,

                name=name,

                description=product_description,

                price=price,

                image=image,

                category=category,

                stock=stock
            )

            db.session.add(
                product
            )

            # Make product available to Review
            db.session.flush()

            # =================================================
            # UPDATE COUNTERS
            # =================================================

            products_inserted += 1

            existing_ids.add(
                product_id
            )

            existing_names.add(
                normalized_name
            )

            # =================================================
            # REVIEWS
            # =================================================

            inserted_reviews = (
                create_sample_reviews(

                    product,

                    row,

                    available_users
                )
            )

            reviews_inserted += (
                inserted_reviews
            )

            if inserted_reviews == 0:

                reviews_skipped += 1

            # =================================================
            # COMMIT EVERY 25 PRODUCTS
            # =================================================

            if products_inserted % 25 == 0:

                db.session.commit()

                print()
                print(
                    f"Progress: "
                    f"{products_inserted} new products inserted..."
                )

                print(
                    f"          "
                    f"{reviews_inserted} reviews inserted..."
                )

        except Exception as error:

            db.session.rollback()

            print()
            print(
                f"WARNING: Row {row_number} skipped."
            )

            print(
                f"Reason: {error}"
            )

            invalid_products += 1

            # Rebuild existing IDs
            existing_ids = {

                int(product_id)

                for (
                    product_id,
                ) in db.session.query(
                    Product.id
                ).all()

                if product_id is not None
            }

            # Rebuild names
            existing_names = {

                normalize_name(name)

                for (
                    name,
                ) in db.session.query(
                    Product.name
                ).all()

                if name
            }

    # ========================================================
    # FINAL COMMIT
    # ========================================================

    try:

        db.session.commit()

    except Exception as error:

        db.session.rollback()

        print()
        print("=" * 70)
        print("IMPORT FAILED")
        print("=" * 70)

        print()
        print(error)

        return

    # ========================================================
    # FINAL DATABASE COUNTS
    # ========================================================

    total_products = (
        Product.query.count()
    )

    total_reviews = (
        Review.query.count()
    )

    # ========================================================
    # FINAL REPORT
    # ========================================================

    print()
    print("=" * 70)
    print("SHOP EASE AMAZON IMPORT COMPLETED")
    print("=" * 70)

    print()

    print(
        f"CSV rows processed       : {processed_rows}"
    )

    print(
        f"Products received        : {len(rows)}"
    )

    print(
        f"New products inserted    : {products_inserted}"
    )

    print(
        f"Duplicate products       : {products_skipped}"
    )

    print(
        f"Duplicate names          : {duplicate_names}"
    )

    print(
        f"Invalid products         : {invalid_products}"
    )

    print(
        f"Reviews inserted         : {reviews_inserted}"
    )

    print(
        f"Review groups skipped    : {reviews_skipped}"
    )

    print()

    print(
        f"TOTAL PRODUCTS IN DB     : {total_products}"
    )

    print(
        f"TOTAL REVIEWS IN DB      : {total_reviews}"
    )

    print()

    print(
        "Existing products were NOT deleted."
    )

    print(
        "Existing products were NOT modified."
    )

    print()

    print("=" * 70)
    print("IMPORT DONE")
    print("=" * 70)

    print()


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    with app.app_context():

        main()