import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/api";

import "../styles/Cart.css";

import { CartContext } from "../context/CartContext";

function Cart() {

    const navigate = useNavigate();

    const user = JSON.parse(

        localStorage.getItem("user")

    );

    const {

        setCartCount

    } = useContext(

        CartContext

    );

    // ==========================
    // STATES
    // ==========================

    const [cartItems, setCartItems] = useState([]);

    const [loading, setLoading] = useState(true);

    const [brokenImages, setBrokenImages] = useState({});

    // ==========================
    // PAGE LOAD
    // ==========================

    useEffect(() => {

        window.scrollTo(0, 0);

        if (!user) {

            navigate("/login");

            return;

        }

        fetchCart();

    }, []);

    // ==========================
    // CART TOTAL
    // ==========================

    const total = cartItems.reduce(

        (sum, item) =>

            sum +

            item.price * item.quantity,

        0

    );

    // ==========================
    // FETCH CART
        const fetchCart = async () => {

        try {

            const response = await API.get(

                `/api/cart/${user.id}`

            );

            if (

                Array.isArray(response.data)

            ) {

                setCartItems(

                    response.data

                );

            }

            else {

                setCartItems([]);

            }

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    // ==========================
    // REFRESH CART COUNT
    // ==========================

    const refreshCartCount = async () => {

        try {

            const response = await API.get(

                `/api/cart/count/${user.id}`

            );

            setCartCount(

                response.data.count

            );

        }

        catch (error) {

            console.log(error);

        }

    };

    // ==========================
    // REMOVE ITEM
    // ==========================

    const removeItem = async (cartId) => {

        const confirmDelete = window.confirm(

            "Remove this item from cart?"

        );

        if (!confirmDelete) return;

        try {

            await API.delete(

                `/api/cart/remove/${cartId}`

            );

            fetchCart();

            refreshCartCount();

        }

        catch (error) {

            console.log(error);

            alert(

                "Unable to remove item."

            );

        }

    };

    // ==========================
    // INCREASE QUANTITY
    // ==========================

    const increaseQuantity = async (

        cartId

    ) => {

        try {

            await API.put(

                `/api/cart/increase/${cartId}`

            );

            fetchCart();

            refreshCartCount();

        }

        catch (error) {

            console.log(error);

        }

    };

    // ==========================
    // DECREASE QUANTITY
    // ==========================

    const decreaseQuantity = async (

        cartId

    ) => {

        try {

            await API.put(

                `/api/cart/decrease/${cartId}`

            );

            fetchCart();

            refreshCartCount();

        }

        catch (error) {

            console.log(error);

        }

    };

    // ==========================
    // IMAGE FALLBACK
    // ==========================

    const handleImageError = (cartId) => {

        setBrokenImages(prev => ({
            ...prev,
            [cartId]: true
        }));

    };

    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (

            <div className="cart-loading">

                <h2>

                    Loading Cart...

                </h2>

            </div>

        );

    }

    return (

        <div className="cart-page">

            <div className="cart-header">

                <h1>

                    🛒 Shopping Cart

                </h1>

                <p>

                    Review your items before proceeding to checkout.

                </p>

                {cartItems.length > 0 && (

                    <div className="cart-header-count">

                        {cartItems.length}{" "}

                        {cartItems.length === 1 ? "item" : "items"} in your cart

                    </div>

                )}

            </div>

            {

                cartItems.length > 0 ?

                (

                    <div className="cart-container">

                        <div className="cart-items">

                            {                                cartItems.map((item) => (

                                    <div

                                        className="cart-card"

                                        key={item.id}

                                    >

                                        {/* ==========================
                                            PRODUCT IMAGE
                                        ========================== */}

                                        <div className="cart-image">

                                            {!brokenImages[item.id] ? (

                                                <img

                                                    src={item.image}

                                                    alt={item.name}

                                                    onError={() =>
                                                        handleImageError(item.id)
                                                    }

                                                />

                                            ) : (

                                                <div className="cart-image-fallback">

                                                    <span>🖼️</span>

                                                    <small>Image unavailable</small>

                                                </div>

                                            )}

                                        </div>

                                        {/* ==========================
                                            PRODUCT DETAILS
                                        ========================== */}

                                        <div className="cart-info">

                                            <span className="cart-category">

                                                {item.category}

                                            </span>

                                            <h2>

                                                {item.name}

                                            </h2>

                                            <p>

                                                {

                                                    item.description

                                                        ?

                                                        item.description.length > 150

                                                            ?

                                                            item.description.substring(0, 150) + "..."

                                                            :

                                                            item.description

                                                        :

                                                        "Premium quality product."

                                                }

                                            </p>

                                            <div className="cart-meta">

                                                <span className="cart-price">

                                                    ₹ {item.price}

                                                </span>

                                                {

                                                    Number(item.stock) > 0 ?

                                                    (

                                                        <span className="stock-available">

                                                            ✅ In Stock

                                                        </span>

                                                    )

                                                    :

                                                    (

                                                        <span className="stock-unavailable">

                                                            ❌ Out Of Stock

                                                        </span>

                                                    )

                                                }

                                            </div>

                                            <div className="quantity-row">

                                                <div className="quantity-box">

                                                    <button

                                                        onClick={() =>

                                                            decreaseQuantity(item.id)

                                                        }

                                                    >

                                                        −

                                                    </button>

                                                    <span>

                                                        {item.quantity}

                                                    </span>

                                                    <button

                                                        onClick={() =>

                                                            increaseQuantity(item.id)

                                                        }

                                                    >

                                                        +

                                                    </button>

                                                </div>

                                                <h3>

                                                    Total : ₹ {item.price * item.quantity}

                                                </h3>

                                            </div>

                                            <div className="cart-buttons">

                                                <button

                                                    className="details-btn"

                                                    onClick={() =>

                                                        navigate(

                                                            `/product/${item.product_id}`

                                                        )

                                                    }

                                                >

                                                    👁 View Details

                                                </button>

                                                <button

                                                    className="remove-btn"

                                                    onClick={() =>

                                                        removeItem(item.id)

                                                    }

                                                >

                                                    🗑 Remove

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                        {/* ==========================
                            ORDER SUMMARY
                        ========================== */}

                        <div className="cart-summary">

                            <button

                                className="continue-shopping-cart-btn"

                                onClick={() => navigate("/products")}

                            >

                                ← Continue Shopping

                            </button>

                            <h2>

                                Order Summary

                            </h2>

                            <div className="summary-items-count">

                                {cartItems.length}{" "}

                                {cartItems.length === 1 ? "product" : "products"}

                            </div>

                            <div className="summary-row">

                                <span>

                                    Subtotal

                                </span>

                                <span>

                                    ₹ {total}

                                </span>

                            </div>

                            <div className="summary-row">

                                <span>

                                    Shipping

                                </span>

                                <span className="free">

                                    FREE

                                </span>

                            </div>

                            <hr />

                            <div className="summary-total">

                                <span>

                                    Total

                                </span>

                                <span>

                                    ₹ {total}

                                </span>

                            </div>

                            <button

                                className="checkout-btn"

                                disabled={total <= 0}

                                onClick={() =>

                                    navigate(

                                        "/checkout",

                                        {

                                            state: {

                                                total: total

                                            }

                                        }

                                    )

                                }

                            >

                                Proceed To Checkout

                            </button>

                        </div>

                    </div>                )

                :

                (

                    <div className="cart-empty">

                        <div className="cart-empty-icon">

                            🛒

                        </div>

                        <h2>

                            Your Cart is Empty

                        </h2>

                        <p>

                            Browse our latest products and start shopping.

                        </p>

                        <button

                            className="continue-shopping-btn"

                            onClick={() =>

                                navigate("/products")

                            }

                        >

                            Continue Shopping

                        </button>

                    </div>

                )

            }

        </div>

    );

}

export default Cart;