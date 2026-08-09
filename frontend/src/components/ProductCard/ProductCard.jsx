import "./ProductCard.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { CartContext } from "../../context/CartContext";

function ProductCard() {

    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const { setCartCount } =
        useContext(CartContext);

    useEffect(() => {

        fetchLatestProducts();

    }, []);

    const fetchLatestProducts = async () => {

        try {

            const response = await API.get(
                "/api/products",
                {
                    params: {
                        sort: "new",
                        limit: 5,
                        page: 1
                    }
                }
            );

            setProducts(
                response.data.products
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    const addToCart = async (productId) => {

        if (!user) {

            alert("Please Login First");

            return;

        }

        try {

            const response = await API.post(
                "/api/cart/add",
                {
                    user_id: user.id,
                    product_id: productId
                }
            );

            alert(response.data.message);

            setCartCount(prev => prev + 1);

        }

        catch (error) {

            if (error.response) {

                alert(
                    error.response.data.message
                );

            }

        }

    };

    const addToWishlist = async (productId) => {

        if (!user) {

            alert("Please Login First");

            return;

        }

        try {

            const response = await API.post(
                "/api/wishlist/add",
                {
                    user_id: user.id,
                    product_id: productId
                }
            );

            alert(response.data.message);

        }

        catch (error) {

            if (error.response) {

                alert(
                    error.response.data.message
                );

            }

        }

    };

    return (

        <section className="latest-products-section">

            {/* =========================================
                SECTION HEADER
            ========================================= */}

            <div className="section-header">

                <div>

                    <span className="section-label">
                        SHOP NOW
                    </span>

                    <h2>
                        🔥 Latest Products
                    </h2>

                    <p>
                        Discover our newest products and
                        latest arrivals.
                    </p>

                </div>

                <button
                    className="view-all-btn"
                    type="button"
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    View All →
                </button>

            </div>


            {/* =========================================
                PRODUCT GRID
            ========================================= */}

            <div className="product-grid">

                {
                    products.length > 0

                    ?

                    (

                        products.map((product) => (

                            <article
                                className="product-card"
                                key={product.id}
                            >

                                {/* =================================
                                    PRODUCT IMAGE
                                ================================= */}

                                <div className="product-image">

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        onClick={() =>
                                            navigate(
                                                `/product/${product.id}`
                                            )
                                        }
                                    />

                                    <span className="new-badge">
                                        NEW
                                    </span>

                                    <button
                                        type="button"
                                        className="wishlist-btn"
                                        aria-label="Add to wishlist"
                                        onClick={() =>
                                            addToWishlist(
                                                product.id
                                            )
                                        }
                                    >
                                        ❤️
                                    </button>

                                </div>


                                {/* =================================
                                    PRODUCT CONTENT
                                ================================= */}

                                <div className="product-content">

                                    <span className="category-badge">
                                        {product.category}
                                    </span>


                                    <h3
                                        onClick={() =>
                                            navigate(
                                                `/product/${product.id}`
                                            )
                                        }
                                    >
                                        {product.name}
                                    </h3>


                                    <div className="rating">
                                        ⭐⭐⭐⭐⭐
                                    </div>


                                    <p className="product-description">

                                        {product.description}

                                    </p>


                                    <div className="price-row">

                                        <h2>
                                            ₹ {product.price}
                                        </h2>

                                    </div>


                                    {
                                        product.stock > 0

                                        ?

                                        (

                                            <span className="stock in">
                                                ✅ In Stock
                                            </span>

                                        )

                                        :

                                        (

                                            <span className="stock out">
                                                ❌ Out Of Stock
                                            </span>

                                        )
                                    }


                                    {/* =================================
                                        BUTTONS
                                    ================================= */}

                                    <div className="buttons">

                                        <button
                                            type="button"
                                            className="cart-btn"
                                            disabled={
                                                product.stock === 0
                                            }
                                            onClick={() =>
                                                addToCart(
                                                    product.id
                                                )
                                            }
                                        >

                                            {
                                                product.stock === 0

                                                ?

                                                "Out Of Stock"

                                                :

                                                "🛒 Add To Cart"
                                            }

                                        </button>


                                        <button
                                            type="button"
                                            className="details-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/product/${product.id}`
                                                )
                                            }
                                        >
                                            View Details
                                        </button>

                                    </div>

                                </div>

                            </article>

                        ))

                    )

                    :

                    (

                        <div className="no-products">

                            <h2>
                                No Products Found
                            </h2>

                            <p>
                                Please check again later.
                            </p>

                        </div>

                    )
                }

            </div>

        </section>

    );

}

export default ProductCard;