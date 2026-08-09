import { useEffect, useState } from "react";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/AdminOrders.css";

function AdminOrders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        fetchOrders();

    }, []);

    const fetchOrders = async () => {

        try {

            const response = await API.get(
                "/api/admin/orders"
            );

            setOrders(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const updatePaymentStatus = async (
        id,
        status
    ) => {

        try {

            await API.put(
                `/api/admin/order/${id}`,
                {
                    status
                }
            );

            fetchOrders();

        }

        catch (error) {

            console.log(error);

        }

    };

    const updateShipmentStatus = async (
        id,
        shipment_status
    ) => {

        try {

            await API.put(
                `/api/admin/order/shipment/${id}`,
                {
                    shipment_status
                }
            );

            fetchOrders();

        }

        catch (error) {

            console.log(error);

        }

    };

    return (<div className="admin-layout">

    <AdminSidebar />

    <div className="admin-content">

        <h1>📦 Orders Management</h1>

        <table className="admin-table">

            <thead>

                <tr>

                    <th>ID</th>

                    <th>User</th>

                    <th>Amount</th>

                    <th>Payment</th>

                    <th>Shipment</th>

                    <th>Method</th>

                    <th>Address</th>

                    <th>Date</th>

                </tr>

            </thead>

            <tbody>

                {orders.map((order) => (

                    <tr key={order.id}>

                        <td>{order.id}</td>

                        <td>{order.user_id}</td>

                        <td>

                            ₹ {order.final_amount}

                        </td>

                        <td>

                            <select

                                value={order.status}

                                onChange={(e) =>
                                    updatePaymentStatus(
                                        order.id,
                                        e.target.value
                                    )
                                }

                            >

                                <option value="Pending">

                                    Pending

                                </option>

                                <option value="Paid">

                                    Paid

                                </option>

                                <option value="Failed">

                                    Failed

                                </option>

                            </select>

                        </td>

                        <td>

                            <select

                                value={
                                    order.shipment_status
                                }

                                onChange={(e) =>
                                    updateShipmentStatus(
                                        order.id,
                                        e.target.value
                                    )
                                }

                            >

                                <option value="Order Placed">

                                    📦 Order Placed

                                </option>

                                <option value="Packed">

                                    📦 Packed

                                </option>

                                <option value="Shipped">

                                    🚚 Shipped

                                </option>

                                <option value="Out For Delivery">

                                    🚛 Out For Delivery

                                </option>

                                <option value="Delivered">

                                    ✅ Delivered

                                </option>

                            </select>

                        </td>

                        <td>

                            {order.payment_method}

                        </td>

                        <td>

                            {order.shipping_address}

                        </td>

                        <td>

                            {new Date(
                                order.order_date
                            ).toLocaleString()}

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    </div>

</div>

    );

}

export default AdminOrders;