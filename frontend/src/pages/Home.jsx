import Hero from "../components/Hero/Hero";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import LatestProducts from "../components/LatestProducts/LatestProducts";
import OfferBanner from "../components/OfferBanner/offerBanner";
import WhyChoose from "../components/WhyChoose/WhyChoose";
import Testimonials from "../components/Testimonials/Testimonials";
import NewsLetter from "../components/Newsletter/NewsLetter";

function Home() {
    return (
        <>
            <Hero />

            <CategoryCard />

            <LatestProducts />

            <OfferBanner />

            <WhyChoose />

            <Testimonials />

            <NewsLetter />
        </>
    );
}

export default Home;