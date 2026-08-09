import "./Testimonials.css";

const testimonials = [

    {
        name: "Rahul Sharma",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        review: "Excellent shopping experience. Fast delivery and amazing product quality.",
        rating: 5
    },

    {
        name: "Priya Verma",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        review: "The customer support was outstanding. Highly recommend ShopEase.",
        rating: 5
    },

    {
        name: "Amit Kumar",
        image: "https://randomuser.me/api/portraits/men/68.jpg",
        review: "Best prices and secure payment. I will definitely shop again.",
        rating: 5
    }

];

function Testimonials() {

    return (

        <section className="testimonials">

            <div className="testimonial-header">

                <h2>

                    What Our Customers Say

                </h2>

                <p>

                    Thousands of happy customers trust ShopEase.

                </p>

            </div>

            <div className="testimonial-grid">

                {

                    testimonials.map((item,index)=>(

                        <div
                            className="testimonial-card"
                            key={index}
                        >

                            <img
                                src={item.image}
                                alt={item.name}
                            />

                            <h3>

                                {item.name}

                            </h3>

                            <div className="stars">

                                ⭐⭐⭐⭐⭐

                            </div>

                            <p>

                                "{item.review}"

                            </p>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default Testimonials;