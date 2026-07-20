
import { useEffect, useRef, useState } from "react";
import api from "../api/api";

import "../css/notification.css";

function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(false);

    const dropdownRef = useRef();

    useEffect(() => {
        loadNotifications();
        loadUnreadCount();
    }, []);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShow(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    const loadNotifications = async () => {

        try {

            const response = await api.get("/Notification");

            setNotifications(response.data);

        }
        catch (err) {

            console.log(err);

        }

    };

    const loadUnreadCount = async () => {

        try {

            const response = await api.get("/Notification/unread-count");

            setCount(response.data.count);

        }
        catch (err) {

            console.log(err);

        }

    };

    const markAsRead = async (id) => {

        try {

            await api.put(`/Notification/read/${id}`);

            loadNotifications();

            loadUnreadCount();

        }
        catch (err) {

            console.log(err);

        }

    };

    return (

        <div
            className="notification-wrapper"
            ref={dropdownRef}
        >

            <div
                className="notification-icon"
                onClick={() => setShow(!show)}
            >

                <i className="bi bi-bell-fill fs-4"></i>

                {

                    count > 0 &&

                    <span className="notification-badge">

                        {count}

                    </span>

                }

            </div>

            {

                show &&

                <div className="notification-dropdown">

                    <h6 className="notification-title">

                        Notifications

                    </h6>

                    {

                        notifications.length === 0 ?

                            (

                                <div className="notification-empty">

                                    No Notifications

                                </div>

                            )

                            :

                            notifications.map(item => (

                                <div
                                    key={item.id}
                                    className={`notification-item ${item.isRead ? "" : "unread"}`}
                                    onClick={() => markAsRead(item.id)}
                                >

                                    <div className="notification-heading">

                                        {item.title}

                                    </div>

                                    <div className="notification-message">

                                        {item.message}

                                    </div>

                                    <small>

                                        {new Date(item.createdAt).toLocaleString()}

                                    </small>

                                </div>

                            ))

                    }

                </div>

            }

        </div>

    );

}

export default NotificationBell;