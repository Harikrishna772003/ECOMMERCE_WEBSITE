import "./Newsletter.css";
import { useState } from "react";

function Newsletter() {

    const [email, setEmail] = useState("");

    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!email.includes("@")) {

            setMessage("❌ Please enter a valid email address.");

            return;

        }

        setMessage("✅ Thank you for subscribing!");

        setEmail("");

    };

    return (

        <section className="newsletter">

            <div className="newsletter-content">

                <span className="newsletter-tag">

                    📧 NEWSLETTER

                </span>

                <h2>

                    Stay Updated with ShopEase

                </h2>

                <p>

                    Subscribe to receive exclusive offers,
                    latest product launches, flash sale alerts
                    and exciting discounts directly in your inbox.

                </p>

                <form

                    className="newsletter-box"

                    onSubmit={handleSubmit}

                >

                    <input

                        type="email"

                        placeholder="Enter your email address"

                        value={email}

                        onChange={(e) =>

                            setEmail(e.target.value)

                        }

                    />

                    <button type="submit">

                        Subscribe

                    </button>

                </form>

                {

                    message &&

                    <p className="newsletter-message">

                        {message}

                    </p>

                }

                <small>

                    ✔ Join 50,000+ happy customers already receiving our updates.

                </small>

            </div>

        </section>

    );

}

export default Newsletter;