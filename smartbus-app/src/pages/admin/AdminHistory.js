
import { useEffect, useState } from "react";
import { getAuditLogs } from "../../api/auditLogApi";

function AdminHistory() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const data = await getAuditLogs();
            setLogs(data);
        } catch (err) {
            console.log(err);
            alert("Unable to load history.");
        }
    };

    const getBadgeClass = (action) => {
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

    const formatTime = (date) => {
    const now = new Date();
    const logDate = new Date(date);

    const diff = Math.floor((now - logDate) / 1000);

    if (diff < 60)
        return `${diff} sec ago`;

    if (diff < 3600)
        return `${Math.floor(diff / 60)} min ago`;

    if (diff < 86400)
        return `${Math.floor(diff / 3600)} hr ago`;

    return logDate.toLocaleString();
};

    return (
        <div className="container">

            <h2 className="page-title">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                Activity History
            </h2>

            <div className="table-card">

                <table className="table table-hover align-middle">

                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Details</th>
                        </tr>
                    </thead>

                    <tbody>

                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    No activity found.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id}>

                                    <td>{formatTime(log.timestamp)}</td>

                                    <td>{log.userName}</td>

                                    <td>
                                        <span className={`badge ${getBadgeClass(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>

                                    <td>{log.details}</td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default AdminHistory;