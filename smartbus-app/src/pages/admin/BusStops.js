
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";


import {
    MapContainer,
    TileLayer,
    Marker,
    Tooltip,
    useMapEvents,
    useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function LocationPicker({
    setLatitude,
    setLongitude,
    setAddress,
    setStopName
}) {

    useMapEvents({

        async click(e) {

            const lat = e.latlng.lat.toFixed(6);
            const lng = e.latlng.lng.toFixed(6);

            setLatitude(lat);
            setLongitude(lng);

            try {

                // Reverse Geocoding (Address)

                const geoRes = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );

                const geoData = await geoRes.json();

                setAddress(geoData.display_name || "");

                // Search nearby Bus Stops (within 100m)

                const overpassQuery = `
[out:json];
(
node["highway"="bus_stop"](around:100,${lat},${lng});
);
out;
`;

                const stopRes = await fetch(
                    "https://overpass-api.de/api/interpreter",
                    {
                        method: "POST",
                        body: overpassQuery
                    }
                );

                const stopData = await stopRes.json();

                if (
                    stopData.elements &&
                    stopData.elements.length > 0 &&
                    stopData.elements[0].tags?.name
                ) {

                    // Official Bus Stop Name

                    setStopName(stopData.elements[0].tags.name);

                }
                else {

                    // Fallback

                    const a = geoData.address;

                    setStopName(

                        a.bus_stop ||
                        a.amenity ||
                        a.building ||
                        a.road ||
                        a.suburb ||
                        a.neighbourhood ||
                        a.village ||
                        a.city ||
                        geoData.display_name.split(",")[0]

                    );

                }

            }
            catch {

                setAddress("Address not found");

                setStopName("");

            }

        }

    });

    return null;

}

function ChangeView({ center }) {

    const map = useMap();

    useEffect(() => {

        map.setView(center, 16, {
            animate: true
        });

    }, [center, map]);

    return null;

}

function BusStops() {

    const [stops, setStops] = useState([]);
    const [search, setSearch] = useState("");
    const [stopName, setStopName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [address, setAddress] = useState("");

    const [routes, setRoutes] = useState([]);
const [routeId, setRouteId] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const defaultCenter = [11.0168, 76.9558];
useEffect(() => {
    loadStops();
    loadRoutes();
}, []);

    const loadStops = async () => {
        const response = await api.get("/BusStop");
        setStops(response.data);
    };

    const loadRoutes = async () => {
    const response = await api.get("/BusRoute");
    setRoutes(response.data);
};
    const addStop = async (e) => {

        e.preventDefault();

   await api.post("/BusStop", {
    stopName,
    latitude,
    longitude,
    routeId
});

        toast.success("Bus Stop Added");

        setStopName("");
        setLatitude("");
        setLongitude("");
        setAddress("");
        setRouteId("");

        setEditingId(null);
setIsEditing(false);

        loadStops();
    };

const editStop = (stop) => {

    setEditingId(stop.id);

    setStopName(stop.stopName);

    setLatitude(stop.latitude);

    setLongitude(stop.longitude);
    setAddress("");

    setRouteId(stop.routeId ?? "");

    fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${stop.latitude}&lon=${stop.longitude}`
)
.then(res => res.json())
.then(data => setAddress(data.display_name || "Unknown Location"))
.catch(() => setAddress(""));

    setIsEditing(true);

};
    const updateStop = async (e) => {

        e.preventDefault();

 await api.put(`/BusStop/${editingId}`, {
    stopName,
    latitude,
    longitude,
    routeId
});

        toast.success("Bus Stop Updated");

        setEditingId(null);
        setIsEditing(false);

        setStopName("");
        setLatitude("");
        setLongitude("");
        setAddress("");
        setRouteId("");

        loadStops();
    };

    const deleteStop = async (id) => {

        if (!window.confirm("Delete Bus Stop?"))
            return;

        await api.delete(`/BusStop/${id}`);

        toast.success("Bus Stop Deleted");

        loadStops();
    };

const filteredStops = stops.filter(stop =>
    stop.stopName.toLowerCase().includes(search.toLowerCase()) ||
    stop.latitude.toString().includes(search) ||
    stop.longitude.toString().includes(search)
);

    return (

        <div>

          <h2 className="page-title">
    <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
    Bus Stop Management
</h2>

<div className="form-card">

    <h5 className="mb-4">
        {isEditing ? "Update Bus Stop" : "Add Bus Stop"}
    </h5>
            <form onSubmit={isEditing ? updateStop : addStop}>

                <div className="row mb-3">

                    <div className="col">
    <select
        className="form-select"
        value={routeId}
        onChange={(e) => setRouteId(e.target.value)}
        required
    >
        <option value="">Select Route</option>

        {routes.map(route => (
            <option
                key={route.id}
                value={route.id}
            >
                {route.routeName}
            </option>
        ))}
    </select>
</div>

                    <div className="col">
                        <input
                            className="form-control"
                            placeholder="Stop Name"
                            value={stopName}
                            onChange={(e)=>setStopName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col">
                  <input
    className="form-control"
    placeholder="Latitude"
    value={latitude}
    readOnly
/>
                    </div>

                    <div className="col">
               <input
    className="form-control"
    placeholder="Longitude"
    value={longitude}
    readOnly
/>
                    </div>

                    <div className="col-auto">
    <button className="btn btn-success">
        {isEditing ? "Update" : "Add"}
    </button>

    {isEditing && (
        <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
                setEditingId(null);
                setIsEditing(false);

                setStopName("");
                setLatitude("");
                setLongitude("");
                setAddress("");
            }}
        >
            Cancel
        </button>
    )}
</div>

                </div>
                <div className="mb-4">

    <label className="form-label fw-bold">

        📍 Click on the map to select the Bus Stop location

    </label>

    <MapContainer

        center={
            latitude && longitude
                ? [parseFloat(latitude), parseFloat(longitude)]
                : defaultCenter
        }

        zoom={14}

        style={{

            height: "350px",

            width: "100%",

            borderRadius: "10px"

        }}

    >

<TileLayer
    attribution="&copy; OpenStreetMap contributors"
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

<ChangeView
    center={
        latitude && longitude
            ? [
                  parseFloat(latitude),
                  parseFloat(longitude)
              ]
            : defaultCenter
    }
/>

<LocationPicker
    setLatitude={setLatitude}
    setLongitude={setLongitude}
    setAddress={setAddress}
    setStopName={setStopName}
/>

{
    latitude && longitude && (

        <Marker
            position={[
                parseFloat(latitude),
                parseFloat(longitude)
            ]}
        >
            <Tooltip
                permanent
                direction="top"
                offset={[0, -15]}
            >
                <strong>{stopName || "New Bus Stop"}</strong>
            </Tooltip>
        </Marker>

    )
}

    </MapContainer>

    <div className="mt-3">

    <label className="form-label fw-bold">
        Selected Address
    </label>

    <textarea
        className="form-control"
        rows="2"
        value={address}
        readOnly
    />

</div>

</div>

            </form>
            </div>

            <div className="table-card">

<div className="d-flex justify-content-between align-items-center mb-3">

    <h5 className="mb-0">
        Bus Stop List
    </h5>

    <input
        className="form-control"
        style={{ width: "300px" }}
        placeholder="🔍 Search Stop..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
    />

</div>

            <table className="table align-middle">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>
                        <th>Stop Name</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {filteredStops.map(stop => (

                        <tr key={stop.id}>

                            <td>{stop.id}</td>
                            <td>{stop.stopName}</td>
                            <td>{stop.latitude}</td>
                            <td>{stop.longitude}</td>

                            <td>

       <button
    className="btn btn-warning btn-sm me-2"
    onClick={() => editStop(stop)}
>
    <i className="bi bi-pencil-square"></i>
</button>

<button
    className="btn btn-danger btn-sm"
    onClick={() => deleteStop(stop.id)}
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

export default BusStops;