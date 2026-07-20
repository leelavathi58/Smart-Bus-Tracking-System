import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/auth/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Buses from "./pages/admin/Buses";
import Drivers from "./pages/admin/Drivers";
import RoutesPage from "./pages/admin/Routes";
import BusStops from "./pages/admin/BusStops";
import RouteStops from "./pages/admin/RouteStops";
import Trips from "./pages/admin/Trips";
import BusLocations from "./pages/admin/BusLocations";
import Tracking from "./pages/admin/Tracking";
import DriverLayout from "./layouts/DriverLayout";
import DriverDashboard from "./pages/driver/DriverDashboard";
import MyTrip from "./pages/driver/MyTrip";
import UpdateLocation from "./pages/driver/UpdateLocation";
import PassengerLayout from "./layouts/PassengerLayout";
import PassengerDashboard from "./pages/passenger/PassengerDashboard";
import TrackBus from "./pages/passenger/TrackBus";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/common/Profile";
import ChangePassword from "./pages/common/ChangePassword";
import ActivityHistory from "./pages/admin/ActivityHistory";
function App() {
    return (
        <BrowserRouter>

    <Routes>

        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route
    path="/admin"
    element={
        <ProtectedRoute allowedRole="Admin">
            <AdminLayout />
        </ProtectedRoute>
    }
>
            <Route index element={<AdminDashboard />} />
            <Route path="buses" element={<Buses />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="stops" element={<BusStops />} />
            <Route path="route-stops" element={<RouteStops />} />
            <Route path="trips" element={<Trips />} />
            <Route path="bus-locations" element={<BusLocations />} />
            <Route path="tracking" element={<Tracking />} />
             <Route path="history" element={<ActivityHistory />} />

            <Route path="profile" element={<Profile />} />
            
        </Route>

        {/* Driver Routes */}
        <Route
    path="/driver"
    element={
        <ProtectedRoute allowedRole="Driver">
            <DriverLayout />
        </ProtectedRoute>
    }
>
            <Route index element={<DriverDashboard />} />
            <Route path="trip" element={<MyTrip />} />
            <Route path="location" element={<UpdateLocation />} />
            <Route path="profile" element={<Profile />} />
            
        </Route>

        <Route
    path="/passenger"
    element={
        <ProtectedRoute allowedRole="Passenger">
            <PassengerLayout />
        </ProtectedRoute>
    }
>
            <Route index element={<PassengerDashboard />} />
            <Route path="track" element={<TrackBus />} />
            <Route path="profile" element={<Profile />} />
            
        </Route>

    </Routes>

    <ToastContainer
    position="top-right"
    autoClose={2500}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    theme="colored"
/>

</BrowserRouter>
    );
}

export default App;