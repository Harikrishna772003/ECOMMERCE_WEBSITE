import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/Orders.css";

function Orders() {

    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {

        fetchOrders();

    }, []);

    const fetchOrders = async () => {

        try {

            const response = await API.get(
                `/api/orders/${user.id}`
            );

            setOrders(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const downloadInvoice = (orderId) => {

        window.open(

            `http://127.0.0.1:5000/api/invoice/${orderId}`,

            "_blank"

        );

    };

    // ==========================
    // Shipment Timeline
    // ==========================
    const shipmentSteps = [

        "Order Placed",

        "Packed",

        "Shipped",

        "Out for Delivery",

        "Delivered"

    ];

    const getStepIndex = (status) => {

        return shipmentSteps.indexOf(status);

    };

    return (

        <div className="orders-page">

            <h1>My Orders</h1>

            {

                orders.length === 0 ?

                    (

                        <h2 className="empty-orders">

                            📦 No Orders Found

                        </h2>

                    )

                    :

                    (

                        <div className="orders-grid">{orders.map((order) => (

    <div
        className="order-card"
        key={order.id}
    >

        <h2>Order #{order.id}</h2>

        <hr />

        <p>
            <strong>Original Total :</strong>
            <br />
            ₹ {order.total_amount}
        </p>

        <p>
            <strong>Coupon :</strong>
            <br />
            {order.coupon_code || "-"}
        </p>

        <p
            style={{
                color: "#16a34a",
                fontWeight: "bold"
            }}
        >
            <strong>Discount :</strong>
            <br />
            ₹ {order.discount || 0}
        </p>

        <h3
            style={{
                color: "#2563eb"
            }}
        >
            Final Amount
            <br />
            ₹ {order.final_amount}
        </h3>

        <hr />

        <p>
            <strong>Payment :</strong>{" "}
            {order.payment_method}
        </p>

        <p>
            <strong>Status :</strong>

            <span className="status">

                {order.status}

            </span>
        </p>

        <p>
            <strong>Shipping Address :</strong>
            <br />
            {order.shipping_address}
        </p>

        <p>
            <strong>Order Date :</strong>
            <br />
            {order.order_date}
        </p>

        <hr />

        <h3 className="tracking-title">

            🚚 Shipment Tracking

        </h3>

        <div className="shipment-tracker">

            {shipmentSteps.map((step, index) => (

                <div
                    key={index}
                    className={
                        index <= getStepIndex(order.shipment_status)
                            ? "tracking-step active"
                            : "tracking-step"
                    }
                >

                    <div className="tracking-circle">

                        {index <= getStepIndex(order.shipment_status)
                            ? "✓"
                            : index + 1}

                    </div>

                    <span>{step}</span>

                </div>

            ))}

        </div>

        <hr />

        <p>
            <strong>Razorpay Order ID :</strong>
            <br />
            {order.razorpay_order_id || "-"}
        </p>

        <p>
            <strong>Payment ID :</strong>
            <br />
            {order.razorpay_payment_id || "-"}
        </p>

        <div
            style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
                flexWrap: "wrap"
            }}
        >

            <button
                className="invoice-btn"
                onClick={() =>
                    navigate(`/order/details/${order.id}`)
                }
            >
                👁 View Details
            </button>

            <button
                className="invoice-btn"
                onClick={() =>
                    downloadInvoice(order.id)
                }
            >
                📄 Download Invoice
            </button>

        </div>

    </div>

))}</div>
                

                    )

            }

        </div>

    );

}

export default Orders;