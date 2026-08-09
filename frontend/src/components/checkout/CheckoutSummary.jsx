function CheckoutSummary({

    originalTotal,

    discount,

    finalAmount,

    couponCode,

    setCouponCode,

    appliedCoupon,

    applyCoupon,

    placeOrder

}) {

    return (

        <div className="checkout-summary">

            <h2>📦 Order Summary</h2>

            <div className="summary-row">

                <span>Subtotal</span>

                <span>₹ {originalTotal.toFixed(2)}</span>

            </div>

            <div className="summary-row">

                <span>Shipping</span>

                <span className="free-text">

                    FREE

                </span>

            </div>

            <div className="summary-row">

                <span>Discount</span>

                <span className="discount-text">

                    - ₹ {discount.toFixed(2)}

                </span>

            </div>

            <hr />

            <div className="summary-total">

                <span>Grand Total</span>

                <span>

                    ₹ {finalAmount.toFixed(2)}

                </span>

            </div>

            <div className="coupon-box">

                <label>

                    Coupon Code

                </label>

                <div className="coupon-input">

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

            </div>

            {

                appliedCoupon && (

                    <div className="coupon-success">

                        ✅ Coupon Applied

                        <br />

                        <strong>

                            {appliedCoupon}

                        </strong>

                    </div>

                )

            }

            <button

                className="place-order-btn"

                onClick={placeOrder}

            >

                🛒 Place Order

            </button>

        </div>

    );

}

export default CheckoutSummary;