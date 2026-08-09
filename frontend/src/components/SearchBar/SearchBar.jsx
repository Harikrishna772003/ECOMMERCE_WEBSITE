import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

function SearchBar() {

    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const handleSearch = () => {

        if (search.trim() !== "") {

            navigate(`/products?search=${encodeURIComponent(search.trim())}`);

        } else {

            navigate("/products");

        }
    };

    const handleKeyDown = (e) => {

        if (e.key === "Enter") {

            handleSearch();

        }
    };

    return (

        <div className="search-box">

            <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <button onClick={handleSearch}>
                Search
            </button>

        </div>

    );
}

export default SearchBar;