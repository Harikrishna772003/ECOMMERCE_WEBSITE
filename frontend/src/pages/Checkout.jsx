import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import API from "../api/api";

import "../styles/Checkout.css";

function Checkout() {

    const navigate = useNavigate();

    const location = useLocation();

    const user = JSON.parse(

        localStorage.getItem("user")

    );

    const originalTotal =

        location.state?.total || 0;

    // ==========================
    // STATES
    // ==========================

    const [shippingAddress, setShippingAddress] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

    const [couponCode, setCouponCode] = useState("");

    const [discount, setDiscount] = useState(0);

    const [finalAmount, setFinalAmount] = useState(originalTotal);

    const [appliedCoupon, setAppliedCoupon] = useState("");

    // ==========================
    // APPLY COUPON
    // ==========================

    const applyCoupon = async () => {

        if (!couponCode.trim()) {

            alert("Please Enter Coupon Code");

            return;

        }

        try {

            const response = await API.post(

                "/api/coupon/apply",

                {

                    code: couponCode,

                    total: originalTotal

                }

            );

            setDiscount(

                response.data.discount

            );

            setFinalAmount(

                response.data.final_amount

            );

            setAppliedCoupon(

                response.data.coupon

            );

            alert("Coupon Applied Successfully");

        }

        catch (error) {

            console.log(error);

            setDiscount(0);

            setAppliedCoupon("");

            alert(

                error.response?.data?.message ||

                "Unable To Apply Coupon"

            );

        }

    };

    // ==========================
    // PLACE ORDER
    // ==========================

    const placeOrder = async (e) => {

        e.preventDefault();

        if (!shippingAddress.trim()) {

            alert(

                "Please Enter Shipping Address"

            );

            return;

        }

        // ==========================
        // ONLINE PAYMENT
        // ==========================

        if (

            paymentMethod === "Online Payment"

        ) {

            try {

                const order = await API.post(

                    "/api/payment/create-order",

                    {

                        user_id: user.id,

                        discount: discount

                    }

                );

                const options = {

                    key: order.data.key,

                    amount: order.data.amount,

                    currency: order.data.currency,

                    name: "ShopEase",

                    description: "Order Payment",

                    order_id: order.data.order_id,

                    handler: async function (response) {

                        try {

                            const verify = await API.post(

                                "/api/payment/verify",

                                {

                                    razorpay_order_id:

                                        response.razorpay_order_id,

                                    razorpay_payment_id:

                                        response.razorpay_payment_id,

                                    razorpay_signature:

                                        response.razorpay_signature

                                }

                            );

                            if (verify.data.success) {

                                const orderResponse = await API.post(

                                    "/api/order/place",

                                    {

                                        user_id: user.id,

                                        shipping_address:

                                            shippingAddress,

                                        payment_method:

                                            "Online Payment",

                                        coupon_code:

                                            appliedCoupon,

                                        discount:

                                            discount,

                                        final_amount:

                                            finalAmount,

                                        razorpay_order_id:

                                            response.razorpay_order_id,

                                        razorpay_payment_id:

                                            response.razorpay_payment_id,

                                        razorpay_signature:

                                            response.razorpay_signature

                                    }

                                );

                                alert(

                                    orderResponse.data.message

                                );

                                navigate("/orders");

                            }

                            else {

                                alert(

                                    "Payment Verification Failed"

                                );

                            }

                        }

                        catch (error) {

                            console.log(error);

                            alert(

                                "Payment Verification Failed"

                            );

                        }

                    },

                    prefill: {

                        name: user.full_name,

                        email: user.email

                    },

                    theme: {

                        color: "#2563eb"

                    }

                };

                const razor = new window.Razorpay(options);

                razor.open();

            }

            catch (error) {

                console.log(error);

                alert(

                    "Unable To Start Payment"

                );

            }

            return;

        }

        // ==========================
        // CASH ON DELIVERY
        // ==========================

        try {

            const response = await API.post(

                "/api/order/place",

                {

                    user_id: user.id,

                    shipping_address:

                        shippingAddress,

                    payment_method:

                        paymentMethod,

                    coupon_code:

                        appliedCoupon,

                    discount:

                        discount,

                    final_amount:

                        finalAmount

                }

            );

            alert(response.data.message);

            navigate("/orders");

        }

        catch (error) {

            console.log(error);

            alert(

                error.response?.data?.message ||

                "Something Went Wrong"

            );

        }

    };    return (

        <div className="checkout-page">

            <div className="checkout-container">

                {/* ==========================
                    LEFT SECTION
                ========================== */}

                <div className="checkout-left">

                    <div className="checkout-card">

                        <h1>

                            Checkout

                        </h1>

                        <form onSubmit={placeOrder}>

                            {/* ==========================
                                SHIPPING ADDRESS
                            ========================== */}

                            <div className="section-title">

                                📍 Shipping Address

                            </div>

                            <textarea

                                placeholder="Enter your complete shipping address..."

                                value={shippingAddress}

                                onChange={(e) =>

                                    setShippingAddress(

                                        e.target.value

                                    )

                                }

                            />

                            {/* ==========================
                                PAYMENT METHOD
                            ========================== */}

                            <div className="section-title">

                                💳 Payment Method

                            </div>

                            <div className="payment-methods">

                                <label className="payment-card">

                                    <input

                                        type="radio"

                                        value="Cash On Delivery"

                                        checked={

                                            paymentMethod ===

                                            "Cash On Delivery"

                                        }

                                        onChange={(e) =>

                                            setPaymentMethod(

                                                e.target.value

                                            )

                                        }

                                    />

                                    <span>

                                        💵 Cash On Delivery

                                    </span>

                                </label>

                                <label className="payment-card">

                                    <input

                                        type="radio"

                                        value="Online Payment"

                                        checked={

                                            paymentMethod ===

                                            "Online Payment"

                                        }

                                        onChange={(e) =>

                                            setPaymentMethod(

                                                e.target.value

                                            )

                                        }

                                    />

                                    <span>

                                        💳 Online Payment

                                    </span>

                                </label>

                            </div>

                        </form>

                    </div>

                </div>

                {/* ==========================
                    RIGHT SECTION
                ========================== */}

                <div className="checkout-right">

                    <div className="summary-card">

                        <h2>

                            📦 Order Summary

                        </h2>

                        <div className="summary-row">

                            <span>

                                Subtotal

                            </span>

                            <span>

                                ₹ {originalTotal.toFixed(2)}

                            </span>

                        </div>

                        <div className="summary-row">

                            <span>

                                Shipping

                            </span>

                            <span className="free">

                                FREE

                            </span>

                        </div>

                        <div className="summary-row">

                            <span>

                                Discount

                            </span>

                            <span>

                                - ₹ {discount.toFixed(2)}

                            </span>

                        </div>

                        <hr />

                        <div className="summary-total">

                            <span>

                                Grand Total

                            </span>

                            <span>

                                ₹ {finalAmount.toFixed(2)}

                            </span>

                        </div>

                        {/* ==========================
                            COUPON
                        ========================== */}

                        <div className="coupon-section">

                            <label>

                                Coupon Code

                            </label>

                            <div className="coupon-box">

                                <input

                                    type="text"

                                    placeholder="Enter Coupon"

                                    value={couponCode}

                                    onChange={(e) =>

                                        setCouponCode(

                                            e.target.value.toUpperCase()

                                        )

                                    }

                                />

                                <button

                                    type="button"

                                    className="coupon-btn"

                                    onClick={applyCoupon}

                                >

                                    Apply

                                </button>

                            </div>

                            {

                                appliedCoupon && (

                                    <div className="coupon-success">

                                        ✅ Coupon Applied :

                                        <strong>

                                            {" "}

                                            {appliedCoupon}

                                        </strong>

                                    </div>

                                )

                            }

                        </div>

                        <button

                            className="place-order-btn"

                            onClick={placeOrder}

                        >

                            🛒 Place Order

                        </button>

                    </div>

                </div>

            </div>        </div>

    );

}

export default Checkout;
            
