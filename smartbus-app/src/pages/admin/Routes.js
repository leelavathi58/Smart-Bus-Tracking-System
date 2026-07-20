
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

function Routes() {

    const [routes, setRoutes] = useState([]);
    const [search, setSearch] = useState("");

    const [routeName, setRouteName] = useState("");
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [totalDistance, setTotalDistance] = useState("");

    const [averageSpeed, setAverageSpeed] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadRoutes();
    }, []);

    const loadRoutes = async () => {
        try {
            const response = await api.get("/BusRoute");
            setRoutes(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const addRoute = async (e) => {
        e.preventDefault();

        try {

            await api.post("/BusRoute", {
                routeName,
                source,
                destination,
                totalDistance,
                 averageSpeed
            });

            toast.success("Route Added Successfully");

            setRouteName("");
            setSource("");
            setDestination("");
            setTotalDistance("");

            loadRoutes();

        } catch (err) {
            console.log(err);
        }
    };

    const editRoute = (route) => {

        setEditingId(route.id);

        setRouteName(route.routeName);
        setSource(route.source);
        setDestination(route.destination);
        setTotalDistance(route.totalDistance);

        setIsEditing(true);
    };

    const updateRoute = async (e) => {

        e.preventDefault();

        try {

            await api.put(`/BusRoute/${editingId}`, {
                routeName,
                source,
                destination,
                totalDistance,
                 averageSpeed
            });

            toast.success("Route Updated Successfully");

            setRouteName("");
            setSource("");
            setDestination("");
            setTotalDistance("");

            setEditingId(null);
            setIsEditing(false);

            loadRoutes();

        } catch (err) {
            console.log(err);
        }
    };

    const deleteRoute = async (id) => {

        if (!window.confirm("Delete this route?"))
            return;

        try {

            await api.delete(`/BusRoute/${id}`);

            toast.success("Route Deleted Successfully");

            loadRoutes();

        } catch (err) {
            console.log(err);
        }
    };

    const filteredRoutes = routes.filter(route =>
    route.routeName.toLowerCase().includes(search.toLowerCase()) ||
    route.source.toLowerCase().includes(search.toLowerCase()) ||
    route.destination.toLowerCase().includes(search.toLowerCase())
);

    return (
        <div>

          <h2 className="page-title">
    <i className="bi bi-signpost-2-fill me-2 text-warning"></i>
    Route Management
</h2>

<div className="form-card">

    <h5 className="mb-4">
        {isEditing ? "Update Route" : "Add New Route"}
    </h5>

            <form
                onSubmit={isEditing ? updateRoute : addRoute}
                className="mb-4"
            >

                <div className="row">

                    <div className="col">
                        <input
                            className="form-control"
                            placeholder="Route Name"
                            value={routeName}
                            onChange={(e)=>setRouteName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col">
                        <input
                            className="form-control"
                            placeholder="Source"
                            value={source}
                            onChange={(e)=>setSource(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col">
                        <input
                            className="form-control"
                            placeholder="Destination"
                            value={destination}
                            onChange={(e)=>setDestination(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Distance"
                            value={totalDistance}
                            onChange={(e)=>setTotalDistance(e.target.value)}
                            required
                        />
                    </div>

<div className="col">
    <input
        type="number"
        className="form-control"
        placeholder="Average Speed (km/h)"
        value={averageSpeed}
        onChange={(e) => setAverageSpeed(e.target.value)}
        required
    />
</div>

                    <div className="col-auto">
                        <button className="btn btn-success">
                            {isEditing ? "Update" : "Add"}
                        </button>
                    </div>

                </div>

            </form>

            </div>

<div className="table-card">

<div className="d-flex justify-content-between align-items-center mb-3">

    <h5 className="mb-0">
        Route List
    </h5>

    <input
        className="form-control"
        style={{width:"300px"}}
        placeholder="🔍 Search Route..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
    />

</div>

                       <table className="table align-middle">


                <thead className="table-dark">

                    <tr>
                        <th>ID</th>
                        <th>Route</th>
                        <th>Source</th>
                        <th>Destination</th>
                        <th>Distance</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

                    {filteredRoutes.map(route => (

                        <tr key={route.id}>

                            <td>{route.id}</td>
                            <td>{route.routeName}</td>
                            <td>{route.source}</td>
                            <td>{route.destination}</td>
                            <td>{route.totalDistance} km</td>

                            <td>

                <button
    className="btn btn-warning btn-sm me-2"
    onClick={() => editRoute(route)}
>
    <i className="bi bi-pencil-square"></i>
</button>

<button
    className="btn btn-danger btn-sm"
    onClick={() => deleteRoute(route.id)}
>
    <i className="bi bi-trash"></i>
</button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>
            </div>
</div>
        
    );
}

export default Routes;