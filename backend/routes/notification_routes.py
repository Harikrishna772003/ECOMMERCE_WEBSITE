from flask import Blueprint, jsonify

from database.db import db
from models.notification import Notification

notification = Blueprint(
    "notification",
    __name__
)


# ==========================
# Get User Notifications
# ==========================
@notification.route(
    "/notifications/<int:user_id>",
    methods=["GET"]
)
def get_notifications(user_id):

    notifications = Notification.query.filter_by(
        user_id=user_id
    ).order_by(
        Notification.created_at.desc()
    ).all()

    result = []

    for item in notifications:

        result.append({

            "id": item.id,

            "title": item.title,

            "message": item.message,

            "is_read": item.is_read,

            "created_at": str(item.created_at)

        })

    return jsonify(result), 200


# ==========================
# Mark Notification as Read
# ==========================
@notification.route(
    "/notification/read/<int:id>",
    methods=["PUT"]
)
def mark_as_read(id):

    notification_data = Notification.query.get(id)

    if not notification_data:

        return jsonify({
            "message": "Notification Not Found"
        }), 404

    notification_data.is_read = True

    db.session.commit()

    return jsonify({

        "message": "Notification Marked as Read"

    }), 200