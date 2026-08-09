import "./WhyChoose.css";

const features = [

    {
        icon: "🚚",
        title: "Free Shipping",
        description: "Free delivery on all orders above ₹999."
    },

    {
        icon: "🔒",
        title: "Secure Payment",
        description: "100% secure online payments with Razorpay."
    },

    {
        icon: "↩️",
        title: "Easy Returns",
        description: "7-day hassle-free return policy."
    },

    {
        icon: "💬",
        title: "24×7 Support",
        description: "Dedicated customer support anytime."
    }

];

function WhyChoose() {

    return (

        <section className="why-choose">

            <div className="why-header">

                <h2>Why Choose ShopEase?</h2>

                <p>

                    We provide the best shopping experience with quality products and trusted services.

                </p>

            </div>

            <div className="why-grid">

                {

                    features.map((item,index)=>(

                        <div
                            className="why-card"
                            key={index}
                        >

                            <div className="why-icon">

                                {item.icon}

                            </div>

                            <h3>

                                {item.title}

                            </h3>

                            <p>

                                {item.description}

                            </p>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default WhyChoose;