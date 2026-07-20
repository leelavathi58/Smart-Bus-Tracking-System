import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import api from "../api/api";
import NotificationBell from "../components/NotificationBell";
function DriverLayout() {

    const navigate = useNavigate();

 const logout = async () => {
    try {
        await api.post("/Auth/logout");
    }
    catch (err) {
        console.log(err);
    }

    localStorage.clear();
    navigate("/");
};

    const name = localStorage.getItem("fullName") || "Driver";

    return (

        <div className="app-layout">

            {/* Sidebar */}

            <div className="sidebar">

                <div className="sidebar-header">

                    🚌 SmartBus

                </div>

                <div className="sidebar-menu">

                    <NavLink to="/driver" end>
                        <i className="bi bi-speedometer2"></i>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/driver/trip">
                        <i className="bi bi-calendar-event"></i>
                        <span>My Trip</span>
                    </NavLink>

                    <NavLink to="/driver/location">
                        <i className="bi bi-geo-alt"></i>
                        <span>Update Location</span>
                    </NavLink>

                    <NavLink to="/driver/profile">
                        <i className="bi bi-person-circle"></i>
                        <span>Profile</span>
                    </NavLink>

                </div>

            </div>

            {/* Main */}

            <div className="main-content">

                <div className="topbar">

                    <h5 className="m-0">

                        Driver Dashboard

                    </h5>

                    <div className="top-right">

                        <NotificationBell />

                        <div className="avatar">

                            {name.charAt(0).toUpperCase()}

                        </div>

                        <strong>

                            {name}

                        </strong>

                        <button
                            className="logout-btn"
                            onClick={logout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

                <div className="content">

                    <Outlet />

                </div>

                <ChatWidget />

            </div>

        </div>

    );

}

export default DriverLayout;