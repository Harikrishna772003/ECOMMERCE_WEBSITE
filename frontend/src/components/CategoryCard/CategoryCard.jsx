import { useNavigate } from "react-router-dom";
import "./CategoryCard.css";

const categories = [
    {
        name: "Electronics",
        icon: "💻",
        products: "120+ Products",
        category: "laptops"
    },
    {
        name: "Fashion",
        icon: "👕",
        products: "250+ Products",
        category: "mens-shirts"
    },
    {
        name: "Mobiles",
        icon: "📱",
        products: "180+ Products",
        category: "smartphones"
    },
    {
        name: "Furniture",
        icon: "🛋️",
        products: "95+ Products",
        category: "furniture"
    },
    {
        name: "Groceries",
        icon: "🛒",
        products: "300+ Products",
        category: "groceries"
    },
    {
        name: "Sports",
        icon: "⚽",
        products: "140+ Products",
        category: "sports-accessories"
    }
];

function CategoryCard() {

    const navigate = useNavigate();

    const handleExplore = (category) => {

        navigate(
            `/products?category=${encodeURIComponent(category)}`
        );

    };

    return (

        <section className="categories">

            <div className="category-header">

                <h2>
                    Shop By Category
                </h2>

                <p>
                    Browse our most popular categories and discover amazing deals.
                </p>

            </div>

            <div className="category-grid">

                {categories.map((category, index) => (

                    <div
                        className="category-card"
                        key={index}
                    >

                        <div className="category-icon">
                            {category.icon}
                        </div>

                        <h3>
                            {category.name}
                        </h3>

                        <p>
                            {category.products}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                handleExplore(category.category)
                            }
                        >
                            Explore →
                        </button>

                    </div>

                ))}

            </div>

        </section>

    );
}

export default CategoryCard;