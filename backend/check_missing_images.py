import sys
import os
import requests

# Allow importing backend modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from database.db import db
from models.product import Product


def check_product_images():

    print("=" * 70)
    print("CHECKING PRODUCT IMAGE URLs")
    print("=" * 70)

    with app.app_context():

        products = Product.query.all()

        print(f"TOTAL PRODUCTS : {len(products)}")
        print()

        broken_products = []

        for product in products:

            image_url = product.image

            if not image_url:
                broken_products.append({
                    "id": product.id,
                    "name": product.name,
                    "image": image_url,
                    "reason": "EMPTY IMAGE"
                })
                continue

            try:

                response = requests.get(
                    image_url,
                    timeout=10,
                    allow_redirects=True
                )

                content_type = response.headers.get(
                    "Content-Type",
                    ""
                )

                if response.status_code != 200:

                    broken_products.append({
                        "id": product.id,
                        "name": product.name,
                        "image": image_url,
                        "reason": f"HTTP {response.status_code}"
                    })

                elif not content_type.startswith("image/"):

                    broken_products.append({
                        "id": product.id,
                        "name": product.name,
                        "image": image_url,
                        "reason": f"NOT AN IMAGE ({content_type})"
                    })

            except Exception as e:

                broken_products.append({
                    "id": product.id,
                    "name": product.name,
                    "image": image_url,
                    "reason": str(e)
                })

        print("=" * 70)
        print(f"BROKEN IMAGE PRODUCTS : {len(broken_products)}")
        print("=" * 70)

        if broken_products:

            print()

            for product in broken_products:

                print("-" * 70)

                print(
                    f"ID     : {product['id']}"
                )

                print(
                    f"NAME   : {product['name']}"
                )

                print(
                    f"IMAGE  : {product['image']}"
                )

                print(
                    f"REASON : {product['reason']}"
                )

            print()
            print("=" * 70)
            print("BROKEN IMAGE CHECK COMPLETE")
            print("=" * 70)

        else:

            print()
            print("ALL PRODUCT IMAGE URLs ARE WORKING.")
            print()
            print("=" * 70)


if __name__ == "__main__":
    check_product_images()