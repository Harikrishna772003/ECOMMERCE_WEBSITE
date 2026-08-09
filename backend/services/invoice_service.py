from io import BytesIO

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase.pdfmetrics import stringWidth


# ============================================================
# COLORS
# ============================================================

BLUE = HexColor("#2563EB")
DARK_BLUE = HexColor("#1D4ED8")
LIGHT_BLUE = HexColor("#EFF6FF")
LIGHT_GREY = HexColor("#F3F4F6")
BORDER_GREY = HexColor("#D1D5DB")
TEXT = HexColor("#1F2937")
GREY_TEXT = HexColor("#6B7280")
GREEN = HexColor("#16A34A")
LIGHT_GREEN = HexColor("#ECFDF5")
WHITE = HexColor("#FFFFFF")
BLACK = HexColor("#000000")


# ============================================================
# PAGE SETTINGS
# ============================================================

PAGE_WIDTH, PAGE_HEIGHT = A4

LEFT = 45
RIGHT = 45

CONTENT_WIDTH = PAGE_WIDTH - LEFT - RIGHT


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def safe_value(value, default="-"):
    """
    Return a safe printable value.
    """
    if value is None:
        return default

    value = str(value).strip()

    if value == "":
        return default

    return value


def money(value):
    """
    Format amount safely.

    We deliberately use Rs. instead of the ₹ symbol
    because Helvetica does not support the Rupee symbol.
    """

    try:
        return f"Rs. {float(value):,.2f}"
    except (TypeError, ValueError):
        return "Rs. 0.00"


def get_attribute(obj, names, default=None):
    """
    Try multiple possible attribute names.

    This makes the invoice more tolerant of small differences
    in model field names.
    """

    if obj is None:
        return default

    for name in names:
        try:
            value = getattr(obj, name, None)

            if value is not None:
                return value
        except Exception:
            pass

    return default


def draw_right_text(pdf, text, right_x, y, font="Helvetica", size=10):
    """
    Draw text aligned to the right.
    """

    pdf.setFont(font, size)

    width = stringWidth(str(text), font, size)

    pdf.drawString(
        right_x - width,
        y,
        str(text)
    )


def draw_center_text(pdf, text, center_x, y, font="Helvetica", size=10):
    """
    Draw centered text.
    """

    pdf.setFont(font, size)

    width = stringWidth(str(text), font, size)

    pdf.drawString(
        center_x - (width / 2),
        y,
        str(text)
    )


def draw_wrapped_text(
    pdf,
    text,
    x,
    y,
    max_width,
    font="Helvetica",
    size=9,
    line_height=13
):
    """
    Draw wrapped text and return the new Y position.
    """

    text = safe_value(text)

    pdf.setFont(font, size)

    words = text.split()

    if not words:
        return y

    lines = []
    current_line = ""

    for word in words:

        test_line = (
            word
            if not current_line
            else current_line + " " + word
        )

        width = stringWidth(
            test_line,
            font,
            size
        )

        if width <= max_width:
            current_line = test_line
        else:

            if current_line:
                lines.append(current_line)

            current_line = word

    if current_line:
        lines.append(current_line)

    for line in lines:

        pdf.drawString(
            x,
            y,
            line
        )

        y -= line_height

    return y


# ============================================================
# HEADER
# ============================================================

def draw_header(pdf, order):
    """
    Draw ShopEase invoice header.
    """

    header_height = 75

    pdf.setFillColor(BLUE)

    pdf.roundRect(
        LEFT,
        PAGE_HEIGHT - 50 - header_height,
        CONTENT_WIDTH,
        header_height,
        8,
        fill=1,
        stroke=0
    )

    # ShopEase
    pdf.setFillColor(WHITE)

    pdf.setFont(
        "Helvetica-Bold",
        23
    )

    pdf.drawString(
        LEFT + 18,
        PAGE_HEIGHT - 78,
        "ShopEase"
    )

    # Subtitle
    pdf.setFont(
        "Helvetica",
        8
    )

    pdf.drawString(
        LEFT + 19,
        PAGE_HEIGHT - 91,
        "Your Trusted Online Shopping Store"
    )

    # Invoice
    draw_right_text(
        pdf,
        "INVOICE",
        PAGE_WIDTH - RIGHT - 18,
        PAGE_HEIGHT - 80,
        "Helvetica-Bold",
        17
    )


# ============================================================
# INVOICE INFORMATION
# ============================================================

def draw_invoice_information(pdf, order, y):
    """
    Draw invoice number, order date, order ID and customer ID.
    """

    column_1 = LEFT + 5
    column_2 = 285
    column_3 = 445

    pdf.setFillColor(TEXT)

    # Invoice Number
    pdf.setFont(
        "Helvetica-Bold",
        9
    )

    pdf.drawString(
        column_1,
        y,
        "Invoice Number"
    )

    pdf.setFont(
        "Helvetica",
        9
    )

    pdf.drawString(
        column_1,
        y - 14,
        f"INV-{safe_value(order.id)}"
    )

    # Order Date
    pdf.setFont(
        "Helvetica-Bold",
        9
    )

    pdf.drawString(
        column_2,
        y,
        "Order Date"
    )

    pdf.setFont(
        "Helvetica",
        9
    )

    order_date = safe_value(
        get_attribute(
            order,
            [
                "order_date",
                "created_at",
                "created_on"
            ]
        )
    )

    pdf.drawString(
        column_2,
        y - 14,
        order_date
    )

    # Order ID
    pdf.setFont(
        "Helvetica-Bold",
        9
    )

    pdf.drawString(
        column_3,
        y,
        "Order ID"
    )

    pdf.setFont(
        "Helvetica",
        9
    )

    pdf.drawString(
        column_3,
        y - 14,
        f"#{safe_value(order.id)}"
    )

    # Customer ID
    customer_id = get_attribute(
        order,
        [
            "user_id",
            "customer_id"
        ]
    )

    if customer_id is not None:

        pdf.setFont(
            "Helvetica-Bold",
            9
        )

        pdf.drawString(
            column_1,
            y - 38,
            "Customer ID"
        )

        pdf.setFont(
            "Helvetica",
            9
        )

        pdf.drawString(
            column_1,
            y - 52,
            safe_value(customer_id)
        )

    return y - 72


# ============================================================
# INFORMATION BOX
# ============================================================

def draw_information_boxes(pdf, order, y):
    """
    Draw Shipping Information and Payment Information.
    """

    box_height = 70

    gap = 12

    box_width = (
        CONTENT_WIDTH - gap
    ) / 2

    left_box_x = LEFT

    right_box_x = (
        LEFT + box_width + gap
    )

    box_y = y - box_height

    # --------------------------------------------------------
    # SHIPPING BOX
    # --------------------------------------------------------

    pdf.setFillColor(
        LIGHT_BLUE
    )

    pdf.roundRect(
        left_box_x,
        box_y,
        box_width,
        box_height,
        7,
        fill=1,
        stroke=0
    )

    pdf.setFillColor(TEXT)

    pdf.setFont(
        "Helvetica-Bold",
        10
    )

    pdf.drawString(
        left_box_x + 12,
        box_y + box_height - 18,
        "Shipping Information"
    )

    pdf.setFont(
        "Helvetica-Bold",
        8
    )

    pdf.drawString(
        left_box_x + 12,
        box_y + box_height - 34,
        "Shipping Address:"
    )

    address = get_attribute(
        order,
        [
            "shipping_address",
            "address"
        ],
        "-"
    )

    pdf.setFont(
        "Helvetica",
        8
    )

    draw_wrapped_text(
        pdf,
        address,
        left_box_x + 12,
        box_y + box_height - 47,
        box_width - 24,
        "Helvetica",
        8,
        11
    )

    # --------------------------------------------------------
    # PAYMENT BOX
    # --------------------------------------------------------

    pdf.setFillColor(
        LIGHT_BLUE
    )

    pdf.roundRect(
        right_box_x,
        box_y,
        box_width,
        box_height,
        7,
        fill=1,
        stroke=0
    )

    pdf.setFillColor(TEXT)

    pdf.setFont(
        "Helvetica-Bold",
        10
    )

    pdf.drawString(
        right_box_x + 12,
        box_y + box_height - 18,
        "Payment Information"
    )

    payment_method = get_attribute(
        order,
        [
            "payment_method",
            "payment_type"
        ],
        "-"
    )

    status = get_attribute(
        order,
        [
            "status",
            "order_status"
        ],
        "-"
    )

    pdf.setFont(
        "Helvetica",
        8
    )

    pdf.drawString(
        right_box_x + 12,
        box_y + box_height - 36,
        f"Payment Method: {safe_value(payment_method)}"
    )

    pdf.drawString(
        right_box_x + 12,
        box_y + box_height - 51,
        f"Status: {safe_value(status)}"
    )

    return box_y - 25


# ============================================================
# GET ORDER ITEMS
# ============================================================

def get_order_items(order):
    """
    Get OrderItem records belonging to this order.

    First try the SQLAlchemy relationship:
        order.items

    Then try:
        order.order_items

    Finally try querying OrderItem directly.

    This is important because some older orders may not expose
    the relationship through the Order model.
    """

    items = []

    # --------------------------------------------------------
    # METHOD 1
    # order.items
    # --------------------------------------------------------

    try:

        relationship_items = getattr(
            order,
            "items",
            None
        )

        if relationship_items is not None:

            items = list(
                relationship_items
            )

            if items:
                return items

    except Exception:
        pass

    # --------------------------------------------------------
    # METHOD 2
    # order.order_items
    # --------------------------------------------------------

    try:

        relationship_items = getattr(
            order,
            "order_items",
            None
        )

        if relationship_items is not None:

            items = list(
                relationship_items
            )

            if items:
                return items

    except Exception:
        pass

    # --------------------------------------------------------
    # METHOD 3
    # Direct database query
    # --------------------------------------------------------

    try:

        from models.order_item import OrderItem

        items = (
            OrderItem.query
            .filter_by(order_id=order.id)
            .all()
        )

        return items

    except Exception:
        pass

    return []


# ============================================================
# GET PRODUCT NAME
# ============================================================

def get_product_name(item):
    """
    Safely get product name from OrderItem.
    """

    # Direct product-name fields
    name = get_attribute(
        item,
        [
            "product_name",
            "name",
            "title"
        ]
    )

    if name:
        return str(name)

    # Product relationship
    try:

        product = getattr(
            item,
            "product",
            None
        )

        if product:

            name = get_attribute(
                product,
                [
                    "name",
                    "product_name",
                    "title"
                ]
            )

            if name:
                return str(name)

    except Exception:
        pass

    return "Product"


# ============================================================
# GET ITEM QUANTITY
# ============================================================

def get_item_quantity(item):
    """
    Safely get quantity.
    """

    quantity = get_attribute(
        item,
        [
            "quantity",
            "qty"
        ],
        1
    )

    try:
        return float(quantity)
    except (TypeError, ValueError):
        return 1


# ============================================================
# GET ITEM PRICE
# ============================================================

def get_item_price(item):
    """
    Safely get item price.

    Tries common field names.
    """

    price = get_attribute(
        item,
        [
            "price",
            "unit_price",
            "product_price"
        ],
        0
    )

    try:
        return float(price)
    except (TypeError, ValueError):
        return 0.0


# ============================================================
# GET ITEM SUBTOTAL
# ============================================================

def get_item_subtotal(item):
    """
    Safely calculate item subtotal.
    """

    subtotal = get_attribute(
        item,
        [
            "subtotal",
            "total",
            "total_price",
            "line_total"
        ]
    )

    if subtotal is not None:

        try:
            return float(subtotal)
        except (TypeError, ValueError):
            pass

    quantity = get_item_quantity(
        item
    )

    price = get_item_price(
        item
    )

    return quantity * price


# ============================================================
# DRAW ORDER ITEMS HEADER
# ============================================================

def draw_order_items_header(pdf, y):
    """
    Draw Order Items table heading.
    """

    pdf.setFillColor(TEXT)

    pdf.setFont(
        "Helvetica-Bold",
        11
    )

    pdf.drawString(
        LEFT,
        y,
        "Order Items"
    )

    y -= 18

    # Table header
    header_height = 22

    pdf.setFillColor(
        BLUE
    )

    pdf.roundRect(
        LEFT,
        y - header_height + 5,
        CONTENT_WIDTH,
        header_height,
        3,
        fill=1,
        stroke=0
    )

    pdf.setFillColor(
        WHITE
    )

    pdf.setFont(
        "Helvetica-Bold",
        8
    )

    # Columns
    product_x = LEFT + 8
    qty_x = 390
    pdf.drawString(
        product_x,
        y - 9,
        "Product"
    )

    pdf.drawString(
        qty_x,
        y - 9,
        "Qty"
    )

    # Subtotal heading aligned with the right edge of subtotal values
    draw_right_text(
        pdf,
        "Subtotal",
        PAGE_WIDTH - RIGHT - 5,
        y - 9,
        "Helvetica-Bold",
        8
    )

    return y - 27


# ============================================================
# DRAW SINGLE ORDER ITEM
# ============================================================

def draw_order_item(pdf, item, y, row_number):
    """
    Draw one product row.
    """

    row_height = 24

    # Alternate row background
    if row_number % 2 == 0:

        pdf.setFillColor(
            HexColor("#F9FAFB")
        )

        pdf.rect(
            LEFT,
            y - row_height + 5,
            CONTENT_WIDTH,
            row_height,
            fill=1,
            stroke=0
        )

    pdf.setFillColor(
        TEXT
    )

    pdf.setFont(
        "Helvetica",
        8
    )

    product_name = get_product_name(
        item
    )

    quantity = get_item_quantity(
        item
    )

    subtotal = get_item_subtotal(
        item
    )

    # Product
    product_x = LEFT + 8

    pdf.drawString(
        product_x,
        y - 9,
        product_name[:55]
    )

    # Quantity
    qty_text = (
        str(int(quantity))
        if quantity.is_integer()
        else str(quantity)
    )

    draw_center_text(
        pdf,
        qty_text,
        392,
        y - 9,
        "Helvetica",
        8
    )

    # Subtotal
    draw_right_text(
        pdf,
        money(subtotal),
        PAGE_WIDTH - RIGHT - 5,
        y - 9,
        "Helvetica",
        8
    )

    # Bottom border
    pdf.setStrokeColor(
        BORDER_GREY
    )

    pdf.setLineWidth(
        0.3
    )

    pdf.line(
        LEFT,
        y - row_height + 5,
        LEFT + CONTENT_WIDTH,
        y - row_height + 5
    )

    return y - row_height


# ============================================================
# DRAW ORDER ITEMS
# ============================================================

def draw_order_items(pdf, order, y):
    """
    Draw complete Order Items table.

    Returns:
        new y position
    """

    items = get_order_items(
        order
    )

    y = draw_order_items_header(
        pdf,
        y
    )

    # --------------------------------------------------------
    # NO ITEMS
    # --------------------------------------------------------

    if not items:

        pdf.setFillColor(
            GREY_TEXT
        )

        pdf.setFont(
            "Helvetica-Oblique",
            8
        )

        pdf.drawString(
            LEFT + 8,
            y - 8,
            "No order items available."
        )

        return y - 35

    # --------------------------------------------------------
    # ITEMS
    # --------------------------------------------------------

    for index, item in enumerate(
        items,
        start=1
    ):

        # New page if necessary
        if y < 100:

            pdf.showPage()

            draw_header(
                pdf,
                order
            )

            y = PAGE_HEIGHT - 145

            y = draw_order_items_header(
                pdf,
                y
            )

        y = draw_order_item(
            pdf,
            item,
            y,
            index
        )

    return y - 20


# ============================================================
# PAYMENT SUMMARY
# ============================================================

def draw_payment_summary(pdf, order, y):
    """
    Draw payment summary box.
    """

    pdf.setFillColor(
        TEXT
    )

    pdf.setFont(
        "Helvetica-Bold",
        11
    )

    pdf.drawString(
        LEFT,
        y,
        "Payment Summary"
    )

    y -= 18

    box_width = 220
    box_height = 105

    box_x = (
        PAGE_WIDTH
        - RIGHT
        - box_width
    )

    box_y = y - box_height

    pdf.setFillColor(
        LIGHT_GREY
    )

    pdf.roundRect(
        box_x,
        box_y,
        box_width,
        box_height,
        7,
        fill=1,
        stroke=0
    )

    # --------------------------------------------------------
    # TOTAL
    # --------------------------------------------------------

    total_amount = get_attribute(
        order,
        [
            "total_amount",
            "total"
        ],
        0
    )

    pdf.setFillColor(
        TEXT
    )

    pdf.setFont(
        "Helvetica",
        8
    )

    pdf.drawString(
        box_x + 12,
        box_y + 82,
        "Original Total"
    )

    draw_right_text(
        pdf,
        money(total_amount),
        box_x + box_width - 12,
        box_y + 82,
        "Helvetica",
        8
    )

    # --------------------------------------------------------
    # COUPON
    # --------------------------------------------------------

    coupon_code = get_attribute(
        order,
        [
            "coupon_code",
            "coupon"
        ],
        "-"
    )

    pdf.drawString(
        box_x + 12,
        box_y + 64,
        "Coupon"
    )

    draw_right_text(
        pdf,
        safe_value(coupon_code),
        box_x + box_width - 12,
        box_y + 64,
        "Helvetica",
        8
    )

    # --------------------------------------------------------
    # DISCOUNT
    # --------------------------------------------------------

    discount = get_attribute(
        order,
        [
            "discount",
            "discount_amount"
        ],
        0
    )

    pdf.setFillColor(
        GREEN
    )

    pdf.drawString(
        box_x + 12,
        box_y + 46,
        "Discount"
    )

    draw_right_text(
        pdf,
        f"- {money(discount)}",
        box_x + box_width - 12,
        box_y + 46,
        "Helvetica",
        8
    )

    # --------------------------------------------------------
    # SEPARATOR
    # --------------------------------------------------------

    pdf.setStrokeColor(
        BORDER_GREY
    )

    pdf.line(
        box_x + 12,
        box_y + 34,
        box_x + box_width - 12,
        box_y + 34
    )

    # --------------------------------------------------------
    # FINAL AMOUNT
    # --------------------------------------------------------

    final_amount = get_attribute(
        order,
        [
            "final_amount",
            "grand_total",
            "amount"
        ],
        None
    )

    if final_amount is None:

        try:
            final_amount = (
                float(total_amount)
                - float(discount or 0)
            )
        except Exception:
            final_amount = 0

    pdf.setFillColor(
        DARK_BLUE
    )

    pdf.setFont(
        "Helvetica-Bold",
        10
    )

    pdf.drawString(
        box_x + 12,
        box_y + 17,
        "FINAL AMOUNT"
    )

    draw_right_text(
        pdf,
        money(final_amount),
        box_x + box_width - 12,
        box_y + 17,
        "Helvetica-Bold",
        10
    )

    return box_y - 35


# ============================================================
# PAYMENT REFERENCE
# ============================================================

def draw_payment_reference(pdf, order, y):
    """
    Draw Razorpay/payment references.
    """

    pdf.setFillColor(
        TEXT
    )

    pdf.setFont(
        "Helvetica-Bold",
        10
    )

    pdf.drawString(
        LEFT,
        y,
        "Payment Reference"
    )

    y -= 18

    razorpay_order_id = get_attribute(
        order,
        [
            "razorpay_order_id"
        ],
        "-"
    )

    razorpay_payment_id = get_attribute(
        order,
        [
            "razorpay_payment_id"
        ],
        "-"
    )

    pdf.setFont(
        "Helvetica",
        8
    )

    pdf.drawString(
        LEFT,
        y,
        f"Razorpay Order ID : {safe_value(razorpay_order_id)}"
    )

    y -= 14

    pdf.drawString(
        LEFT,
        y,
        f"Razorpay Payment ID : {safe_value(razorpay_payment_id)}"
    )

    return y - 25


# ============================================================
# FOOTER
# ============================================================

def draw_footer(pdf):
    """
    Draw invoice footer.
    """

    footer_y = 42

    # Line
    pdf.setStrokeColor(
        BORDER_GREY
    )

    pdf.setLineWidth(
        0.5
    )

    pdf.line(
        LEFT,
        footer_y + 18,
        PAGE_WIDTH - RIGHT,
        footer_y + 18
    )

    # Thank you box
    pdf.setFillColor(
        LIGHT_GREEN
    )

    pdf.roundRect(
        LEFT,
        footer_y - 3,
        CONTENT_WIDTH,
        25,
        5,
        fill=1,
        stroke=0
    )

    pdf.setFillColor(
        GREEN
    )

    draw_center_text(
        pdf,
        "Thank You For Shopping With ShopEase!",
        PAGE_WIDTH / 2,
        footer_y + 7,
        "Helvetica-Bold",
        8
    )

    pdf.setFillColor(
        GREY_TEXT
    )

    draw_center_text(
        pdf,
        "This is a computer-generated invoice.",
        PAGE_WIDTH / 2,
        footer_y - 13,
        "Helvetica",
        6
    )


# ============================================================
# MAIN INVOICE FUNCTION
# ============================================================

def generate_invoice(order):

    # --------------------------------------------------------
    # CREATE PDF BUFFER
    # --------------------------------------------------------

    pdf_buffer = BytesIO()

    pdf = canvas.Canvas(
        pdf_buffer,
        pagesize=A4
    )

    # --------------------------------------------------------
    # PAGE 1 HEADER
    # --------------------------------------------------------

    draw_header(
        pdf,
        order
    )

    # --------------------------------------------------------
    # INVOICE INFORMATION
    # --------------------------------------------------------

    y = PAGE_HEIGHT - 150

    y = draw_invoice_information(
        pdf,
        order,
        y
    )

    # --------------------------------------------------------
    # SHIPPING + PAYMENT
    # --------------------------------------------------------

    y = draw_information_boxes(
        pdf,
        order,
        y
    )

    # --------------------------------------------------------
    # ORDER ITEMS
    # --------------------------------------------------------

    y = draw_order_items(
        pdf,
        order,
        y
    )

    # --------------------------------------------------------
    # PAYMENT SUMMARY
    # --------------------------------------------------------

    # Make sure summary does not overlap footer.
    if y < 230:

        pdf.showPage()

        draw_header(
            pdf,
            order
        )

        y = PAGE_HEIGHT - 150

    y = draw_payment_summary(
        pdf,
        order,
        y
    )

    # --------------------------------------------------------
    # PAYMENT REFERENCE
    # --------------------------------------------------------

    if y < 130:

        pdf.showPage()

        draw_header(
            pdf,
            order
        )

        y = PAGE_HEIGHT - 150

    y = draw_payment_reference(
        pdf,
        order,
        y
    )

    # --------------------------------------------------------
    # FOOTER
    # --------------------------------------------------------

    draw_footer(
        pdf
    )

    # --------------------------------------------------------
    # SAVE PDF
    # --------------------------------------------------------

    pdf.showPage()

    pdf.save()

    pdf_buffer.seek(0)

    return pdf_buffer