from app import app
from database.db import db

from models.product import Product
from models.wishlist import Wishlist
from models.cart import Cart
from models.order_item import OrderItem
from models.review import Review


# ==========================================================
# DELETE OLD 100 PRODUCTS SAFELY
# ==========================================================

def delete_old_products():

    with app.app_context():

        print("=" * 60)
        print("STARTING OLD PRODUCT CLEANUP")
        print("=" * 60)

        # --------------------------------------------------
        # Find old products
        # --------------------------------------------------

        old_products = Product.query.filter(
            Product.id <= 100
        ).all()

        print(
            "OLD PRODUCTS FOUND :",
            len(old_products)
        )

        if not old_products:

            print("NO OLD PRODUCTS FOUND")
            print("=" * 60)

            return

        old_product_ids = [
            product.id
            for product in old_products
        ]

        # --------------------------------------------------
        # Delete Wishlist records
        # --------------------------------------------------

        wishlist_deleted = Wishlist.query.filter(
            Wishlist.product_id.in_(old_product_ids)
        ).delete(
            synchronize_session=False
        )

        print(
            "WISHLIST RECORDS DELETED :",
            wishlist_deleted
        )

        # --------------------------------------------------
        # Delete Cart records
        # --------------------------------------------------

        cart_deleted = Cart.query.filter(
            Cart.product_id.in_(old_product_ids)
        ).delete(
            synchronize_session=False
        )

        print(
            "CART RECORDS DELETED :",
            cart_deleted
        )

        # --------------------------------------------------
        # Delete Review records
        # --------------------------------------------------

        review_deleted = Review.query.filter(
            Review.product_id.in_(old_product_ids)
        ).delete(
            synchronize_session=False
        )

        print(
            "REVIEW RECORDS DELETED :",
            review_deleted
        )

        # --------------------------------------------------
        # Delete OrderItem records
        # --------------------------------------------------

        order_item_deleted = OrderItem.query.filter(
            OrderItem.product_id.in_(old_product_ids)
        ).delete(
            synchronize_session=False
        )

        print(
            "ORDER ITEM RECORDS DELETED :",
            order_item_deleted
        )

        # --------------------------------------------------
        # Delete Products
        # --------------------------------------------------

        products_deleted = Product.query.filter(
            Product.id.in_(old_product_ids)
        ).delete(
            synchronize_session=False
        )

        print(
            "PRODUCTS DELETED :",
            products_deleted
        )

        # --------------------------------------------------
        # Commit
        # --------------------------------------------------

        db.session.commit()

        # --------------------------------------------------
        # Check remaining products
        # --------------------------------------------------

        total_products = Product.query.count()

        print()
        print("=" * 60)
        print("DELETION COMPLETE")
        print("=" * 60)

        print(
            "PRODUCTS DELETED :",
            products_deleted
        )

        print(
            "TOTAL PRODUCTS LEFT :",
            total_products
        )

        print("=" * 60)


# ==========================================================
# RUN SCRIPT
# ==========================================================

if __name__ == "__main__":

    delete_old_products()