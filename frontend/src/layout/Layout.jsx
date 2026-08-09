import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ScrollToTop from "../components/ScrollToTop";

function Layout() {

    return (

        <>
            <ScrollToTop />

            <Navbar />

            <main>
                <Outlet />
            </main>

            <Footer />
        </>

    );

}

export default Layout;