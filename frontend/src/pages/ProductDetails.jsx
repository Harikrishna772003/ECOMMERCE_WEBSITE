import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../api/api";
import "../styles/ProductDetails.css";

import { CartContext } from "../context/CartContext";

function ProductDetails() {

    // ==========================
    // ROUTER
    // ==========================

    const { id } = useParams();

    const navigate = useNavigate();

    // ==========================
    // USER
    // ==========================

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // ==========================
    // CONTEXT
    // ==========================

    const {
        cartCount,
        setCartCount
    } = useContext(CartContext);

    // ==========================
    // STATES
    // ==========================

    const [product, setProduct] =
        useState(null);

    const [relatedProducts, setRelatedProducts] =
        useState([]);

    const [reviews, setReviews] =
        useState([]);

    const [averageRating, setAverageRating] =
        useState(0);

    const [totalReviews, setTotalReviews] =
        useState(0);

    const [rating, setRating] =
        useState(5);

    const [comment, setComment] =
        useState("");

    const [quantity, setQuantity] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [addingToCart, setAddingToCart] =
        useState(false);

    const [imageError, setImageError] =
        useState(false);

    // ==========================
    // LOAD DATA
    // ==========================

    useEffect(() => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        loadProduct();

        loadReviews();

    }, [id]);

    // ==========================
    // PRODUCT
    // ==========================

    const loadProduct = async () => {

        try {

            setLoading(true);

            const response =
                await API.get(
                    `/api/product/${id}`
                );

            setProduct(
                response.data
            );

            setQuantity(1);
            setImageError(false);

            loadRelatedProducts(

                response.data.category,

                response.data.id

            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    // ==========================
    // RELATED PRODUCTS
    // ==========================

    const loadRelatedProducts = async (

        category,

        productId

    ) => {

        try {

            const response =
                await API.get(

                    `/api/products/category/${category}`

                );

            const filtered =
                response.data.filter(

                    item =>

                        Number(item.id) !==
                        Number(productId)

                );

            setRelatedProducts(
                filtered
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    // ==========================
    // REVIEWS
    // ==========================

    const loadReviews = async () => {

        try {

            const response =
                await API.get(

                    `/api/reviews/${id}`

                );

            setAverageRating(
                response.data.average_rating
            );

            setTotalReviews(
                response.data.total_reviews
            );

            setReviews(
                response.data.reviews
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    // ==========================
    // SUBMIT REVIEW
    // ==========================

    const submitReview = async () => {

        if (!user) {

            alert("Please Login First");

            return;

        }

        if (comment.trim() === "") {

            alert("Please Enter Review");

            return;

        }

        try {

            const response =
                await API.post(

                    "/api/review/add",

                    {

                        user_id: user.id,

                        product_id: product.id,

                        rating,

                        comment

                    }

                );

            alert(
                response.data.message
            );

            setComment("");

            setRating(5);

            loadReviews();

        }

        catch (error) {

            if (error.response) {

                alert(
                    error.response.data.message
                );

            }

        }

    };

    // ==========================
    // ADD TO CART
    // ==========================

    const addToCart = async () => {

        if (!user) {

            alert("Please Login First");

            navigate("/login");

            return;

        }

        try {

            setAddingToCart(true);

            const response =
                await API.post(

                    "/api/cart/add",

                    {

                        user_id: user.id,

                        product_id: product.id,

                        quantity

                    }

                );

            alert(
                response.data.message
            );

            setCartCount(
                cartCount + quantity
            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setAddingToCart(false);

        }

    };

    // ==========================
    // BUY NOW
    // ==========================

    const buyNow = async () => {

        await addToCart();

        navigate("/checkout");

    };

    // ==========================
    // ADD TO WISHLIST
    // ==========================

    const addToWishlist = async () => {

        if (!user) {

            alert("Please Login First");

            navigate("/login");

            return;

        }

        try {

            const response =
                await API.post(

                    "/api/wishlist/add",

                    {

                        user_id: user.id,

                        product_id: product.id

                    }

                );

            alert(
                response.data.message
            );

        }

        catch (error) {

            if (error.response) {

                alert(
                    error.response.data.message
                );

            }

        }

    };

    // ==========================
    // SHARE PRODUCT
    // ==========================

    const shareProduct = async () => {

        try {

            await navigator.clipboard.writeText(

                window.location.href

            );

            alert(
                "Product link copied!"
            );

        }

        catch {

            alert(
                "Unable to copy link."
            );

        }

    };

    // ==========================
    // QUANTITY
    // ==========================

    const increaseQuantity = () => {

        if (
            product &&
            quantity < Number(product.stock)
        ) {
            setQuantity(
                prev => prev + 1
            );
        }

    };

    const decreaseQuantity = () => {

        if (quantity > 1) {

            setQuantity(
                prev => prev - 1
            );

        }

    };

    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (

            <div className="loading-product">

                <h1>

                    Loading Product...

                </h1>

            </div>

        );

    }

    // ==========================
    // JSX STARTS BELOW
    // ==========================

    return (
      <div className="product-details-page">

    {/* ==========================
        BACK NAVIGATION
    ========================== */}

    <div className="product-back-row">

        <button
            className="back-products-btn"
            onClick={() => navigate("/products")}
        >
            ← Back to Products
        </button>

    </div>

    {/* ==========================
        PRODUCT SECTION
    ========================== */}

    <div className="product-container">

        {/* ==========================
            PRODUCT IMAGE
        ========================== */}

        <div className="product-image-section">

            <div className="product-image-wrapper">

                {!imageError ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="main-product-image"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="product-image-fallback">
                        <span>🖼️</span>
                        <p>Image unavailable</p>
                    </div>
                )}

                <span className="product-image-badge">
                    ⭐ Premium Product
                </span>

            </div>

        </div>

        {/* ==========================
            PRODUCT INFO
        ========================== */}

        <div className="product-info-section">

            <span className="product-category">

                {product.category}

            </span>

            <h1>

                {product.name}

            </h1>

            <div className="rating-row">

                <span className="rating-stars">

                    ⭐ {averageRating}

                </span>

                <span>

                    ({totalReviews} Reviews)

                </span>

            </div>

            {/* ======================
                PRICE
            ====================== */}

            <div className="price-box">

                <h2>

                    ₹ {product.price}

                </h2>

                <span className="old-price">

                    ₹ {Math.round(product.price * 1.20)}

                </span>

                <span className="discount">

                    20% OFF

                </span>

            </div>

            {/* ======================
                DELIVERY
            ====================== */}

            <div className="delivery-box">

                🚚 Free Delivery

                <br />

                <small>

                    Expected Delivery in 2–4 Days

                </small>

            </div>

            {/* ======================
                TRUST FEATURES
            ====================== */}

            <div className="product-trust-row">

                <div className="trust-item">
                    🚚
                    <span>Fast Delivery</span>
                </div>

                <div className="trust-item">
                    🔒
                    <span>Secure Payment</span>
                </div>

                <div className="trust-item">
                    ↩️
                    <span>Easy Returns</span>
                </div>

            </div>

            {/* ======================
                STOCK
            ====================== */}

            {

                product.stock > 5 ?

                (

                    <div className="stock in-stock">

                        ✅ In Stock

                    </div>

                )

                :

                product.stock > 0 ?

                (

                    <div className="stock low-stock">

                        ⚠ Only {product.stock} Left

                    </div>

                )

                :

                (

                    <div className="stock out-stock">

                        ❌ Out Of Stock

                    </div>

                )

            }

            {/* ======================
                QUANTITY
            ====================== */}

            <div className="quantity-section">

                <h3>

                    Quantity

                </h3>

                <div className="quantity-box">

                    <button

                        onClick={decreaseQuantity}

                    >

                        −

                    </button>

                    <span>

                        {quantity}

                    </span>

                    <button

                        onClick={increaseQuantity}

                    >

                        +

                    </button>

                </div>

            </div>

            {/* ======================
                BUTTONS
            ====================== */}

            <div className="product-buttons">

                <button

                    className="cart-button"

                    disabled={
                        product.stock === 0 ||
                        addingToCart
                    }

                    onClick={addToCart}

                >

                    {

                        addingToCart

                        ?

                        "Adding..."

                        :

                        "🛒 Add To Cart"

                    }

                </button>

                <button

                    className="buy-button"

                    disabled={
                        product.stock === 0
                    }

                    onClick={buyNow}

                >

                    ⚡ Buy Now

                </button>

            </div>

            {/* ======================
                EXTRA BUTTONS
            ====================== */}

            <div className="secondary-buttons">

                <button

                    className="wishlist-button"

                    onClick={addToWishlist}

                >

                    ❤️ Wishlist

                </button>

                <button

                    className="share-button"

                    onClick={shareProduct}

                >

                    🔗 Share

                </button>

            </div>

            {/* ======================
                DESCRIPTION
            ====================== */}

            <div className="description-box">

                <h3>

                    Description

                </h3>

                <p>

                    {product.description}

                </p>

            </div>

            {/* ======================
                SPECIFICATIONS
            ====================== */}

            <div className="specification-box">

                <h3>

                    Specifications

                </h3>

                <table>

                    <tbody>

                        <tr>

                            <td>Category</td>

                            <td>{product.category}</td>

                        </tr>

                        <tr>

                            <td>Availability</td>

                            <td>

                                {

                                    product.stock > 0

                                        ?

                                        "In Stock"

                                        :

                                        "Out Of Stock"

                                }

                            </td>

                        </tr>

                        <tr>

                            <td>Warranty</td>

                            <td>1 Year</td>

                        </tr>

                        <tr>

                            <td>Shipping</td>

                            <td>Free</td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    </div>

    {/* ==========================
        RELATED PRODUCTS
    ========================== */}
    <div className="related-products-section">

    <div className="section-title">

        <h2>

            Related Products

        </h2>

        <p>

            You may also like these products.

        </p>

    </div>

    {

        relatedProducts.length > 0 ?

        (

            <div className="related-products-grid">

                {

                    relatedProducts
                    .slice(0, 4)
                    .map((item) => (

                        <div
                            key={item.id}
                            className="related-product-card"
                        >

                            <div className="related-image">

                                <img
                                    src={item.image}
                                    alt={item.name}
                                />

                            </div>

                            <div className="related-content">

                                <span className="related-category">

                                    {item.category}

                                </span>

                                <h3>

                                    {item.name}

                                </h3>

                                <h4>

                                    ₹ {item.price}

                                </h4>

                                {

                                    item.stock > 0 ?

                                    (

                                        <span className="related-stock in">

                                            ✅ In Stock

                                        </span>

                                    )

                                    :

                                    (

                                        <span className="related-stock out">

                                            ❌ Out Of Stock

                                        </span>

                                    )

                                }

                                <button

                                    className="details-button"

                                    onClick={() =>

                                        navigate(

                                            `/product/${item.id}`

                                        )

                                    }

                                >

                                    View Details

                                </button>

                            </div>

                        </div>

                    ))

                }

            </div>

        )

        :

        (

            <div className="empty-related">

                <h3>

                    No Related Products Available

                </h3>

                <p>

                    Check back later for similar products.

                </p>

            </div>

        )

    }

</div>

{/* ==========================
    CUSTOMER REVIEWS
========================== */}
<div className="reviews-section">

    <div className="section-title">

        <h2>

            ⭐ Customer Reviews

        </h2>

        <p>

            Read what our customers say about this product.

        </p>

    </div>

    {/* ==========================
        REVIEW SUMMARY
    ========================== */}

    <div className="review-summary">

        <div className="average-rating-box">

            <h1>

                ⭐ {averageRating}

            </h1>

            <p>

                Average Rating

            </p>

        </div>

        <div className="review-count-box">

            <h2>

                {totalReviews}

            </h2>

            <p>

                Total Reviews

            </p>

        </div>

    </div>

    {/* ==========================
        REVIEW FORM
    ========================== */}

    {

        user &&

        <div className="review-form">

            <h3>

                Write a Review

            </h3>

            <label>

                Rating

            </label>

            <select

                value={rating}

                onChange={(e) =>
                    setRating(
                        Number(e.target.value)
                    )
                }

            >

                <option value={5}>
                    ⭐⭐⭐⭐⭐ Excellent
                </option>

                <option value={4}>
                    ⭐⭐⭐⭐ Very Good
                </option>

                <option value={3}>
                    ⭐⭐⭐ Good
                </option>

                <option value={2}>
                    ⭐⭐ Fair
                </option>

                <option value={1}>
                    ⭐ Poor
                </option>

            </select>

            <label>

                Your Review

            </label>

            <textarea

                placeholder="Share your experience about this product..."

                value={comment}

                onChange={(e) =>
                    setComment(
                        e.target.value
                    )
                }

            />

            <button

                className="submit-review-btn"

                onClick={submitReview}

            >

                Submit Review

            </button>

        </div>

    }

    {/* ==========================
        REVIEW LIST
    ========================== */}

    <div className="reviews-list">

        {

            reviews.length > 0 ?

            (

                reviews.map((review) => (

                    <div

                        key={review.id}

                        className="review-card"

                    >

                        <div className="review-header">

                            <div className="review-user">

                                <div className="user-avatar">

                                    {

                                        review.user
                                            ?.charAt(0)
                                            .toUpperCase()

                                    }

                                </div>

                                <div>

                                    <h3>

                                        {review.user}

                                    </h3>

                                    <small>

                                        {review.date}

                                    </small>

                                </div>

                            </div>

                            <div className="review-stars">

                                {

                                    "⭐".repeat(
                                        review.rating
                                    )

                                }

                            </div>

                        </div>

                        <p className="review-comment">

                            {review.comment}

                        </p>

                    </div>

                ))

            )

            :

            (

                <div className="empty-review">

                    <h3>

                        No Reviews Yet

                    </h3>

                    <p>

                        Be the first customer to review this product.

                    </p>

                </div>

            )

        }

    </div>

</div>

{/* ==========================
    PAGE END
========================== */}
</div>

    );

}

export default ProductDetails;