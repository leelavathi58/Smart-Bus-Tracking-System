
import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

function Drivers() {

    const [drivers, setDrivers] = useState([]);
    const [search, setSearch] = useState("");

    const [driverName, setDriverName] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [experience, setExperience] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        try {
            const response = await api.get("/Driver");
            setDrivers(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const addDriver = async (e) => {
        e.preventDefault();

        try {

           const response = await api.post("/Driver", {
    driverName,
    licenseNumber,
    phoneNumber,
    experience,
    isAvailable: true
});

toast.success(
    <>
        <div>
            <strong>{response.data.message}</strong>
        </div>

        <div className="mt-2">
            📧 <strong>{response.data.email}</strong>
        </div>

        <div>
            🔑 Password:
            <strong> {response.data.password}</strong>
        </div>
    </>,
    {
        autoClose: 8000
    }
);

            setDriverName("");
            setLicenseNumber("");
            setPhoneNumber("");
            setExperience("");

            loadDrivers();

        } catch (err) {
            console.log(err);
        }
    };
    const deleteDriver = async (id) => {

    if (!window.confirm("Delete this driver?"))
        return;

    try {

        await api.delete(`/Driver/${id}`);

       toast.success("Driver Deleted Successfully");

        loadDrivers();

    } catch (err) {

        console.log(err);

        toast.error("Unable to delete driver");

    }
};
const editDriver = (driver) => {

    setEditingId(driver.id);

    setDriverName(driver.driverName);
    setLicenseNumber(driver.licenseNumber);
    setPhoneNumber(driver.phoneNumber);
    setExperience(driver.experience);

    setIsEditing(true);
};

const updateDriver = async (e) => {

    e.preventDefault();

    try {

        await api.put(`/Driver/${editingId}`, {

            driverName,
            licenseNumber,
            phoneNumber,
            experience,
            isAvailable: true

        });

        toast.success("Driver Updated Successfully");

        setDriverName("");
        setLicenseNumber("");
        setPhoneNumber("");
        setExperience("");

        setEditingId(null);
        setIsEditing(false);

        loadDrivers();

    } catch (err) {

        console.log(err);

        toast.error("Unable to update driver");

    }
};
const filteredDrivers = drivers.filter(driver =>
    driver.driverName.toLowerCase().includes(search.toLowerCase()) ||
    driver.phoneNumber.toLowerCase().includes(search.toLowerCase()) ||
    driver.licenseNumber.toLowerCase().includes(search.toLowerCase())
);

    return (
        <div>

           <h2 className="page-title">
    <i className="bi bi-person-badge me-2 text-success"></i>
    Driver Management
</h2>

<div className="form-card">

    <h5 className="mb-4">
        {isEditing ? "Update Driver" : "Add Driver"}
    </h5>

            <form onSubmit={isEditing ? updateDriver : addDriver}>

                <div className="row">

                    <div className="col">
                        <input
                            className="form-control"
                            placeholder="Driver Name"
                            value={driverName}
                            onChange={(e)=>setDriverName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col">
                        <input
                            className="form-control"
                            placeholder="License Number"
                            value={licenseNumber}
                            onChange={(e)=>setLicenseNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col">
                        <input
                            className="form-control"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e)=>setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Experience"
                            value={experience}
                            onChange={(e)=>setExperience(e.target.value)}
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
            Driver List
        </h5>

        <input
            className="form-control"
            style={{ width: "300px" }}
            placeholder="🔍 Search Driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

    </div>

            <table className="table align-middle">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>License</th>
                        <th>Phone</th>
                        <th>Experience</th>
                        <th>Available</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {
                       filteredDrivers.map(driver => (

                            <tr key={driver.id}>

                                <td>{driver.id}</td>
                                <td>{driver.driverName}</td>
                                <td>{driver.licenseNumber}</td>
                                <td>{driver.phoneNumber}</td>
                                <td>{driver.experience}</td>
<td>
    <span
        className={`badge ${
            driver.status === "Available"
                ? "bg-success"
                : "bg-danger"
        }`}
    >
        {driver.status}
    </span>
</td>


                                <td>

  <button
    className="btn btn-warning btn-sm me-2"
    onClick={() => editDriver(driver)}
>
    <i className="bi bi-pencil-square"></i>
</button>

<button
    className="btn btn-danger btn-sm"
    onClick={() => deleteDriver(driver.id)}
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

export default Drivers;