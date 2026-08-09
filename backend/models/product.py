from database.db import db


class Product(db.Model):

    __tablename__ = "products"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    price = db.Column(
        db.Float,
        nullable=False
    )

    image = db.Column(
        db.String(300),
        nullable=False
    )

    category = db.Column(
        db.String(100),
        nullable=False
    )

    stock = db.Column(
        db.Integer,
        default=0
    )