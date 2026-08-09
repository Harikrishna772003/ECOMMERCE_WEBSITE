import {
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";

import "./Navbar.css";

import API from "../../api/api";

import {
    CartContext
} from "../../context/CartContext";

import NotificationBell
    from "../NotificationBell";


function Navbar() {

    // ==========================
    // USER
    // ==========================

    let user = null;

    try {

        user = JSON.parse(
            localStorage.getItem("user")
        );

    }
    catch {

        user = null;

    }


    const navigate = useNavigate();

    const location = useLocation();


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

    const [search, setSearch] =
        useState("");

    const [categories, setCategories] =
        useState([]);

    const [showCategories, setShowCategories] =
        useState(false);

    const [showProfile, setShowProfile] =
        useState(false);

    const [mobileMenu, setMobileMenu] =
        useState(false);


    // ==========================
    // REFS
    // ==========================

    const categoryRef =
        useRef(null);

    const profileRef =
        useRef(null);


    // ==========================
    // INITIAL LOAD
    // ==========================

    useEffect(() => {

        fetchCategories();

        if (user) {

            fetchCartCount();

        }

    }, []);


    // ==========================
    // CLICK OUTSIDE
    // ==========================

    useEffect(() => {

        const handleClickOutside =
            (event) => {

                if (
                    categoryRef.current &&
                    !categoryRef.current.contains(
                        event.target
                    )
                ) {

                    setShowCategories(false);

                }


                if (
                    profileRef.current &&
                    !profileRef.current.contains(
                        event.target
                    )
                ) {

                    setShowProfile(false);

                }

            };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // ==========================
    // FETCH CATEGORIES
    // ==========================

    const fetchCategories =
        async () => {

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
                    "Category Error",
                    error
                );

                setCategories([]);

            }

        };


    // ==========================
    // FETCH CART COUNT
    // ==========================

    const fetchCartCount =
        async () => {

            try {

                const response =
                    await API.get(
                        `/api/cart/count/${user.id}`
                    );


                setCartCount(
                    response.data.count
                );

            }
            catch (error) {

                console.log(
                    "Cart Error",
                    error
                );

            }

        };


    // =====================================================
    // FIND CATEGORY FROM SEARCH KEYWORD
    // =====================================================

    const findCategoryFromSearch =
        (keyword) => {

            const value =
                keyword
                    .trim()
                    .toLowerCase();


            if (!value) {

                return null;

            }


            // -------------------------------------------------
            // 1. EXACT CATEGORY MATCH
            // -------------------------------------------------

            const exactCategory =
                categories.find(
                    (category) =>
                        String(category)
                            .trim()
                            .toLowerCase() === value
                );


            if (exactCategory) {

                return exactCategory;

            }


            // -------------------------------------------------
            // 2. MOBILE CATEGORY ALIAS
            // -------------------------------------------------
            //
            // Your Home page uses "Mobiles",
            // while the backend may use "smartphones".
            //
            // Example:
            //
            // Mobiles
            //      ↓
            // smartphones
            //
            // -------------------------------------------------

            if (
                value === "mobile" ||
                value === "mobiles"
            ) {

                const mobileCategory =
                    categories.find(
                        (category) => {

                            const categoryName =
                                String(category)
                                    .trim()
                                    .toLowerCase();

                            return (
                                categoryName ===
                                    "smartphones" ||
                                categoryName ===
                                    "smartphone" ||
                                categoryName ===
                                    "mobile" ||
                                categoryName ===
                                    "mobiles"
                            );

                        }
                    );


                if (mobileCategory) {

                    return mobileCategory;

                }

            }


            // -------------------------------------------------
            // 3. PARTIAL CATEGORY MATCH
            // -------------------------------------------------

            const partialCategory =
                categories.find(
                    (category) => {

                        const categoryName =
                            String(category)
                                .trim()
                                .toLowerCase();

                        return (
                            categoryName.includes(value) ||
                            value.includes(categoryName)
                        );

                    }
                );


            if (partialCategory) {

                return partialCategory;

            }


            return null;

        };


    // ==========================
    // SEARCH
    // ==========================

    const handleSearch =
        () => {

            const keyword =
                search.trim();


            // ---------------------------------
            // EMPTY SEARCH
            // ---------------------------------

            if (!keyword) {

                navigate("/products");

                setMobileMenu(false);

                return;

            }


            // ---------------------------------
            // CHECK CATEGORY
            // ---------------------------------

            const matchedCategory =
                findCategoryFromSearch(
                    keyword
                );


            // ---------------------------------
            // CATEGORY SEARCH
            // ---------------------------------

            if (matchedCategory) {

                navigate(
                    `/products?category=${encodeURIComponent(
                        matchedCategory
                    )}`
                );

            }


            // ---------------------------------
            // NORMAL PRODUCT SEARCH
            // ---------------------------------

            else {

                navigate(
                    `/products?search=${encodeURIComponent(
                        keyword
                    )}`
                );

            }


            setMobileMenu(false);

            setShowCategories(false);

            setShowProfile(false);

        };


    // ==========================
    // ENTER KEY
    // ==========================

    const handleKeyDown =
        (event) => {

            if (
                event.key === "Enter"
            ) {

                handleSearch();

            }

        };


    // ==========================
    // LOGOUT
    // ==========================

    const handleLogout =
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );


            setCartCount(0);


            navigate("/login");

        };


    // ==========================
    // CATEGORY CLICK
    // ==========================

    const handleCategoryClick =
        (category) => {

            navigate(
                `/products?category=${encodeURIComponent(
                    category
                )}`
            );


            setShowCategories(
                false
            );

            setMobileMenu(
                false
            );

        };


    // ==========================
    // PROFILE NAVIGATION
    // ==========================

    const goToProfile =
        (path) => {

            navigate(path);

            setShowProfile(false);

            setMobileMenu(false);

        };


    // ==========================
    // JSX
    // ==========================

    return (

        <nav className="navbar">


            {/* ==========================
                LOGO
            ========================== */}

            <div
                className="logo"
                onClick={() =>
                    navigate("/")
                }
            >

                🛍 ShopEase

            </div>


            {/* ==========================
                SEARCH
            ========================== */}

            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    onKeyDown={
                        handleKeyDown
                    }
                />


                <button
                    onClick={
                        handleSearch
                    }
                >

                    Search

                </button>

            </div>


            {/* ==========================
                MOBILE MENU BUTTON
            ========================== */}

            <button
                className="menu-btn"
                onClick={() =>
                    setMobileMenu(
                        !mobileMenu
                    )
                }
            >

                ☰

            </button>


            {/* ==========================
                NAVIGATION
            ========================== */}

            <ul
                className={
                    mobileMenu
                        ? "nav-links active"
                        : "nav-links"
                }
            >


                {/* HOME */}

                <li>

                    <Link
                        to="/"
                        className={
                            location.pathname === "/"
                                ? "active-link"
                                : ""
                        }
                        onClick={() =>
                            setMobileMenu(false)
                        }
                    >

                        🏠 Home

                    </Link>

                </li>


                {/* PRODUCTS */}

                <li>

                    <Link
                        to="/products"
                        className={
                            location.pathname ===
                            "/products"
                                ? "active-link"
                                : ""
                        }
                        onClick={() =>
                            setMobileMenu(false)
                        }
                    >

                        🛍 Products

                    </Link>

                </li>


                {/* ==========================
                    CATEGORIES
                ========================== */}

                <li
                    className="dropdown"
                    ref={categoryRef}
                >

                    <button
                        className="dropdown-btn"
                        onClick={() => {

                            setShowCategories(
                                !showCategories
                            );

                            setShowProfile(
                                false
                            );

                        }}
                    >

                        📂 Categories ▾

                    </button>


                    {

                        showCategories &&

                        <div className="dropdown-menu">

                            {

                                categories.length > 0

                                    ?

                                    categories.map(
                                        (category) => (

                                            <p
                                                key={
                                                    category
                                                }
                                                onClick={() =>
                                                    handleCategoryClick(
                                                        category
                                                    )
                                                }
                                            >

                                                {
                                                    category
                                                }

                                            </p>

                                        )
                                    )

                                    :

                                    <p>

                                        No Categories

                                    </p>

                            }

                        </div>

                    }

                </li>


                {/* WISHLIST */}

                <li>

                    <Link
                        to="/wishlist"
                        className={
                            location.pathname ===
                            "/wishlist"
                                ? "active-link"
                                : ""
                        }
                        onClick={() =>
                            setMobileMenu(false)
                        }
                    >

                        ❤️ Wishlist

                    </Link>

                </li>


                {/* ORDERS */}

                <li>

                    <Link
                        to="/orders"
                        className={
                            location.pathname ===
                            "/orders"
                                ? "active-link"
                                : ""
                        }
                        onClick={() =>
                            setMobileMenu(false)
                        }
                    >

                        📦 Orders

                    </Link>

                </li>


                {/* NOTIFICATION */}

                {

                    user &&

                    <li>

                        <NotificationBell />

                    </li>

                }


                {/* CART */}

                <li>

                    <Link
                        to="/cart"
                        className={
                            location.pathname ===
                            "/cart"
                                ? "active-link"
                                : ""
                        }
                        onClick={() =>
                            setMobileMenu(false)
                        }
                    >

                        🛒 Cart

                        <span className="cart-badge">

                            {
                                cartCount
                            }

                        </span>

                    </Link>

                </li>


                {/* ==========================
                    PROFILE
                ========================== */}

                {

                    user

                        ?

                        (

                            <li
                                className="dropdown"
                                ref={profileRef}
                            >

                                <button
                                    className="dropdown-btn"
                                    onClick={() => {

                                        setShowProfile(
                                            !showProfile
                                        );

                                        setShowCategories(
                                            false
                                        );

                                    }}
                                >

                                    👤 {
                                        user.full_name
                                    } ▾

                                </button>


                                {

                                    showProfile &&

                                    <div className="dropdown-menu">


                                        <p
                                            onClick={() =>
                                                goToProfile(
                                                    "/profile"
                                                )
                                            }
                                        >

                                            👤 My Profile

                                        </p>


                                        <p
                                            onClick={() =>
                                                goToProfile(
                                                    "/orders"
                                                )
                                            }
                                        >

                                            📦 My Orders

                                        </p>


                                        <p
                                            onClick={() =>
                                                goToProfile(
                                                    "/wishlist"
                                                )
                                            }
                                        >

                                            ❤️ Wishlist

                                        </p>


                                        <hr />


                                        <p
                                            className="logout-item"
                                            onClick={
                                                handleLogout
                                            }
                                        >

                                            🚪 Logout

                                        </p>

                                    </div>

                                }

                            </li>

                        )

                        :

                        (

                            <li>

                                <Link
                                    to="/login"
                                    className={
                                        location.pathname ===
                                        "/login"
                                            ? "active-link"
                                            : ""
                                    }
                                    onClick={() =>
                                        setMobileMenu(
                                            false
                                        )
                                    }
                                >

                                    🔐 Login

                                </Link>

                            </li>

                        )

                }

            </ul>

        </nav>

    );

}


export default Navbar;