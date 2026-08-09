from flask import Blueprint, jsonify, request
from models.product import Product

product = Blueprint("product", __name__)


# ==========================================================
# GET ALL PRODUCTS
# Search + Category + Price + Stock + Sort + Pagination
# ==========================================================

@product.route("/products", methods=["GET"])
def get_products():

    search = request.args.get("search", "").strip()
    category = request.args.get("category", "").strip()
    sort = request.args.get("sort", "").strip().lower()

    min_price = request.args.get("min_price")
    max_price = request.args.get("max_price")
    stock = request.args.get("stock", "").strip().lower()

    try:
        page = int(request.args.get("page", 1))
    except ValueError:
        page = 1

    # ALWAYS 100 PRODUCTS PER PAGE
    limit = 100

    if page < 1:
        page = 1

    query = Product.query


    # ======================================================
    # SEARCH
    # ======================================================

    if search:

        query = query.filter(
            Product.name.ilike(f"%{search}%")
        )


    # ======================================================
    # CATEGORY
    # ======================================================

    if category and category != "All":

        query = query.filter(
            Product.category == category
        )


    # ======================================================
    # MIN PRICE
    # ======================================================

    if min_price:

        try:

            query = query.filter(
                Product.price >= float(min_price)
            )

        except ValueError:
            pass


    # ======================================================
    # MAX PRICE
    # ======================================================

    if max_price:

        try:

            query = query.filter(
                Product.price <= float(max_price)
            )

        except ValueError:
            pass


    # ======================================================
    # STOCK
    # ======================================================

    if stock == "in":

        query = query.filter(
            Product.stock > 0
        )

    elif stock == "out":

        query = query.filter(
            Product.stock == 0
        )


    # ======================================================
    # SORTING
    # ======================================================

    if sort == "asc":

        # PRICE LOW → HIGH
        query = query.order_by(
            Product.price.asc(),
            Product.id.asc()
        )

    elif sort == "desc":

        # PRICE HIGH → LOW
        query = query.order_by(
            Product.price.desc(),
            Product.id.desc()
        )

    elif sort == "new":

        # NEWEST PRODUCTS
        query = query.order_by(
            Product.id.desc()
        )

    else:

        # DEFAULT
        query = query.order_by(
            Product.id.asc()
        )


    # ======================================================
    # TOTAL AFTER FILTERING
    # ======================================================

    total_products = query.count()


    # ======================================================
    # TOTAL PAGES
    # ======================================================

    total_pages = (
        total_products + limit - 1
    ) // limit


    # ======================================================
    # PAGINATION
    #
    # IMPORTANT:
    # SORTING HAS ALREADY HAPPENED ABOVE.
    # ONLY NOW DO WE APPLY OFFSET/LIMIT.
    # ======================================================

    products = query.offset(
        (page - 1) * limit
    ).limit(limit).all()


    # ======================================================
    # PRODUCT RESPONSE
    # ======================================================

    product_list = []

    for p in products:

        product_list.append({

            "id": p.id,

            "name": p.name,

            "description": p.description,

            "price": p.price,

            "image": p.image,

            "category": p.category,

            "stock": p.stock

        })


    # ======================================================
    # FINAL RESPONSE
    # ======================================================

    return jsonify({

        "products": product_list,

        "total": total_products,

        "page": page,

        "limit": limit,

        "pages": total_pages

    }), 200


# ==========================================================
# GET SINGLE PRODUCT
# ==========================================================

@product.route(
    "/product/<int:product_id>",
    methods=["GET"]
)
def get_single_product(product_id):

    p = Product.query.get(product_id)

    if not p:

        return jsonify({

            "message": "Product Not Found"

        }), 404


    return jsonify({

        "id": p.id,

        "name": p.name,

        "description": p.description,

        "price": p.price,

        "image": p.image,

        "category": p.category,

        "stock": p.stock

    }), 200


# ==========================================================
# GET PRODUCTS BY CATEGORY
# ==========================================================

@product.route(
    "/products/category/<string:category>",
    methods=["GET"]
)
def get_products_by_category(category):

    products = Product.query.filter_by(
        category=category
    ).all()

    product_list = []

    for p in products:

        product_list.append({

            "id": p.id,

            "name": p.name,

            "description": p.description,

            "price": p.price,

            "image": p.image,

            "category": p.category,

            "stock": p.stock

        })


    return jsonify(product_list), 200


# ==========================================================
# GET ALL CATEGORIES
# ==========================================================

@product.route(
    "/categories",
    methods=["GET"]
)
def get_categories():

    categories = Product.query.with_entities(
        Product.category
    ).distinct().all()


    category_list = [
        c[0]
        for c in categories
    ]


    return jsonify(category_list), 200