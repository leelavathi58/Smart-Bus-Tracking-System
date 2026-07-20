
import api from "../api/api";

export const sendMessage = async (message) => {
    const response = await api.post("/Chat", {
        message
    });

    return response.data.reply;
};