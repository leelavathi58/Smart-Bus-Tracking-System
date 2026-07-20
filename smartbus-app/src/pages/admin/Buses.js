
import { useEffect, useState } from "react";
import api from "../../api/api";

import { toast } from "react-toastify";

import LoadingSpinner from "../../components/LoadingSpinner";

function Buses() {
    const [busNumber, setBusNumber] = useState("");
    const [busName, setBusName] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [capacity, setCapacity] = useState("");
    const [buses, setBuses] = useState([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBuses();
    }, []);

const loadBuses = async () => {
    try {
        setLoading(true);

        const response = await api.get("/Bus");

        setBuses(response.data);
    }
    catch (err) {
        console.log(err);
    }
    finally {
        setLoading(false);
    }
};

    const addBus = async (e) => {
    e.preventDefault();

    try {
        await api.post("/Bus", {
            busNumber,
            busName,
            registrationNumber,
            capacity
        });

        toast.success("Bus added successfully");

        setBusNumber("");
        setBusName("");
        setRegistrationNumber("");
        setCapacity("");

        loadBuses();

    } catch (err) {
        console.log(err);
       toast.error("Unable to add bus");
    }
};
const deleteBus = async (id) => {

    if (!window.confirm("Are you sure you want to delete this bus?"))
        return;

    try {

        await api.delete(`/Bus/${id}`);

        toast.success("Bus deleted successfully");

        loadBuses();

    }
    catch (err) {

        console.log(err);

       toast.error("Unable to delete bus");

    }

};

const editBus = (bus) => {

    setEditingId(bus.id);

    setBusNumber(bus.busNumber);
    setBusName(bus.busName);
    setRegistrationNumber(bus.registrationNumber);
    setCapacity(bus.capacity);

    setIsEditing(true);

};
const updateBus = async (e) => {

    e.preventDefault();

    try {

        await api.put(`/Bus/${editingId}`, {

            busNumber,
            busName,
            registrationNumber,
            capacity

        });

        toast.success("Bus updated successfully");

        setBusNumber("");
        setBusName("");
        setRegistrationNumber("");
        setCapacity("");

        setEditingId(null);
        setIsEditing(false);

        loadBuses();

    }
    catch (err) {

        console.log(err);

       toast.error("Unable to update bus");

    }

};

const filteredBuses = buses.filter(bus =>
    bus.busNumber.toLowerCase().includes(search.toLowerCase()) ||
    bus.busName.toLowerCase().includes(search.toLowerCase()) ||
    bus.registrationNumber.toLowerCase().includes(search.toLowerCase())
);
    return (
        <div>

            <h2 className="page-title">
    <i className="bi bi-bus-front me-2 text-primary"></i>
    Bus Management
</h2>

<div className="form-card">

    <h5 className="mb-4">

        {isEditing ? "Update Bus" : "Add New Bus"}

    </h5>

    <form onSubmit={isEditing ? updateBus : addBus}>

        <div className="row g-3">

            <div className="col-md-3">

                <label className="form-label">
                    Bus Number
                </label>

                <input
                    className="form-control"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    required
                />

            </div>

            <div className="col-md-3">

                <label className="form-label">
                    Bus Name
                </label>

                <input
                    className="form-control"
                    value={busName}
                    onChange={(e) => setBusName(e.target.value)}
                    required
                />

            </div>

            <div className="col-md-3">

                <label className="form-label">
                    Registration Number
                </label>

                <input
                    className="form-control"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    required
                />

            </div>

            <div className="col-md-2">

                <label className="form-label">
                    Capacity
                </label>

                <input
                    type="number"
                    className="form-control"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                />

            </div>

            <div className="col-md-1 d-flex align-items-end">

                <button className="btn btn-primary w-100">

                    {isEditing ? "Update" : "Add"}

                </button>

            </div>

        </div>

    </form>

</div>

<div className="table-card">

    <div className="d-flex justify-content-between align-items-center mb-3">

        <h5 className="mb-0">

            Bus List

        </h5>

        <input
            className="form-control"
            style={{ width: "300px" }}
            placeholder="🔍 Search Bus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

    </div>

    {loading ? (
    <LoadingSpinner />
) : (
    <table className="table align-middle">
        {/* existing table */}
    </table>
)}

            <table className="table align-middle">

                <thead className="table-dark">

                    <tr>
                        <th>ID</th>
                        <th>Bus Number</th>
                        <th>Bus Name</th>
                        <th>Registration No</th>
                        <th>Capacity</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                    </tr>

                </thead>

                <tbody>

                    {
                        filteredBuses.map(bus => (

                            <tr key={bus.id}>

                                <td>{bus.id}</td>
                                <td>{bus.busNumber}</td>
                                <td>{bus.busName}</td>
                                <td>{bus.registrationNumber}</td>
                                <td>{bus.capacity}</td>
<td>
    <span
        className={`badge ${
            bus.status === "Available"
                ? "bg-success"
                : "bg-danger"
        }`}
    >
        {bus.status}
    </span>
</td>

                                

<td className="text-center">

    <button
        className="icon-btn edit-btn"
        onClick={() => editBus(bus)}
        title="Edit Bus"
    >
        <i className="bi bi-pencil-fill"></i>
    </button>

    <button
        className="icon-btn delete-btn"
        onClick={() => deleteBus(bus.id)}
        title="Delete Bus"
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

export default Buses;