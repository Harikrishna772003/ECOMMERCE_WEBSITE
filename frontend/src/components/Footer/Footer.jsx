import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {

    return (

        <footer className="footer">

            <div className="footer-container">

                <div className="footer-box">

                    <h2>🛍 ShopEase</h2>

                    <p>

                        Your trusted online shopping destination for
                        Electronics, Fashion, Mobiles, Home Appliances,
                        Accessories and much more.

                    </p>

                    <div className="social-icons">

                        <a href="#">📘</a>

                        <a href="#">📷</a>

                        <a href="#">🐦</a>

                        <a href="#">💼</a>

                    </div>

                </div>

                <div className="footer-box">

                    <h3>Quick Links</h3>

                    <ul>

                        <li>
                            <Link to="/">Home</Link>
                        </li>

                        <li>
                            <Link to="/products">Products</Link>
                        </li>

                        <li>
                            <Link to="/wishlist">Wishlist</Link>
                        </li>

                        <li>
                            <Link to="/cart">Cart</Link>
                        </li>

                        <li>
                            <Link to="/orders">Orders</Link>
                        </li>

                    </ul>

                </div>

                <div className="footer-box">

                    <h3>Customer Service</h3>

                    <ul>

                        <li>Help Center</li>

                        <li>Privacy Policy</li>

                        <li>Terms & Conditions</li>

                        <li>Return Policy</li>

                        <li>Refund Policy</li>

                    </ul>

                </div>

                <div className="footer-box">

                    <h3>Contact Us</h3>

                    <p>📧 support@shopease.com</p>

                    <p>📞 +91 9876543210</p>

                    <p>📍 Hyderabad, Telangana</p>

                    <p>🕒 Mon - Sat : 9 AM - 8 PM</p>

                </div>

            </div>


            <div className="payment-section">

                <h3>Secure Payments</h3>

                <div className="payment-icons">

                    <span>💳 Visa</span>

                    <span>💳 Mastercard</span>

                    <span>🏦 UPI</span>

                    <span>⚡ Razorpay</span>

                </div>

            </div>


            {/* ==========================
                DEVELOPER INFORMATION
            ========================== */}

            <div className="developer-section">

                <p>
                    Designed & Developed by
                </p>

                <strong>
                    👤 HARIKRISHNA THUMULA
                </strong>

                <p>
                    📧 kittuyadav73375@gmail.com
                </p>

            </div>


            <div className="footer-bottom">

                © 2026 ShopEase. All Rights Reserved.

            </div>

        </footer>

    );

}

export default Footer;