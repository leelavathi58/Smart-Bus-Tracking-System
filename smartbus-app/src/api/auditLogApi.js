
import api from "./api";

export const getAuditLogs = async () => {
    const res = await api.get("/AuditLog");
    return res.data;
};