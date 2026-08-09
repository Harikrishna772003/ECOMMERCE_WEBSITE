import "./OfferBanner.css";
import { useEffect, useState } from "react";

function OfferBanner() {

    const calculateTime = () => {

        const target = new Date();

        target.setHours(target.getHours() + 12);

        const difference = target - new Date();

        return {

            hours: Math.floor(
                (difference / (1000 * 60 * 60)) % 24
            ),

            minutes: Math.floor(
                (difference / (1000 * 60)) % 60
            ),

            seconds: Math.floor(
                (difference / 1000) % 60
            )

        };

    };

    const [timeLeft, setTimeLeft] = useState(
        calculateTime()
    );

    useEffect(() => {

        const timer = setInterval(() => {

            setTimeLeft(calculateTime());

        }, 1000);

        return () => clearInterval(timer);

    }, []);

    return (

        <section className="offer-banner">

            <div className="offer-left">

                <span className="offer-tag">

                    🔥 Deal of the Day

                </span>

                <h1>

                    Up to 70% OFF

                </h1>

                <p>

                    Save big on Mobiles, Laptops,
                    Accessories, Fashion and many more products.
                    Hurry! Limited-time offer.

                </p>

                <div className="countdown">

                    <div>

                        <h2>{timeLeft.hours}</h2>

                        <span>Hours</span>

                    </div>

                    <div>

                        <h2>{timeLeft.minutes}</h2>

                        <span>Minutes</span>

                    </div>

                    <div>

                        <h2>{timeLeft.seconds}</h2>

                        <span>Seconds</span>

                    </div>

                </div>

                <button>

                    Shop Now →

                </button>

            </div>

            <div className="offer-right">

                <img

                    src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900"

                    alt="Offer"

                />

            </div>

        </section>

    );

}

export default OfferBanner;