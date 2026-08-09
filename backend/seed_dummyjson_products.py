import requests

from app import app
from database.db import db
from models.product import Product


# ==========================================
# DUMMYJSON PRODUCT DATA
# ==========================================

URL = "https://dummyjson.com/products?limit=0"


def seed_products():

    print("=" * 60)
    print("DOWNLOADING PRODUCTS FROM DUMMYJSON...")
    print("=" * 60)

    response = requests.get(URL, timeout=30)

    if response.status_code != 200:
        print("ERROR: Unable to download products.")
        print("Status Code:", response.status_code)
        return

    data = response.json()

    products = data.get("products", [])

    print(f"PRODUCTS FOUND : {len(products)}")
    print()

    inserted = 0
    skipped = 0

    for item in products:

        name = item.get("title")

        # ------------------------------------------
        # Check if product already exists
        # ------------------------------------------

        existing = Product.query.filter_by(
            name=name
        ).first()

        if existing:

            print(f"SKIPPED : {name}")
            skipped += 1
            continue

        # ------------------------------------------
        # Get image
        # ------------------------------------------

        images = item.get("images", [])

        if images:
            image = images[0]
        else:
            image = item.get("thumbnail", "")

        # ------------------------------------------
        # Create product
        # ------------------------------------------

        new_product = Product(

            name=name,

            description=item.get(
                "description",
                "No description available."
            ),

            price=float(
                item.get("price", 0)
            ),

            image=image,

            category=item.get(
                "category",
                "Other"
            ),

            stock=int(
                item.get("stock", 0)
            )

        )

        db.session.add(new_product)

        inserted += 1

        print(f"INSERTED : {name}")

    # ------------------------------------------
    # Save changes
    # ------------------------------------------

    db.session.commit()

    # ------------------------------------------
    # Final result
    # ------------------------------------------

    total = Product.query.count()

    print()
    print("=" * 60)
    print(f"NEW PRODUCTS INSERTED : {inserted}")
    print(f"PRODUCTS SKIPPED      : {skipped}")
    print(f"TOTAL PRODUCTS        : {total}")
    print("=" * 60)


# ==========================================
# RUN SCRIPT
# ==========================================

if __name__ == "__main__":

    with app.app_context():

        seed_products()