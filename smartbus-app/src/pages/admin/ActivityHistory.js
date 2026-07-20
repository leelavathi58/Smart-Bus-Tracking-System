
import { useEffect, useState } from "react";
import api from "../../api/api";

import { useNavigate } from "react-router-dom";

function ActivityHistory() {
const navigate = useNavigate();
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {

        try {

            const res = await api.get("/AuditLog");

            setLogs(res.data);

        }
        catch (err) {

            console.log(err);

            alert("Unable to load activity history.");

        }

    };

    const badgeClass = (action) => {

        if (action.toLowerCase().includes("create"))
            return "bg-success";

        if (action.toLowerCase().includes("update"))
            return "bg-primary";

        if (action.toLowerCase().includes("delete"))
            return "bg-danger";

        if (action.toLowerCase().includes("login"))
            return "bg-secondary";

        if (action.toLowerCase().includes("logout"))
            return "bg-dark";

        return "bg-info";
    };

    return (

        <div>

<div className="mb-3">
    <button
        className="btn btn-outline-secondary"
        onClick={() => navigate(-1)}
    >
        <i className="bi bi-arrow-left me-2"></i>
        Back
    </button>
</div>

            <h2 className="page-title">

                <i className="bi bi-clock-history me-2 text-primary"></i>

                Activity History

            </h2>



            <div className="table-card">

                <table className="table align-middle">

                    <thead className="table-dark">

                        <tr>

                            <th>Date & Time</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Details</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            logs.map(log => (

                                <tr key={log.id}>

                                    <td>
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>

                                    <td>
                                        {log.userName}
                                    </td>

                                    <td>

                                        <span className={`badge ${badgeClass(log.action)}`}>

                                            {log.action}

                                        </span>

                                    </td>

                                    <td>

                                        {log.details}

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

export default ActivityHistory;