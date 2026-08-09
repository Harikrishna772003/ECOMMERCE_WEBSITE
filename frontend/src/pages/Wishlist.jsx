import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/api";
import "../styles/Wishlist.css";

import { CartContext } from "../context/CartContext";

function Wishlist() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const {
        setCartCount
    } = useContext(CartContext);

    const [wishlist, setWishlist] = useState([]);

    const [loading, setLoading] = useState(true);

    const [addingProduct, setAddingProduct] =
        useState(null);


    // =====================================================
    // LOAD WISHLIST
    // =====================================================

    useEffect(() => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (!user) {

            navigate("/login");

            return;

        }

        fetchWishlist();

    }, []);


    // =====================================================
    // FETCH WISHLIST
    // =====================================================

    const fetchWishlist = async () => {

        try {

            setLoading(true);

            const response = await API.get(
                `/api/wishlist/${user.id}`
            );

            console.log(
                "Wishlist Response:",
                response.data
            );

            if (Array.isArray(response.data)) {

                setWishlist(
                    response.data
                );

            }
            else {

                setWishlist([]);

            }

        }

        catch (error) {

            console.log(
                "Wishlist Error:",
                error
            );

            if (error.response) {

                console.log(
                    "Server Response:",
                    error.response.data
                );

            }

            setWishlist([]);

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // GET PRODUCT ID
    // =====================================================
    // Wishlist record ID and Product ID can be different.
    //
    // We first try product_id.
    // Then product.id if nested object exists.
    // Finally fall back to id.
    // =====================================================

    const getProductId = (item) => {

        return (
            item.product_id ||
            item.product?.id ||
            item.productId ||
            item.id
        );

    };


    // =====================================================
    // GET WISHLIST ID
    // =====================================================

    const getWishlistId = (item) => {

        return (
            item.wishlist_id ||
            item.wishlistId ||
            item.id
        );

    };


    // =====================================================
    // VIEW PRODUCT DETAILS
    // =====================================================

    const viewDetails = (item) => {

        const productId =
            getProductId(item);

        console.log(
            "Opening Product ID:",
            productId
        );

        if (!productId) {

            alert(
                "Unable to identify this product."
            );

            return;

        }

        navigate(
            `/product/${productId}`
        );

    };


    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = async (item) => {

        if (!user) {

            alert(
                "Please Login First."
            );

            navigate("/login");

            return;

        }


        const productId =
            getProductId(item);


        if (!productId) {

            alert(
                "Unable to identify this product."
            );

            return;

        }


        // ---------------------------------------------
        // CHECK STOCK
        // ---------------------------------------------

        if (
            Number(item.stock) <= 0
        ) {

            alert(
                "This product is currently out of stock."
            );

            return;

        }


        try {

            setAddingProduct(
                productId
            );


            console.log(
                "Adding Product To Cart:",
                productId
            );


            // -----------------------------------------
            // ADD PRODUCT
            // -----------------------------------------

            const response =
                await API.post(

                    "/api/cart/add",

                    {
                        user_id: user.id,

                        product_id: productId
                    }

                );


            console.log(
                "Cart Response:",
                response.data
            );


            // -----------------------------------------
            // SHOW SERVER MESSAGE
            // -----------------------------------------

            if (
                response.data &&
                response.data.message
            ) {

                alert(
                    response.data.message
                );

            }
            else {

                alert(
                    "Product added to cart."
                );

            }


            // -----------------------------------------
            // REFRESH CART COUNT
            // -----------------------------------------

            try {

                const countResponse =
                    await API.get(

                        `/api/cart/count/${user.id}`

                    );


                if (
                    countResponse.data &&
                    countResponse.data.count !== undefined
                ) {

                    setCartCount(
                        countResponse.data.count
                    );

                }

            }

            catch (countError) {

                console.log(
                    "Cart Count Error:",
                    countError
                );

            }

        }

        catch (error) {

            console.log(
                "Add To Cart Error:",
                error
            );


            if (error.response) {

                console.log(
                    "Server Error:",
                    error.response.data
                );


                if (
                    error.response.data &&
                    error.response.data.message
                ) {

                    alert(
                        error.response.data.message
                    );

                }
                else {

                    alert(
                        "Unable to add product to cart."
                    );

                }

            }

            else {

                alert(
                    "Unable to connect to server."
                );

            }

        }

        finally {

            setAddingProduct(null);

        }

    };


    // =====================================================
    // REMOVE FROM WISHLIST
    // =====================================================

    const removeWishlist = async (item) => {

        const wishlistId =
            getWishlistId(item);


        if (!wishlistId) {

            alert(
                "Unable to identify wishlist item."
            );

            return;

        }


        const confirmDelete =
            window.confirm(

                "Remove this product from Wishlist?"

            );


        if (!confirmDelete) {

            return;

        }


        try {

            console.log(
                "Removing Wishlist ID:",
                wishlistId
            );


            await API.delete(

                `/api/wishlist/remove/${wishlistId}`

            );


            // -----------------------------------------
            // REMOVE FROM UI
            // -----------------------------------------

            setWishlist(

                (prev) =>

                    prev.filter(

                        (wishlistItem) =>

                            getWishlistId(
                                wishlistItem
                            ) !== wishlistId

                    )

            );


            alert(
                "Product removed from Wishlist."
            );

        }

        catch (error) {

            console.log(
                "Remove Wishlist Error:",
                error
            );


            if (error.response) {

                console.log(
                    "Server Response:",
                    error.response.data
                );


                if (
                    error.response.data &&
                    error.response.data.message
                ) {

                    alert(
                        error.response.data.message
                    );

                }

                else {

                    alert(
                        "Unable to remove product."
                    );

                }

            }

            else {

                alert(
                    "Unable to connect to server."
                );

            }

        }

    };


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

            <div className="wishlist-loading">

                <div className="wishlist-loading-box">

                    <div className="wishlist-spinner">
                    </div>

                    <h2>
                        Loading Wishlist...
                    </h2>

                    <p>
                        Please wait while we load your favourite products.
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="wishlist-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="wishlist-header">

                <h1>

                    ❤️ My Wishlist

                </h1>

                <p>

                    Save your favourite products for later.

                </p>


                {

                    wishlist.length > 0 && (

                        <div className="wishlist-count">

                            {wishlist.length}

                            {" "}

                            {wishlist.length === 1
                                ? "Product"
                                : "Products"
                            }

                            {" "}Saved

                        </div>

                    )

                }

            </div>



            {/* =================================================
                WISHLIST PRODUCTS
            ================================================= */}

            {

                wishlist.length > 0

                    ?

                    (

                        <div className="wishlist-grid">

                            {

                                wishlist.map(
                                    (item) => {

                                        const productId =
                                            getProductId(item);

                                        const wishlistId =
                                            getWishlistId(item);

                                        const isAdding =
                                            addingProduct ===
                                            productId;


                                        return (

                                            <div
                                                className="wishlist-card"
                                                key={wishlistId}
                                            >


                                                {/* =================================
                                                    PRODUCT IMAGE
                                                ================================= */}

                                                <div
                                                    className="wishlist-image"
                                                    onClick={() =>
                                                        viewDetails(item)
                                                    }
                                                >

                                                    <img
                                                        src={
                                                            item.image
                                                        }
                                                        alt={
                                                            item.name ||
                                                            "Product"
                                                        }
                                                    />


                                                    <div className="wishlist-heart">

                                                        ❤️

                                                    </div>

                                                </div>



                                                {/* =================================
                                                    PRODUCT DETAILS
                                                ================================= */}

                                                <div className="wishlist-info">


                                                    {/* CATEGORY */}

                                                    <span className="wishlist-category">

                                                        {
                                                            item.category ||
                                                            "General"
                                                        }

                                                    </span>



                                                    {/* NAME */}

                                                    <h2
                                                        onClick={() =>
                                                            viewDetails(item)
                                                        }
                                                    >

                                                        {
                                                            item.name ||
                                                            "Product"
                                                        }

                                                    </h2>



                                                    {/* DESCRIPTION */}

                                                    <p>

                                                        {

                                                            item.description

                                                                ?

                                                                item.description.length > 120

                                                                    ?

                                                                    item.description.substring(
                                                                        0,
                                                                        120
                                                                    ) + "..."

                                                                    :

                                                                    item.description

                                                                :

                                                                "Premium quality product."

                                                        }

                                                    </p>



                                                    {/* PRICE */}

                                                    <div className="wishlist-price">

                                                        ₹ {item.price}

                                                    </div>



                                                    {/* STOCK */}

                                                    <div className="wishlist-stock">

                                                        {

                                                            Number(item.stock) > 0

                                                                ?

                                                                (

                                                                    <span className="stock-available">

                                                                        ✅ In Stock

                                                                        {

                                                                            Number(item.stock) <= 5 && (

                                                                                <>

                                                                                    {" "}
                                                                                    ({item.stock} left)

                                                                                </>

                                                                            )

                                                                        }

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


                                                </div>



                                                {/* =================================
                                                    ACTION BUTTONS
                                                ================================= */}

                                                <div className="wishlist-actions">


                                                    {/* VIEW DETAILS */}

                                                    <button

                                                        type="button"

                                                        className="details-btn"

                                                        onClick={() =>
                                                            viewDetails(item)
                                                        }

                                                    >

                                                        👁 View Details

                                                    </button>



                                                    {/* ADD TO CART */}

                                                    <button

                                                        type="button"

                                                        className="cart-btn"

                                                        disabled={
                                                            Number(item.stock) <= 0 ||
                                                            isAdding
                                                        }

                                                        onClick={() =>
                                                            addToCart(item)
                                                        }

                                                    >

                                                        {

                                                            isAdding

                                                                ?

                                                                "Adding..."

                                                                :

                                                                "🛒 Add To Cart"

                                                        }

                                                    </button>



                                                    {/* REMOVE */}

                                                    <button

                                                        type="button"

                                                        className="remove-btn"

                                                        onClick={() =>
                                                            removeWishlist(item)
                                                        }

                                                    >

                                                        🗑 Remove

                                                    </button>


                                                </div>


                                            </div>

                                        );

                                    }

                                )

                            }

                        </div>

                    )

                    :

                    (

                        /* =================================================
                           EMPTY WISHLIST
                        ================================================= */

                        <div className="wishlist-empty">


                            <div className="wishlist-empty-icon">

                                ❤️

                            </div>


                            <h2>

                                Your Wishlist is Empty

                            </h2>


                            <p>

                                Looks like you haven't added any products yet.

                            </p>


                            <button

                                type="button"

                                className="continue-shopping-btn"

                                onClick={() =>
                                    navigate("/products")
                                }

                            >

                                🛍 Continue Shopping

                            </button>


                        </div>

                    )

            }

        </div>

    );

}

export default Wishlist;