import { useEffect, useState } from "react";
import api from "../../api/api";

function BusLocations() {

    const [locations, setLocations] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadLocations();
    }, []);

    const loadLocations = async () => {

        try {

            const res = await api.get("/BusLocation");

            setLocations(res.data);

        }
        catch (err) {

            console.log(err);

        }

    };

    const filteredLocations = locations.filter(location =>
        location.busNumber.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div className="container">

            <h2 className="page-title">
                <i className="bi bi-geo-fill me-2 text-danger"></i>
                Live Bus Locations
            </h2>

            <div className="table-card">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="mb-0">
                        Current Bus Locations
                    </h5>

                    <input
                        className="form-control"
                        style={{ width: "300px" }}
                        placeholder="🔍 Search Bus..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <table className="table align-middle">

                    <thead className="table-dark">

                        <tr>

                            <th>ID</th>
                            <th>Bus Number</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Last Updated</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            filteredLocations.map(location => (

                                <tr key={location.id}>

                                    <td>{location.id}</td>

                                    <td>{location.busNumber}</td>

                                    <td>
                                        <span className="badge bg-primary">
                                            {location.latitude}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="badge bg-success">
                                            {location.longitude}
                                        </span>
                                    </td>

                                    <td>
                                        {new Date(location.updatedAt).toLocaleString()}
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

export default BusLocations;