import "./Hero.css";
import { useEffect, useState } from "react";

function Hero() {

    const banners = [

        {
            title: "BIG SALE 2026",
            subtitle: "Up to 70% OFF on Electronics",
            description:
                "Discover amazing deals on Mobiles, Laptops, Fashion and Accessories.",
            image:
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900",
            color: "#2563eb"
        },

        {
            title: "NEW ARRIVALS",
            subtitle: "Latest Premium Collection",
            description:
                "Explore the newest smartphones, smartwatches and premium gadgets.",
            image:
                "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900",
            color: "#16a34a"
        },

        {
            title: "FLASH DEALS",
            subtitle: "Limited Time Offers",
            description:
                "Grab today's hottest discounts before they're gone.",
            image:
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
            color: "#f59e0b"
        }

    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {

        const timer = setInterval(() => {

            setCurrent((prev) =>
                (prev + 1) % banners.length
            );

        }, 4000);

        return () => clearInterval(timer);

    }, []);

    return (

        <section className="hero">

            <div className="hero-container">

                {/* LEFT SIDE */}

                <div className="hero-left">

                    <span
                        className="offer-badge"
                        style={{
                            background: banners[current].color
                        }}
                    >

                        🔥 {banners[current].subtitle}

                    </span>

                    <h1>
                        {banners[current].title}
                    </h1>

                    <p>
                        {banners[current].description}
                    </p>

                    <div className="hero-buttons">

                        <button className="shop-btn">
                            🛒 Shop Now
                        </button>

                        <button className="explore-btn">
                            📦 Explore Products
                        </button>

                    </div>

                    <div className="hero-stats">

                        <div className="hero-stat">

                            <h2>
                                10K+
                            </h2>

                            <span>
                                Happy Customers
                            </span>

                        </div>

                        <div className="hero-stat">

                            <h2>
                                500+
                            </h2>

                            <span>
                                Products
                            </span>

                        </div>

                        <div className="hero-stat">

                            <h2>
                                50+
                            </h2>

                            <span>
                                Brands
                            </span>

                        </div>

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="hero-right">

                    <img
                        src={banners[current].image}
                        alt="ShopEase Hero"
                    />

                </div>

            </div>

        </section>

    );

}

export default Hero;