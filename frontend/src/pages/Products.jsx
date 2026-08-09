import {
    useContext,
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import API from "../api/api";

import "../styles/Products.css";

import {
    CartContext
} from "../context/CartContext";


function Products() {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] =
        useSearchParams();


    // =====================================================
    // PRODUCTS
    // =====================================================

    const [products, setProducts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);


    // =====================================================
    // FILTER STATES
    // =====================================================

    const [search, setSearch] =
        useState(
            searchParams.get("search") || ""
        );

    const [searchInput, setSearchInput] =
        useState(
            searchParams.get("search") || ""
        );

    const [category, setCategory] =
        useState(
            searchParams.get("category") || "All"
        );

    const [sort, setSort] =
        useState("");

    const [minPrice, setMinPrice] =
        useState("");

    const [maxPrice, setMaxPrice] =
        useState("");

    const [stock, setStock] =
        useState("");


    // =====================================================
    // PAGINATION
    // =====================================================

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalProducts, setTotalProducts] =
        useState(0);


    // =====================================================
    // UI
    // =====================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // USER
    // =====================================================

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // =====================================================
    // CART CONTEXT
    // =====================================================

    const {
        setCartCount
    } = useContext(CartContext);


    // =====================================================
    // READ URL PARAMETERS
    // =====================================================

    useEffect(() => {

        const urlSearch =
            searchParams.get("search") || "";

        const urlCategory =
            searchParams.get("category") || "All";


        setSearchInput(urlSearch);

        setSearch(urlSearch);

        setCategory(urlCategory);

        setPage(1);

    }, [searchParams]);


    // =====================================================
    // SEARCH DEBOUNCE
    // =====================================================

    useEffect(() => {

        const timer = setTimeout(() => {

            const value =
                searchInput.trim();


            setSearch(value);

            setPage(1);


            // Keep URL synchronized
            const params = {};

            if (value) {
                params.search = value;
            }

            if (
                category &&
                category !== "All"
            ) {
                params.category = category;
            }


            // Only update URL if it is different
            const currentSearch =
                searchParams.get("search") || "";

            const currentCategory =
                searchParams.get("category") || "All";


            if (
                currentSearch !== value ||
                currentCategory !== category
            ) {

                setSearchParams(
                    params,
                    {
                        replace: true
                    }
                );
            }

        }, 500);


        return () => {
            clearTimeout(timer);
        };

    }, [
        searchInput
    ]);


    // =====================================================
    // FETCH PRODUCTS WHEN FILTERS CHANGE
    // =====================================================

    useEffect(() => {

        fetchProducts();

    }, [
        search,
        category,
        sort,
        minPrice,
        maxPrice,
        stock,
        page
    ]);


    // =====================================================
    // FETCH CATEGORIES
    // =====================================================

    useEffect(() => {

        fetchCategories();

    }, []);


    // =====================================================
    // FETCH PRODUCTS
    // =====================================================

    const fetchProducts = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await API.get(
                    "/api/products",
                    {
                        params: {

                            search:
                                search.trim(),

                            category:
                                category === "All"
                                    ? ""
                                    : category,

                            sort,

                            min_price:
                                minPrice,

                            max_price:
                                maxPrice,

                            stock,

                            page,

                            limit: 100
                        }
                    }
                );


            // =================================================
            // PRODUCTS
            // =================================================

            const productData =
                Array.isArray(
                    response.data.products
                )
                    ? response.data.products
                    : [];


            setProducts(
                productData
            );


            // =================================================
            // TOTAL PAGES
            // =================================================

            const pages =
                Number(
                    response.data.pages
                ) || 1;


            setTotalPages(
                pages
            );


            // =================================================
            // TOTAL PRODUCTS
            // =================================================

            if (
                response.data.total !==
                undefined
            ) {

                setTotalProducts(
                    Number(
                        response.data.total
                    )
                );

            }
            else {

                setTotalProducts(
                    productData.length
                );

            }

        }
        catch (error) {

            console.log(
                "Products Error:",
                error
            );


            setProducts([]);

            setTotalPages(1);

            setTotalProducts(0);


            setError(
                "Unable to load products. Please try again."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FETCH CATEGORIES
    // =====================================================

    const fetchCategories = async () => {

        try {

            const response =
                await API.get(
                    "/api/categories"
                );


            if (
                Array.isArray(
                    response.data
                )
            ) {

                setCategories(
                    response.data
                );

            }
            else {

                setCategories([]);

            }

        }
        catch (error) {

            console.log(
                "Category Error:",
                error
            );

            setCategories([]);

        }

    };


    // =====================================================
    // SEARCH CHANGE
    // =====================================================

    const handleSearchChange = (e) => {

        setSearchInput(
            e.target.value
        );

    };


    // =====================================================
    // MIN PRICE
    // =====================================================

    const handleMinPriceChange = (e) => {

        const value =
            e.target.value;


        if (value === "") {

            setMinPrice("");

            setPage(1);

            return;

        }


        if (
            Number(value) < 0
        ) {

            return;

        }


        setMinPrice(value);

        setPage(1);

    };


    // =====================================================
    // MAX PRICE
    // =====================================================

    const handleMaxPriceChange = (e) => {

        const value =
            e.target.value;


        if (value === "") {

            setMaxPrice("");

            setPage(1);

            return;

        }


        if (
            Number(value) < 0
        ) {

            return;

        }


        setMaxPrice(value);

        setPage(1);

    };


    // =====================================================
    // CATEGORY CHANGE
    // =====================================================

    const handleCategoryChange = (e) => {

        const value =
            e.target.value;


        setCategory(value);

        setPage(1);


        const params = {};


        if (
            searchInput.trim()
        ) {

            params.search =
                searchInput.trim();

        }


        if (
            value &&
            value !== "All"
        ) {

            params.category =
                value;

        }


        setSearchParams(
            params,
            {
                replace: true
            }
        );

    };


    // =====================================================
    // SORT CHANGE
    // =====================================================

    const handleSortChange = (e) => {

        setSort(
            e.target.value
        );

        setPage(1);

    };


    // =====================================================
    // STOCK CHANGE
    // =====================================================

    const handleStockChange = (e) => {

        setStock(
            e.target.value
        );

        setPage(1);

    };


    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {

        setSearch("");

        setSearchInput("");

        setCategory("All");

        setSort("");

        setMinPrice("");

        setMaxPrice("");

        setStock("");

        setPage(1);

        setError("");


        setSearchParams(
            {},
            {
                replace: true
            }
        );

    };


    // =====================================================
    // INVALID PRICE RANGE
    // =====================================================

    const invalidPriceRange =

        minPrice !== "" &&

        maxPrice !== "" &&

        Number(minPrice) >
        Number(maxPrice);


    // =====================================================
    // ACTIVE FILTER COUNT
    // =====================================================

    const activeFilterCount = [

        search,

        category !== "All"
            ? category
            : "",

        minPrice,

        maxPrice,

        stock,

        sort

    ].filter(
        value => value !== ""
    ).length;


    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = async (
        productId
    ) => {

        if (!user) {

            alert(
                "Please Login First"
            );

            return;

        }


        try {

            const response =
                await API.post(
                    "/api/cart/add",
                    {
                        user_id:
                            user.id,

                        product_id:
                            productId
                    }
                );


            alert(
                response.data.message
            );


            setCartCount(
                prev => prev + 1
            );


            fetchProducts();

        }
        catch (error) {

            console.log(error);


            if (
                error.response
            ) {

                alert(
                    error.response
                        .data
                        .message
                );

            }
            else {

                alert(
                    "Unable to add product to cart."
                );

            }

        }

    };


    // =====================================================
    // ADD TO WISHLIST
    // =====================================================

    const addToWishlist = async (
        productId
    ) => {

        if (!user) {

            alert(
                "Please Login First"
            );

            return;

        }


        try {

            const response =
                await API.post(
                    "/api/wishlist/add",
                    {
                        user_id:
                            user.id,

                        product_id:
                            productId
                    }
                );


            alert(
                response.data.message
            );

        }
        catch (error) {

            console.log(error);


            if (
                error.response
            ) {

                alert(
                    error.response
                        .data
                        .message
                );

            }
            else {

                alert(
                    "Unable to add product to wishlist."
                );

            }

        }

    };


    // =====================================================
    // IMAGE ERROR
    // =====================================================

    const handleImageError = (e) => {

        e.target.onerror = null;

        e.target.src =
            "https://via.placeholder.com/500x500?text=No+Image";

    };


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const changePage = (
        newPage
    ) => {

        if (
            newPage < 1 ||
            newPage > totalPages
        ) {

            return;

        }


        setPage(
            newPage
        );


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };


    // =====================================================
    // PAGE NUMBERS
    // =====================================================

    const getPageNumbers = () => {

        const pages = [];

        const maxVisiblePages = 5;


        if (
            totalPages <=
            maxVisiblePages
        ) {

            for (
                let i = 1;
                i <= totalPages;
                i++
            ) {

                pages.push(i);

            }

            return pages;

        }


        let startPage =
            Math.max(
                1,
                page - 2
            );


        let endPage =
            Math.min(
                totalPages,
                startPage + 4
            );


        if (
            endPage -
            startPage <
            4
        ) {

            startPage =
                Math.max(
                    1,
                    endPage - 4
                );

        }


        for (
            let i = startPage;
            i <= endPage;
            i++
        ) {

            pages.push(i);

        }


        return pages;

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="products-page">


            {/* =========================================
                PAGE HEADER
            ========================================= */}

            <div className="products-header">

                <h1>
                    🛍 Our Products
                </h1>

                <p>
                    Discover the latest gadgets,
                    accessories and electronics.
                </p>

            </div>


            {/* =========================================
                FILTER BAR
            ========================================= */}

            <div className="filter-bar">


                {/* SEARCH */}

                <div className="filter-item">

                    <label>
                        🔍 Search
                    </label>

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={
                            handleSearchChange
                        }
                    />

                </div>


                {/* CATEGORY */}

                <div className="filter-item">

                    <label>
                        🏷️ Category
                    </label>

                    <select
                        value={category}
                        onChange={
                            handleCategoryChange
                        }
                    >

                        <option value="All">
                            All Categories
                        </option>


                        {
                            categories.map(
                                (
                                    cat,
                                    index
                                ) => (

                                    <option
                                        key={index}
                                        value={cat}
                                    >
                                        {cat}
                                    </option>

                                )
                            )
                        }

                    </select>

                </div>


                {/* MIN PRICE */}

                <div className="filter-item">

                    <label>
                        💰 Min Price
                    </label>

                    <input
                        type="number"
                        min="0"
                        placeholder="₹ 0"
                        value={minPrice}
                        onChange={
                            handleMinPriceChange
                        }
                    />

                </div>


                {/* MAX PRICE */}

                <div className="filter-item">

                    <label>
                        💰 Max Price
                    </label>

                    <input
                        type="number"
                        min="0"
                        placeholder="₹ 100000"
                        value={maxPrice}
                        onChange={
                            handleMaxPriceChange
                        }
                    />

                </div>


                {/* STOCK */}

                <div className="filter-item">

                    <label>
                        📦 Stock
                    </label>

                    <select
                        value={stock}
                        onChange={
                            handleStockChange
                        }
                    >

                        <option value="">
                            All
                        </option>

                        <option value="in">
                            In Stock
                        </option>

                        <option value="out">
                            Out Of Stock
                        </option>

                    </select>

                </div>


                {/* SORT */}

                <div className="filter-item">

                    <label>
                        ↕️ Sort
                    </label>

                    <select
                        value={sort}
                        onChange={
                            handleSortChange
                        }
                    >

                        <option value="">
                            Default
                        </option>

                        <option value="asc">
                            Price Low → High
                        </option>

                        <option value="desc">
                            Price High → Low
                        </option>

                        <option value="new">
                            New Arrivals
                        </option>

                    </select>

                </div>


                {/* RESET */}

                <div className="filter-action">

                    <button
                        className="reset-btn"
                        onClick={
                            resetFilters
                        }
                    >
                        🔄 Reset Filters
                    </button>

                </div>

            </div>


            {/* =========================================
                ACTIVE FILTER INFORMATION
            ========================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "20px"
                }}
            >

                <div
                    style={{
                        color: "#64748b",
                        fontSize: "14px",
                        fontWeight: "600"
                    }}
                >

                    {
                        loading
                            ? "Loading products..."
                            : `Showing ${
                                products.length
                            } product${
                                products.length !== 1
                                    ? "s"
                                    : ""
                            }`
                    }

                    {
                        totalProducts > 0 &&
                        !loading
                            ? ` • ${totalProducts} total`
                            : ""
                    }

                </div>


                {
                    activeFilterCount > 0 &&

                    <div
                        style={{
                            background: "#eff6ff",
                            color: "#2563eb",
                            border: "1px solid #dbeafe",
                            borderRadius: "20px",
                            padding: "7px 13px",
                            fontSize: "12px",
                            fontWeight: "700"
                        }}
                    >

                        🔎 {activeFilterCount}
                        {" "}
                        Active Filter
                        {
                            activeFilterCount > 1
                                ? "s"
                                : ""
                        }

                    </div>
                }

            </div>


            {/* =========================================
                INVALID PRICE
            ========================================= */}

            {
                invalidPriceRange &&

                <div
                    style={{
                        background: "#fee2e2",
                        color: "#b91c1c",
                        border: "1px solid #fecaca",
                        borderRadius: "10px",
                        padding: "12px 15px",
                        marginBottom: "20px",
                        fontSize: "14px",
                        fontWeight: "600",
                        textAlign: "center"
                    }}
                >

                    ⚠️ Minimum price cannot
                    be greater than maximum
                    price.

                </div>
            }


            {/* =========================================
                ERROR
            ========================================= */}

            {
                error &&

                <div
                    style={{
                        background: "#fee2e2",
                        color: "#b91c1c",
                        border: "1px solid #fecaca",
                        borderRadius: "10px",
                        padding: "14px",
                        marginBottom: "20px",
                        textAlign: "center",
                        fontWeight: "600"
                    }}
                >

                    {error}

                    <br />

                    <button
                        onClick={
                            fetchProducts
                        }
                        style={{
                            marginTop: "8px",
                            padding: "7px 14px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#dc2626",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Try Again
                    </button>

                </div>
            }


            {/* =========================================
                PRODUCTS GRID
            ========================================= */}

            <div className="products-grid">


                {
                    loading

                        ?

                        Array.from(
                            { length: 8 }
                        ).map(
                            (_, index) => (

                                <div
                                    className="product-card"
                                    key={`loading-${index}`}
                                    style={{
                                        opacity: 0.65
                                    }}
                                >

                                    <div
                                        className="product-image"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >

                                        <div
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                borderRadius: "50%",
                                                border: "6px solid #e5e7eb",
                                                borderTopColor: "#2563eb",
                                                animation:
                                                    "productsSpin 0.8s linear infinite"
                                            }}
                                        />

                                    </div>


                                    <div className="product-content">

                                        <div
                                            style={{
                                                height: "15px",
                                                width: "70%",
                                                background: "#e5e7eb",
                                                borderRadius: "5px",
                                                marginBottom: "15px"
                                            }}
                                        />

                                        <div
                                            style={{
                                                height: "20px",
                                                width: "90%",
                                                background: "#e5e7eb",
                                                borderRadius: "5px",
                                                marginBottom: "12px"
                                            }}
                                        />

                                        <div
                                            style={{
                                                height: "45px",
                                                width: "100%",
                                                background: "#f1f5f9",
                                                borderRadius: "5px"
                                            }}
                                        />

                                    </div>

                                </div>

                            )
                        )

                        :

                        products.length > 0

                            ?

                            products.map(
                                product => (

                                    <div
                                        className="product-card"
                                        key={product.id}
                                    >


                                        {/* IMAGE */}

                                        <div className="product-image">

                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                onError={
                                                    handleImageError
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        `/product/${product.id}`
                                                    )
                                                }
                                            />


                                            <button
                                                className="wishlist-btn"
                                                onClick={() =>
                                                    addToWishlist(
                                                        product.id
                                                    )
                                                }
                                                title="Add to Wishlist"
                                                aria-label="Add to Wishlist"
                                            >
                                                ❤
                                            </button>

                                        </div>


                                        {/* CONTENT */}

                                        <div className="product-content">


                                            <span className="category-badge">

                                                {
                                                    product.category
                                                }

                                            </span>


                                            <h2
                                                onClick={() =>
                                                    navigate(
                                                        `/product/${product.id}`
                                                    )
                                                }
                                            >

                                                {
                                                    product.name
                                                }

                                            </h2>


                                            <p className="description">

                                                {
                                                    product.description ||
                                                    "Premium quality product."
                                                }

                                            </p>


                                            <h3>

                                                ₹ {product.price}

                                            </h3>


                                            {/* STOCK */}

                                            {
                                                Number(
                                                    product.stock
                                                ) === 0

                                                    ?

                                                    (

                                                        <div className="stock-badge out">

                                                            ❌ Out Of Stock

                                                        </div>

                                                    )

                                                    :

                                                    Number(
                                                        product.stock
                                                    ) <= 5

                                                        ?

                                                        (

                                                            <div className="stock-badge low">

                                                                ⚠ Only{" "}
                                                                {
                                                                    product.stock
                                                                }
                                                                {" "}
                                                                Left

                                                            </div>

                                                        )

                                                        :

                                                        (

                                                            <div className="stock-badge in">

                                                                ✅ In Stock (
                                                                {
                                                                    product.stock
                                                                }
                                                                )

                                                            </div>

                                                        )
                                            }


                                            {/* BUTTONS */}

                                            <div className="card-buttons">


                                                <button
                                                    className="cart-btn"
                                                    disabled={
                                                        Number(
                                                            product.stock
                                                        ) === 0
                                                    }
                                                    onClick={() =>
                                                        addToCart(
                                                            product.id
                                                        )
                                                    }
                                                >

                                                    {
                                                        Number(
                                                            product.stock
                                                        ) === 0

                                                            ?

                                                            "Out Of Stock"

                                                            :

                                                            "🛒 Add To Cart"
                                                    }

                                                </button>


                                                <button
                                                    className="details-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/product/${product.id}`
                                                        )
                                                    }
                                                >
                                                    👁 View Details
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )

                            :

                            (

                                <div className="no-products">

                                    <div
                                        style={{
                                            fontSize: "55px",
                                            marginBottom: "15px"
                                        }}
                                    >
                                        🔍
                                    </div>

                                    <h2>
                                        😔 No Products Found
                                    </h2>

                                    <p>
                                        Try changing your
                                        filters or search
                                        keywords.
                                    </p>

                                    <button
                                        className="reset-btn"
                                        style={{
                                            maxWidth: "180px",
                                            marginTop: "20px"
                                        }}
                                        onClick={
                                            resetFilters
                                        }
                                    >
                                        🔄 Clear Filters
                                    </button>

                                </div>

                            )

                }

            </div>


            {/* =========================================
                PAGINATION
            ========================================= */}

            {
                !loading &&
                products.length > 0 &&
                totalPages > 1 &&

                <div className="pagination">


                    <button
                        disabled={page === 1}
                        onClick={() =>
                            changePage(
                                page - 1
                            )
                        }
                    >
                        ⬅ Previous
                    </button>


                    {
                        page > 3 &&
                        totalPages > 5 &&

                        <>

                            <button
                                onClick={() =>
                                    changePage(1)
                                }
                            >
                                1
                            </button>

                            <span
                                style={{
                                    padding: "0 4px",
                                    color: "#64748b",
                                    fontWeight: "700"
                                }}
                            >
                                ...
                            </span>

                        </>
                    }


                    {
                        getPageNumbers().map(
                            pageNumber => (

                                <button
                                    key={pageNumber}
                                    className={
                                        page === pageNumber
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        changePage(
                                            pageNumber
                                        )
                                    }
                                >
                                    {pageNumber}
                                </button>

                            )
                        )
                    }


                    {
                        page <
                            totalPages - 2 &&
                        totalPages > 5 &&

                        <>

                            <span
                                style={{
                                    padding: "0 4px",
                                    color: "#64748b",
                                    fontWeight: "700"
                                }}
                            >
                                ...
                            </span>

                            <button
                                onClick={() =>
                                    changePage(
                                        totalPages
                                    )
                                }
                            >
                                {totalPages}
                            </button>

                        </>
                    }


                    <button
                        disabled={
                            page === totalPages
                        }
                        onClick={() =>
                            changePage(
                                page + 1
                            )
                        }
                    >
                        Next ➡
                    </button>

                </div>
            }


            {/* =========================================
                LOADING ANIMATION
            ========================================= */}

            <style>

                {`

                    @keyframes productsSpin {

                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }

                    }

                `}

            </style>

        </div>

    );

}


export default Products;