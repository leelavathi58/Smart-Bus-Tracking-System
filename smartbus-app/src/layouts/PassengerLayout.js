import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import NotificationBell from "../components/NotificationBell";
import api from "../api/api";


function PassengerLayout() {

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

    const name = localStorage.getItem("fullName") || "Passenger";

    return (

        <div className="app-layout">

            {/* Sidebar */}

            <div className="sidebar">

                <div className="sidebar-header">

                    🚌 SmartBus

                </div>

                <div className="sidebar-menu">

                    <NavLink to="/passenger" end>

                        <i className="bi bi-speedometer2"></i>

                        <span>Dashboard</span>

                    </NavLink>

                    <NavLink to="/passenger/track">

                        <i className="bi bi-map"></i>

                        <span>Track Bus</span>

                    </NavLink>

                    <NavLink to="/passenger/profile">

                        <i className="bi bi-person-circle"></i>

                        <span>Profile</span>

                    </NavLink>

                </div>

            </div>

            {/* Main */}

            <div className="main-content">

                <div className="topbar">

                    <h5 className="m-0">

                        Passenger Dashboard

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



                <footer className="text-center py-3 mt-4 border-top text-muted">

                    © 2026 Smart Bus Tracking System | Developed by Leelavathi

                </footer>

            </div>

        </div>

    );

}

export default PassengerLayout;