import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";
import BusMap from "../../components/BusMap";

function TrackBus() {

    const [routes, setRoutes] = useState([]);
    const [routeId, setRouteId] = useState("");
    const [tracking, setTracking] = useState([]);
    const [busStops, setBusStops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [eta, setEta] = useState(null);

useEffect(() => {
    loadRoutes();
}, []);

    const loadRoutes = async () => {

        try {

            const response = await api.get("/BusRoute");

            setRoutes(response.data);

        }
        catch (err) {

            console.log(err);

        }

    };

    const loadETA = async (busId) => {
    try {
        const response = await api.get(`/BusLocation/eta/${busId}`);
        setEta(response.data);
    } catch (err) {
        console.log(err);
    }
};

    const searchBus = async () => {

        if (routeId === "") {

            toast.warning("Please select a route");

            return;

        }

        try {

            setLoading(true);

            const response = await api.get(`/Tracking/route/${routeId}`);

setTracking(response.data);

console.log(response.data);

if (response.data.length > 0) {
    console.log("ETA BusId:", response.data[0].busId);
    loadETA(response.data[0].busId);
}
            const stopRes = await api.get(`/BusStop/route/${routeId}`);
setBusStops(stopRes.data);

        }
        catch (err) {

            console.log(err);

            toast.error("No Bus Found");

            setTracking([]);

            setEta(null);

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div>

            <h2 className="page-title">

                <i className="bi bi-geo-alt-fill me-2 text-primary"></i>

                Live Bus Tracking

            </h2>

            {/* Search Card */}

            <div className="form-card mb-4">

                <div className="row g-3 align-items-end">

                    <div className="col-md-8">

                        <label className="form-label">

                            Select Route

                        </label>

                        <select
                            className="form-select"
                            value={routeId}
                            onChange={(e) => {
    setRouteId(e.target.value);
    setEta(null);
}}
                        >

                            <option value="">

                                Choose Route

                            </option>

                            {
                                routes.map(route => (

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

                    <div className="col-md-4">

                        <button
                            className="btn btn-primary w-100"
                            onClick={searchBus}
                        >

                            <i className="bi bi-search me-2"></i>

                            Track Bus

                        </button>

                    </div>

                </div>

            </div>

            {/* Loading */}

            {

                loading &&

                <div className="text-center my-5">

                    <div className="spinner-border text-primary"></div>

                    <p className="mt-3">

                        Fetching Live Bus Location...

                    </p>

                </div>

            }

            {

                !loading && tracking.length > 0 &&

                <div className="row">

                    {/* Map */}

                    <div className="col-lg-8 mb-4">

                        <div className="chart-card">

                            <h5 className="mb-3">

                                Live Map

                            </h5>
<BusMap
    latitude={tracking[0].latitude}
    longitude={tracking[0].longitude}
    busName={tracking[0].busNumber}
    busStops={busStops}
/>

                        </div>

                    </div>

                    {/* Bus Information */}

                    <div className="col-lg-4">

                        <div className="chart-card">

                            <h5 className="mb-4">

                                Bus Information

                            </h5>

                            <p>

                                <strong>🚌 Bus :</strong>

                                {tracking[0].busNumber}

                            </p>

                            <p>

                                <strong>👨 Driver :</strong>

                                {tracking[0].driverName}

                            </p>

                            <p>

                                <strong>🛣 Route :</strong>

                                {tracking[0].routeName}

                            </p>

                            <p>

                                <strong>📍 Source :</strong>

                                {tracking[0].source}

                            </p>

                            <p>

                                <strong>🏁 Destination :</strong>

                                {tracking[0].destination}

                            </p>

                            <p>

                                <strong>Status :</strong>

                                <span className="status-badge running ms-2">

                                    {tracking[0].tripStatus}

                                </span>

                            </p>

                            <hr />

                            <p>

                                <strong>Latitude :</strong>

                                {tracking[0].latitude}

                            </p>

                            <p>

                                <strong>Longitude :</strong>

                                {tracking[0].longitude}

                            </p>

                        </div>

                    </div>

                </div>

            }

            {eta && (
    <div className="chart-card mt-4">
        <div className="card-body">

            <h5 className="mb-3">
                Estimated Arrival
            </h5>

            <p>
                <strong>Bus:</strong> {eta.busNumber}
            </p>

            <p>
                <strong>Route:</strong> {eta.routeName}
            </p>

            <p>
                <strong>Total Distance:</strong> {eta.totalDistanceKm} km
            </p>

            <p>
                <strong>Remaining Distance:</strong> {eta.remainingDistanceKm} km
            </p>

            <p className="fs-5 text-primary">
                <strong>ETA:</strong> {eta.estimatedMinutes} minutes
            </p>

        </div>
    </div>
)}

            {/* Result Table */}

            {

                tracking.length > 0 &&

                <div className="table-card mt-4">

                    <h5 className="mb-3">

                        Live Tracking Details

                    </h5>

                    <table className="table align-middle">

                        <thead className="table-dark">

                            <tr>

                                <th>Bus</th>
                                <th>Driver</th>
                                <th>Route</th>
                                <th>Source</th>
                                <th>Destination</th>
                                <th>Status</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                tracking.map(bus => (

                                    <tr key={bus.busId}>

                                        <td>{bus.busNumber}</td>

                                        <td>{bus.driverName}</td>

                                        <td>{bus.routeName}</td>

                                        <td>{bus.source}</td>

                                        <td>{bus.destination}</td>

                                        <td>

                                            <span className="status-badge running">

                                                {bus.tripStatus}

                                            </span>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            }

        </div>

    );

}

export default TrackBus;