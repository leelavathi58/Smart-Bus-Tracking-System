import { useEffect, useState, useRef } from "react";
import api from "../../api/api";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import "../../css/driverDashboard.css";

import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

function DriverDashboard() {

    const [trips, setTrips] = useState([]);
    const locationInterval = useRef(null);

    useEffect(() => {

        loadTrips();

    }, []);

useEffect(() => {

    return () => {

        if (locationInterval.current)

            clearInterval(locationInterval.current);

    };

}, []);
    
    const loadTrips = async () => {

        try {

            const res = await api.get("/Trip/my-trips");

            setTrips(res.data);

const runningTrip = res.data.find(t => t.status === "Running");

if (runningTrip) {

    startLocationTracking(runningTrip);

}



        }
        catch (err) {

            console.log(err);

        }

    };

    const startLocationTracking = (trip) => {

    if (!navigator.geolocation) {

        console.log("Geolocation not supported.");

        return;

    }

    if (locationInterval.current)
        clearInterval(locationInterval.current);

    const sendLocation = () => {

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                try {

                    console.log("Selected Trip:", trip);
console.log("BusId:", trip.busId);
console.log("Latitude:", position.coords.latitude);
console.log("Longitude:", position.coords.longitude);


                    await api.post("/BusLocation", {

                        busId: trip.busId,

                        latitude: position.coords.latitude,

                        longitude: position.coords.longitude

                    });

                    console.log("Location Updated");

                }
                catch (err) {

                    console.log(err);

                }

            },

            (error) => {

                console.log(error);

            },

            {

                enableHighAccuracy: true

            }

        );

    };

    sendLocation();

    locationInterval.current = setInterval(sendLocation, 5000);

};

    const assignedTrips = trips.length;

    const runningTrips =
        trips.filter(t => t.status === "Running").length;

    const completedTrips =
        trips.filter(t => t.status === "Completed").length;

    const scheduledTrips =
        trips.filter(t => t.status === "Scheduled").length;

    const barData = {

        labels: [

            "Assigned",
            "Running",
            "Completed",
            "Scheduled"

        ],

  datasets:[
{
    label:"Trips",
    data:[
        assignedTrips,
        runningTrips,
        completedTrips,
        scheduledTrips
    ],
    backgroundColor:[
        "#2563EB",
        "#16A34A",
        "#F59E0B",
        "#DC2626"
    ],
    borderRadius:8
}
]

    };

    const doughnutData = {

    labels: [

        "Running",
        "Completed",
        "Scheduled"

    ],

    datasets: [

        {

            data: [

                runningTrips,
                completedTrips,
                scheduledTrips

            ],

            backgroundColor: [

                "#22C55E",   // Green - Running
                "#3B82F6",   // Blue - Completed
                "#F59E0B"    // Orange - Scheduled

            ],

            borderColor: "#ffffff",

            borderWidth: 2

        }

    ]

};

    return (

        <div>

            <h2 className="page-title">

                <i className="bi bi-speedometer2 me-2 text-primary"></i>

                Driver Dashboard

            </h2>

            <div className="welcome-banner d-flex justify-content-between align-items-center">

    <div>

        <h3>
            Welcome, {localStorage.getItem("fullName")} 👋
        </h3>

        <p>
            View today's trips, update your location and manage your journey.
        </p>

    </div>

    <i className="bi bi-person-badge-fill"></i>

</div>

            <div className="dashboard-grid">

                <div className="dashboard-card">

                    <i className="bi bi-calendar-check dashboard-icon text-primary"></i>

                    <h3>{assignedTrips}</h3>

                    <p>Assigned Trips</p>

                </div>

                <div className="dashboard-card">

                    <i className="bi bi-play-circle dashboard-icon text-success"></i>

                    <h3>{runningTrips}</h3>

                    <p>Running Trips</p>

                </div>

                <div className="dashboard-card">

                    <i className="bi bi-check-circle dashboard-icon text-warning"></i>

                    <h3>{completedTrips}</h3>

                    <p>Completed Trips</p>

                </div>

                <div className="dashboard-card">

                    <i className="bi bi-clock-history dashboard-icon text-danger"></i>

                    <h3>{scheduledTrips}</h3>

                    <p>Scheduled Trips</p>

                </div>

            </div>

            <div className="row mt-4">

                <div className="col-lg-8">

                    <div className="chart-card">

                        <h5 className="mb-3">

                            Driver Trip Overview

                        </h5>

                        <Bar data={barData} />

                    </div>

                </div>

                <div className="col-lg-4">

                    <div className="chart-card">

                        <h5 className="mb-3">

                            Trip Status

                        </h5>

                        <Doughnut data={doughnutData} />

                    </div>

                </div>

            </div>

        </div>

    );

}

export default DriverDashboard;