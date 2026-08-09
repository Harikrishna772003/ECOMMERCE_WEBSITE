function PaymentMethod({

    paymentMethod,

    setPaymentMethod

}) {

    return (

        <div className="payment-card">

            <h2>💳 Payment Method</h2>

            <div className="payment-options">

                <div

                    className={`payment-option ${
                        paymentMethod === "Cash On Delivery"
                            ? "active"
                            : ""
                    }`}

                    onClick={() =>
                        setPaymentMethod("Cash On Delivery")
                    }

                >

                    <div className="payment-icon">

                        💵

                    </div>

                    <div>

                        <h3>Cash On Delivery</h3>

                        <p>

                            Pay when your order arrives.

                        </p>

                    </div>

                </div>

                <div

                    className={`payment-option ${
                        paymentMethod === "Online Payment"
                            ? "active"
                            : ""
                    }`}

                    onClick={() =>
                        setPaymentMethod("Online Payment")
                    }

                >

                    <div className="payment-icon">

                        💳

                    </div>

                    <div>

                        <h3>Online Payment</h3>

                        <p>

                            Razorpay • UPI • Cards • Net Banking

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default PaymentMethod;