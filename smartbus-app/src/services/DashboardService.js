import api from "../api/api";

/* Dashboard Counts */

export const getDashboardCounts = async () => {

    const buses = await api.get("/Bus");
    const drivers = await api.get("/Driver");
    const routes = await api.get("/BusRoute");
    const passengers = await api.get("/Passenger");

    return {

        buses: buses.data.length,
        drivers: drivers.data.length,
        routes: routes.data.length,
        passengers: passengers.data.length

    };

};

/* Buses Per Route */

export const getBusesPerRoute = async () => {

    const response = await api.get("/Dashboard/buses-per-route");

    return response.data;

};

/* Trip Status */

export const getTripStatus = async () => {

    const response = await api.get("/Dashboard/trip-status");

    return response.data;

};