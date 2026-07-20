import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import api from "../api/api";
import NotificationBell from "../components/NotificationBell";
function AdminLayout() {

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

    const name = localStorage.getItem("fullName") || "Admin";

    return (

        <div className="app-layout">

            {/* Sidebar */}

            <div className="sidebar">

                <div className="sidebar-header">

                    🚌 SmartBus

                </div>

                <div className="sidebar-menu">

                    <NavLink to="/admin" end>
                        <i className="bi bi-speedometer2"></i>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/admin/buses">
                        <i className="bi bi-bus-front"></i>
                        <span>Buses</span>
                    </NavLink>

                    <NavLink to="/admin/drivers">
                        <i className="bi bi-person-badge"></i>
                        <span>Drivers</span>
                    </NavLink>

                    <NavLink to="/admin/routes">
                        <i className="bi bi-signpost-2"></i>
                        <span>Routes</span>
                    </NavLink>

                    <NavLink to="/admin/stops">
                        <i className="bi bi-geo-alt"></i>
                        <span>Bus Stops</span>
                    </NavLink>

                    <NavLink to="/admin/route-stops">
                        <i className="bi bi-diagram-3"></i>
                        <span>Route Stops</span>
                    </NavLink>

                    <NavLink to="/admin/trips">
                        <i className="bi bi-calendar-event"></i>
                        <span>Trips</span>
                    </NavLink>

                    <NavLink to="/admin/bus-locations">
                        <i className="bi bi-pin-map"></i>
                        <span>Locations</span>
                    </NavLink>

                    <NavLink to="/admin/tracking">
                        <i className="bi bi-map"></i>
                        <span>Tracking</span>
                    </NavLink>

                    <NavLink to="/admin/profile">
                        <i className="bi bi-person-circle"></i>
                        <span>Profile</span>
                    </NavLink>

                </div>

            </div>

            {/* Main */}

            <div className="main-content">

                <div className="topbar">

                    <h5 className="m-0">

                        Admin Dashboard

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

export default AdminLayout;