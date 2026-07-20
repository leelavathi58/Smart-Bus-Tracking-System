
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

import BusMap from "../../components/BusMap";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});


function Tracking() {

    const [routes, setRoutes] = useState([]);
    const [routeId, setRouteId] = useState("");
    const [tracking, setTracking] = useState([]);
const [busStops, setBusStops] = useState([]);

    const [lastUpdated, setLastUpdated] = useState("");

    useEffect(() => {
        loadRoutes();
    }, []);

  useEffect(() => {

    if (routeId === "") return;

    loadTracking();

    const timer = setInterval(() => {

        loadTracking();

    }, 5000);

    return () => clearInterval(timer);

}, [routeId]);

    const loadRoutes = async () => {

        const res = await api.get("/BusRoute");

        setRoutes(res.data);

    };
const loadTracking = async () => {

    if (routeId === "") return;

    try {

        const res = await api.get(`/Tracking/route/${routeId}`);
        setTracking(res.data);

        setLastUpdated(new Date().toLocaleTimeString());

        const stopRes = await api.get(`/BusStop/route/${routeId}`);
        setBusStops(stopRes.data);

    }
    catch (err) {

        console.log(err);

    }

};


const searchTracking = async () => {

    if (routeId === "") {

        toast.warning("Select Route");
        return;

    }

    await loadTracking();

};
const mapCenter =
    tracking.length > 0
        ? [tracking[0].latitude, tracking[0].longitude]
        : [11.0168, 76.9558];

    return (

        <div className="container-fluid">

          <h2 className="page-title">
    <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
    Live Bus Tracking
</h2>

            <div className="form-card mb-4">

<div className="row align-items-end">

                <div className="col-md-4">

                    <select
                        className="form-select"
                        value={routeId}
                        onChange={(e)=>setRouteId(e.target.value)}
                    >

                        <option value="">Select Route</option>

                        {
                            routes.map(route=>(
                                <option
                                    key={route.id}
                                    value={route.id}
                                >
                                    {route.routeName}
                                </option>
                            ))
                        }

                    </select>

                </div>

                <div className="col-auto">

                    <button
    className="btn btn-primary"
    onClick={() => searchTracking(true)}
>
    Search
</button>

                </div>

            </div>
            </div>

            
<div className="row">

    <div className="col-lg-8">

        <div className="card shadow-lg border-0 rounded-4">

            <div className="card-body">

{tracking.length > 0 && (
<BusMap
    latitude={tracking[0].latitude}
    longitude={tracking[0].longitude}
    busName={tracking[0].busNumber}
    busStops={busStops}
/>
)}

            </div>

        </div>

    </div>

    <div className="col-lg-4">

        {
            tracking.map(bus => (

                <div
                    className="card shadow mb-3 border-0 rounded-4"
                    key={bus.busId}
                >

                    <div className="card-body">

                        <h5>
                            🚍 {bus.busNumber}
                        </h5>

                        <hr />

                        <p>
                            <strong>Driver:</strong><br />
                            {bus.driverName}
                        </p>

                        <p>
                            <strong>Route:</strong><br />
                            {bus.routeName}
                        </p>

                        <p>
                            <strong>Source:</strong><br />
                            {bus.source}
                        </p>

                        <p>
                            <strong>Destination:</strong><br />
                            {bus.destination}
                        </p>

                        <p>
                            <strong>Latitude:</strong><br />
                            {bus.latitude}
                        </p>

                        <p>
                            <strong>Longitude:</strong><br />
                            {bus.longitude}
                        </p>

                        <p>
    <strong>Last Updated:</strong><br />
    {lastUpdated}
</p>

                        <span
                            className={`status-badge ${
                                bus.tripStatus === "Running"
                                    ? "running"
                                    : "inactive"
                            }`}
                        >
                            {bus.tripStatus}
                        </span>

                    </div>

                </div>

            ))
        }

    </div>

</div>
          

        </div>

    );

}

export default Tracking;