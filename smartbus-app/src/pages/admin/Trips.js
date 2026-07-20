
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

function Trips() {

    const [trips, setTrips] = useState([]);
      const [search, setSearch] = useState("");
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [routes, setRoutes] = useState([]);

    const [busId, setBusId] = useState("");
    const [driverId, setDriverId] = useState("");
    const [routeId, setRouteId] = useState("");

    const [startTime, setStartTime] = useState("");

    const [endTime, setEndTime] = useState("");

    const [status, setStatus] = useState("Scheduled");

    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {

        loadTrips();
        loadBuses();
        loadDrivers();
        loadRoutes();

    }, []);

    const loadTrips = async () => {

        const res = await api.get("/Trip");

        setTrips(res.data);

    };

    const loadBuses = async () => {

        const res = await api.get("/Bus");

        setBuses(res.data);

    };

    const loadDrivers = async () => {

        const res = await api.get("/Driver");

        setDrivers(res.data);

    };

    const loadRoutes = async () => {

        const res = await api.get("/BusRoute");

        setRoutes(res.data);

    };

    const addTrip = async (e) => {

        e.preventDefault();

        await api.post("/Trip", {

            busId,
            driverId,
            routeId,
            startTime

        });

        toast.success("Trip Created Successfully");

        setBusId("");
        setDriverId("");
        setRouteId("");
        setStartTime("");

        loadTrips();

    };

    const editTrip = (trip) => {

        setEditingId(trip.id);

        setEndTime(
            trip.endTime
                ? trip.endTime.substring(0,16)
                : ""
        );

        setStatus(trip.status);

        setIsEditing(true);

    };

    const updateTrip = async (e) => {

        e.preventDefault();

        await api.put(`/Trip/${editingId}`, {

            endTime,
            status

        });

        toast.success("Trip Updated");

        setEditingId(null);
        setIsEditing(false);

        setEndTime("");
        setStatus("Scheduled");

        loadTrips();

    };

    const deleteTrip = async (id) => {

        if(!window.confirm("Delete Trip?"))
            return;

        await api.delete(`/Trip/${id}`);

        loadTrips();

    };
    const filteredTrips = trips.filter(trip =>
    trip.busNumber.toLowerCase().includes(search.toLowerCase()) ||
    trip.driverName.toLowerCase().includes(search.toLowerCase()) ||
    trip.routeName.toLowerCase().includes(search.toLowerCase())
);

    return (

        <div className="container">

          <h2 className="page-title">
    <i className="bi bi-truck-front-fill me-2 text-primary"></i>
    Trip Management
</h2>

<div className="form-card">

    <h5 className="mb-4">
        {isEditing ? "Update Trip" : "Create New Trip"}
    </h5>

            <form onSubmit={isEditing ? updateTrip : addTrip}>

                <div className="row mb-3">

                    {
                        !isEditing &&
                        <>
                            <div className="col">

                                <select
                                    className="form-select"
                                    value={busId}
                                    onChange={(e)=>setBusId(e.target.value)}
                                    required
                                >

                                    <option value="">Select Bus</option>

                                    {
                                        buses.map(bus=>(
                                            <option
                                                key={bus.id}
                                                value={bus.id}
                                            >
                                                {bus.busNumber}
                                            </option>
                                        ))
                                    }

                                </select>

                            </div>

                            <div className="col">

                                <select
                                    className="form-select"
                                    value={driverId}
                                    onChange={(e)=>setDriverId(e.target.value)}
                                    required
                                >

                                    <option value="">Select Driver</option>

                                    {
                                        drivers.map(driver=>(
                                            <option
                                                key={driver.id}
                                                value={driver.id}
                                            >
                                                {driver.driverName}
                                            </option>
                                        ))
                                    }

                                </select>

                            </div>

                            <div className="col">

                                <select
                                    className="form-select"
                                    value={routeId}
                                    onChange={(e)=>setRouteId(e.target.value)}
                                    required
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

                            <div className="col">

                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={startTime}
                                    onChange={(e)=>setStartTime(e.target.value)}
                                    required
                                />

                            </div>
                        </>
                    }

                    {
                        isEditing &&
                        <>
                            <div className="col">

                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={endTime}
                                    onChange={(e)=>setEndTime(e.target.value)}
                                />

                            </div>

                            <div className="col">

                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={(e)=>setStatus(e.target.value)}
                                >

                                    <option>Scheduled</option>
                                    <option>Running</option>
                                    <option>Completed</option>

                                </select>

                            </div>

                        </>
                    }

                    <div className="col-auto">

                        <button className="btn btn-success">

                            {isEditing ? "Update" : "Create"}

                        </button>

                    </div>

                </div>

            </form>
            </div>

            <div className="table-card">

    <div className="d-flex justify-content-between align-items-center mb-3">

        <h5 className="mb-0">
            Trip List
        </h5>

        <input
            className="form-control"
            style={{ width: "300px" }}
            placeholder="🔍 Search Trip..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

    </div>

            <table className="table align-middle">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>
                        <th>Bus</th>
                        <th>Driver</th>
                        <th>Route</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                {
                        filteredTrips.map(trip=>(

                            <tr key={trip.id}>

                                <td>{trip.id}</td>

                                <td>{trip.busNumber}</td>

                                <td>{trip.driverName}</td>

                                <td>{trip.routeName}</td>

                               <td>
    {new Date(trip.startTime).toLocaleString()}
</td>

                                <td>
    {trip.endTime
        ? new Date(trip.endTime).toLocaleString()
        : "-"}
</td>
                                <td>
    <span
        className={`status-badge ${
            trip.status === "Running"
                ? "running"
                : trip.status === "Completed"
                ? "available"
                : "inactive"
        }`}
    >
        {trip.status}
    </span>
</td>

       <td className="text-center">

    <button
        className="icon-btn edit-btn"
        onClick={() => editTrip(trip)}
        title="Edit Trip"
    >
        <i className="bi bi-pencil-fill"></i>
    </button>

    <button
        className="icon-btn delete-btn"
        onClick={() => deleteTrip(trip.id)}
        title="Delete Trip"
    >
        <i className="bi bi-trash-fill"></i>
    </button>

</td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

</div>
        </div>

    );

}

export default Trips;