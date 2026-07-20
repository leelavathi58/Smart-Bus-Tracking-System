
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

function RouteStops() {
    const [editingId, setEditingId] = useState(null);
const [isEditing, setIsEditing] = useState(false);
    const [routeStops, setRouteStops] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [stops, setStops] = useState([]);
    const [search, setSearch] = useState("");
    const [routeId, setRouteId] = useState("");
    const [busStopId, setBusStopId] = useState("");
    const [stopOrder, setStopOrder] = useState("");

    useEffect(() => {
        loadRouteStops();
        loadRoutes();
        loadStops();
    }, []);

    const loadRouteStops = async () => {
        try {
            const response = await api.get("/RouteStop");
            setRouteStops(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const loadRoutes = async () => {
        try {
            const response = await api.get("/BusRoute");
            setRoutes(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const loadStops = async () => {
        try {
            const response = await api.get("/BusStop");
            setStops(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const addRouteStop = async (e) => {

        e.preventDefault();

        try {

            await api.post("/RouteStop", {
                routeId,
                busStopId,
                stopOrder
            });

            toast.success("Route Stop Assigned Successfully");

            setRouteId("");
            setBusStopId("");
            setStopOrder("");

            loadRouteStops();

        } catch (err) {

            console.log(err);
            toast.error("Unable to assign route stop");

        }
    };

    const deleteRouteStop = async (id) => {

        if (!window.confirm("Delete this Route Stop?"))
            return;

        try {

            await api.delete(`/RouteStop/${id}`);

            toast.success("Deleted Successfully");

            loadRouteStops();

        } catch (err) {

            console.log(err);

        }
    };
const editRouteStop = (item) => {

    setEditingId(item.id);

    setRouteId(item.routeId);
    setBusStopId(item.busStopId);
    setStopOrder(item.stopOrder);

    setIsEditing(true);
};
const updateRouteStop = async (e) => {

    e.preventDefault();

    try {

      await api.put(`/RouteStop/${editingId}`, {
    routeId,
    busStopId,
    stopOrder
});

        toast.success("Route Stop Updated Successfully");

        setEditingId(null);
        setIsEditing(false);

        setRouteId("");
        setBusStopId("");
        setStopOrder("");

        loadRouteStops();

    } catch (err) {

        console.log(err);
        toast.error("Unable to update");

    }
};

const filteredRouteStops = routeStops.filter(item =>
    item.routeName.toLowerCase().includes(search.toLowerCase()) ||
    item.stopName.toLowerCase().includes(search.toLowerCase())
);

    return (

        <div className="container mt-3">

         <h2 className="page-title">
    <i className="bi bi-signpost-split-fill me-2 text-primary"></i>
    Route Stops
</h2>

<div className="form-card">

    <h5 className="mb-4">
        {isEditing ? "Update Route Stop" : "Assign Stop to Route"}
    </h5>

            <form onSubmit={isEditing ? updateRouteStop : addRouteStop}>

                <div className="row mb-4">

                    <div className="col-md-4">

                        <label className="form-label">
                            Route
                        </label>

                        <select
                            className="form-select"
                            value={routeId}
                            onChange={(e) => setRouteId(e.target.value)}
                            required
                        >

                            <option value="">Select Route</option>

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

                        <label className="form-label">
                            Bus Stop
                        </label>

                        <select
                            className="form-select"
                            value={busStopId}
                            onChange={(e) => setBusStopId(e.target.value)}
                            required
                        >

                            <option value="">Select Bus Stop</option>

                            {
                                stops.map(stop => (

                                    <option
                                        key={stop.id}
                                        value={stop.id}
                                    >
                                        {stop.stopName}
                                    </option>

                                ))
                            }

                        </select>

                    </div>

                    <div className="col-md-2">

                        <label className="form-label">
                            Stop Order
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            value={stopOrder}
                            onChange={(e) => setStopOrder(e.target.value)}
                            required
                        />

                    </div>

                    <div className="col-md-2 d-flex align-items-end">

                      <button className="btn btn-success w-100">
    {isEditing ? "Update" : "Assign"}
</button>

                    </div>

                </div>

            </form>
</div>
            <div className="table-card">

<div className="d-flex justify-content-between align-items-center mb-3">

    <h5 className="mb-0">
        Route Stop List
    </h5>

    <input
        className="form-control"
        style={{ width: "300px" }}
        placeholder="🔍 Search..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
    />

</div>

                       <table className="table align-middle">


                <thead className="table-dark">

                    <tr>

                        <th>ID</th>
                        <th>Route</th>
                        <th>Bus Stop</th>
                        <th>Stop Order</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        filteredRouteStops.map(item => (

                            <tr key={item.id}>

                                <td>{item.id}</td>
<td>
    <span className="badge bg-primary">
        {item.routeName}
    </span>
</td>

<td>
    <span className="badge bg-success">
        {item.stopName}
    </span>
</td>

                                <td>{item.stopOrder}</td>

                                <td>

 <button
    className="btn btn-warning btn-sm me-2"
    onClick={() => editRouteStop(item)}
>
    <i className="bi bi-pencil-square"></i>
</button>

<button
    className="btn btn-danger btn-sm"
    onClick={() => deleteRouteStop(item.id)}
>
    <i className="bi bi-trash"></i>
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

export default RouteStops;