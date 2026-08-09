from flask_mail import Message
from extensions import mail

from services.invoice_service import generate_invoice


def send_order_email(user_email, user_name, order):

    msg = Message(
        subject="🛍 ShopEase - Order Confirmation",
        recipients=[user_email]
    )

    # ==========================
    # HTML Email
    # ==========================
    msg.html = f"""
    <html>

    <body style="font-family:Arial;background:#f5f5f5;padding:30px;">

        <div style="
            max-width:650px;
            margin:auto;
            background:white;
            border-radius:10px;
            overflow:hidden;
            box-shadow:0 5px 20px rgba(0,0,0,.1);
        ">

            <div style="
                background:#2563eb;
                color:white;
                padding:25px;
                text-align:center;
            ">

                <h1>🛍 ShopEase</h1>

                <h2>Order Confirmation</h2>

            </div>

            <div style="padding:30px;">

                <h3>Hello {user_name},</h3>

                <p>
                    Thank you for shopping with
                    <b>ShopEase</b>.
                </p>

                <table
                    width="100%"
                    cellpadding="10"
                    cellspacing="0"
                    style="border-collapse:collapse;"
                >

                    <tr>
                        <td><b>Order ID</b></td>
                        <td>{order.id}</td>
                    </tr>

                    <tr>
                        <td><b>Payment Method</b></td>
                        <td>{order.payment_method}</td>
                    </tr>

                    <tr>
                        <td><b>Status</b></td>
                        <td>{order.status}</td>
                    </tr>

                    <tr>
                        <td><b>Shipping Address</b></td>
                        <td>{order.shipping_address}</td>
                    </tr>

                </table>

                <br>

                <h3 style="
                    color:#2563eb;
                    border-bottom:2px solid #2563eb;
                    padding-bottom:8px;
                ">
                    Payment Summary
                </h3>

                <table
                    width="100%"
                    cellpadding="10"
                    cellspacing="0"
                    style="border-collapse:collapse;"
                >

                    <tr>
                        <td><b>Original Total</b></td>
                        <td>INR {order.total_amount:.2f}</td>
                    </tr>

                    <tr>
                        <td><b>Coupon Code</b></td>
                        <td>{order.coupon_code or "-"}</td>
                    </tr>

                    <tr>
                        <td><b>Discount</b></td>
                        <td>INR {order.discount:.2f}</td>
                    </tr>

                    <tr style="
                        background:#f0fdf4;
                        font-size:18px;
                        font-weight:bold;
                        color:#16a34a;
                    ">
                        <td><b>Final Amount</b></td>
                        <td><b>INR {order.final_amount:.2f}</b></td>
                    </tr>

                </table>

                <br>

                <p>
                    📎 Your invoice is attached with this email.
                </p>

                <p>
                    Thank you for choosing <b>ShopEase</b> ❤️
                </p>

            </div>

            <div style="
                background:#111827;
                color:white;
                padding:15px;
                text-align:center;
            ">

                © ShopEase 2026

            </div>

        </div>

    </body>

    </html>
    """

    # ==========================
    # Attach Invoice PDF
    # ==========================
    pdf_buffer = generate_invoice(order)

    msg.attach(
        filename=f"Invoice_{order.id}.pdf",
        content_type="application/pdf",
        data=pdf_buffer.read()
    )

    # ==========================
    # Send Email
    # ==========================
    mail.send(msg)