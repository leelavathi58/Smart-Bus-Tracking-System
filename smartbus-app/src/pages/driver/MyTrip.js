import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";

function MyTrip() {

    const [trips, setTrips] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadTrips();
    }, []);

const loadTrips = async () => {

    try {

        const response = await api.get("/Trip/my-trips");

        console.log(response.data);   // <-- Add this

        setTrips(response.data);

    }
    catch (err) {

        console.log(err);

    }

};
    const startTrip = async (id) => {

        try {

            await api.put(`/Trip/start/${id}`);

            toast.success("Trip Started Successfully");

            loadTrips();

        }
        catch (err) {

            console.log(err);

            toast.error("Unable to Start Trip");

        }

    };

    const endTrip = async (id) => {

        try {

            await api.put(`/Trip/end/${id}`);

            toast.success("Trip Ended Successfully");

            loadTrips();

        }
        catch (err) {

            console.log(err);

            toast.error("Unable to End Trip");

        }

    };

    const filteredTrips = trips.filter(trip =>
        trip.busNumber.toLowerCase().includes(search.toLowerCase()) ||
        trip.routeName.toLowerCase().includes(search.toLowerCase()) ||
        trip.driverName.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div>

            <h2 className="page-title">
                <i className="bi bi-calendar-event me-2 text-primary"></i>
                My Trips
            </h2>

            <div className="table-card">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="mb-0">
                        Assigned Trips
                    </h5>

                    <input
                        className="form-control"
                        style={{ width: "300px" }}
                        placeholder="🔍 Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <table className="table align-middle">

                    <thead className="table-dark">

                        <tr>

                            <th>Bus</th>
                            <th>Driver</th>
                            <th>Route</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Status</th>
                            <th className="text-center">Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            filteredTrips.map(trip => (

                                <tr key={trip.id}>

                                    <td>{trip.busNumber}</td>

                                    <td>{trip.driverName}</td>

                                    <td>{trip.routeName}</td>

                                    <td>{trip.startTime}</td>

                                    <td>{trip.endTime || "-"}</td>

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

    {trip.status === "Running" ? (

        <button
            className="btn btn-danger btn-sm"
            onClick={() => endTrip(trip.id)}
        >
            <i className="bi bi-stop-fill me-1"></i>
            End
        </button>

    ) : (

        <button
            className="btn btn-success btn-sm"
            onClick={() => startTrip(trip.id)}
        >
            <i className="bi bi-play-fill me-1"></i>
            Start
        </button>

    )}

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

export default MyTrip;