from flask import Blueprint, send_file

from models.order import Order
from services.invoice_service import generate_invoice

invoice = Blueprint("invoice", __name__)


# ==========================
# Download Invoice
# ==========================
@invoice.route("/invoice/<int:order_id>", methods=["GET"])
def download_invoice(order_id):

    order = Order.query.get(order_id)

    if not order:
        return {
            "message": "Order Not Found"
        }, 404

    pdf_buffer = generate_invoice(order)

    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f"Invoice_{order.id}.pdf",
        mimetype="application/pdf"
    )