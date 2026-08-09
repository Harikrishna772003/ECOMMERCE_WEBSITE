import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/NotificationBell.css";

function NotificationBell() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [notifications, setNotifications] = useState([]);

    const [open, setOpen] = useState(false);

    useEffect(() => {

        if (user) {

            fetchNotifications();

            const interval = setInterval(() => {

                fetchNotifications();

            }, 5000);

            return () => clearInterval(interval);

        }

    }, []);

    const fetchNotifications = async () => {

        try {

            const response = await API.get(
                `/api/notifications/${user.id}`
            );

            setNotifications(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const markAsRead = async (id) => {

        try {

            await API.put(
                `/api/notification/read/${id}`
            );

            fetchNotifications();

        }

        catch (error) {

            console.log(error);

        }

    };

    const unreadCount = notifications.filter(

        item => !item.is_read

    ).length;

    return (

        <div className="notification-wrapper">

            <div

                className="notification-icon"

                onClick={() =>

                    setOpen(!open)

                }

            >

                🔔

                {unreadCount > 0 && (

                    <span className="notification-count">

                        {unreadCount}

                    </span>

                )}

            </div>

            {

                open && (

                    <div className="notification-dropdown">

                        <h3>

                            Notifications

                        </h3>

                        {

                            notifications.length === 0 ?

                                (

                                    <p>

                                        No Notifications

                                    </p>

                                )

                                :

                                notifications.map(

                                    (item) => (

                                        <div

                                            key={item.id}

                                            className={

                                                item.is_read

                                                    ?

                                                    "notification-item"

                                                    :

                                                    "notification-item unread"

                                            }

                                            onClick={() =>

                                                markAsRead(item.id)

                                            }

                                        >

                                            <h4>

                                                {item.title}

                                            </h4>

                                            <p>

                                                {item.message}

                                            </p>

                                            <small>

                                                {item.created_at}

                                            </small>

                                        </div>

                                    )

                                )

                        }

                    </div>

                )

            }

        </div>

    );

}

export default NotificationBell;