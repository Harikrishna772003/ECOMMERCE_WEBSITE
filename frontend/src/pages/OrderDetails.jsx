import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/OrderDetails.css";

function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const response = await API.get(
                `/api/order/details/${orderId}`
            );

            setOrder(response.data.order);
            setItems(response.data.items);
        } catch (error) {
            console.log(error);
        }
    };

    if (!order) {
        return <h2 className="loading">Loading...</h2>;
    }

    return (
        <div className="order-details-page">

            <button
                className="back-btn"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <h1>Order #{order.id}</h1>

            {/* ==========================
                ORDER ITEMS
            ========================== */}

            <div className="products-list">

                {items.map((item, index) => (

                    <div
                        key={index}
                        className="product-card"
                    >

                        <img
                            src={item.product_image}
                            alt={item.product_name}
                        />

                        <div className="product-info">

                            <h3>{item.product_name}</h3>

                            <p>
                                Price :
                                <strong>
                                    ₹ {item.price}
                                </strong>
                            </p>

                            <p>
                                Quantity :
                                <strong>
                                    {item.quantity}
                                </strong>
                            </p>

                            <p>
                                Subtotal :
                                <strong>
                                    ₹ {item.subtotal}
                                </strong>
                            </p>

                        </div>

                    </div>

                ))}

            </div>

            {/* ==========================
                ORDER SUMMARY
            ========================== */}

            <div className="order-summary">

                <h2>Order Summary</h2>

                <p>
                    <span>Original Total :</span>
                    <strong>
                        ₹ {order.total_amount}
                    </strong>
                </p>

                <p>
                    <span>Coupon :</span>
                    <strong>
                        {order.coupon_code || "No Coupon"}
                    </strong>
                </p>

                <p className="discount">
                    <span>Discount :</span>
                    <strong>
                        ₹ {order.discount || 0}
                    </strong>
                </p>

                <p className="final-amount">
                    <span>Final Amount :</span>
                    <strong>
                        ₹ {order.final_amount}
                    </strong>
                </p>

                <hr />

                <p>
                    <span>Status :</span>
                    <strong className="status">
                        {order.status}
                    </strong>
                </p>

                <p>
                    <span>Payment :</span>
                    <strong>
                        {order.payment_method}
                    </strong>
                </p>

                <p>
                    <span>Shipping Address :</span>
                    <strong>
                        {order.shipping_address}
                    </strong>
                </p>

                <p>
                    <span>Order Date :</span>
                    <strong>
                        {order.order_date}
                    </strong>
                </p>

                {/* Shipment Status */}

                <p>
                    <span>Shipment :</span>
                    <strong>
                        {order.shipment_status || "Order Placed"}
                    </strong>
                </p>

            </div>

        </div>
    );
}

export default OrderDetails;