import { useEffect, useState } from "react";
import api from "../../api/api";

import "../../css/passengerDashboard.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";




import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

function PassengerDashboard() {

    const [routes, setRoutes] = useState([]);
    const [buses, setBuses] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            const [routeRes, busRes, locationRes] = await Promise.all([
                api.get("/BusRoute"),
                api.get("/Bus"),
                api.get("/BusLocation")
            ]);

            setRoutes(routeRes.data);
            setBuses(busRes.data);
            setLocations(locationRes.data);

        }
        catch (err) {

            console.log(err);

        }

    };

    const chartData = {

        labels: [

            "Routes",
            "Buses",
            "Live Locations"

        ],

        datasets:[
{
    label:"Passenger Overview",
    data:[
        routes.length,
        buses.length,
        locations.length
    ],
    backgroundColor:[
        "#2563EB",
        "#16A34A",
        "#DC2626"
    ],
    borderRadius:8
}
]

    };

    const doughnutData = {

        labels: [

            "Routes",
            "Buses",
            "Locations"

        ],

   datasets:[
{
    data:[
        routes.length,
        buses.length,
        locations.length
    ],
    backgroundColor:[
        "#2563EB",
        "#16A34A",
        "#DC2626"
    ]
}
]
    };

    return (

        <div>

            <h2 className="page-title">

                <i className="bi bi-person-workspace me-2 text-primary"></i>

                Passenger Dashboard

            </h2>

            <div className="welcome-banner d-flex justify-content-between align-items-center">

    <div>

        <h3>
            Welcome, {localStorage.getItem("fullName")} 👋
        </h3>

        <p>
            Track buses in real time and stay updated with your journey.
        </p>

    </div>

    <i className="bi bi-geo-alt-fill"></i>

</div>

            <div className="dashboard-grid">

                <div className="dashboard-card">

                    <i className="bi bi-signpost dashboard-icon text-primary"></i>

                    <h3>{routes.length}</h3>

                    <p>Available Routes</p>

                </div>

                <div className="dashboard-card">

                    <i className="bi bi-bus-front dashboard-icon text-success"></i>

                    <h3>{buses.length}</h3>

                    <p>Total Buses</p>

                </div>

                <div className="dashboard-card">

                    <i className="bi bi-geo-alt dashboard-icon text-danger"></i>

                    <h3>{locations.length}</h3>

                    <p>Live Bus Locations</p>

                </div>

                <div className="dashboard-card">

                    <i className="bi bi-wifi dashboard-icon text-warning"></i>

                    <h3>Live</h3>

                    <p>Tracking Status</p>

                </div>

            </div>

            <div className="row mt-4">

                <div className="col-lg-8">

                    <div className="chart-card">

                        <h5 className="mb-3">

                            Passenger Overview

                        </h5>

                        <Bar data={chartData} />

                    </div>

                </div>

                <div className="col-lg-4">

                    <div className="chart-card">

                        <h5 className="mb-3">

                            System Summary

                        </h5>

                        <Doughnut data={doughnutData} />

                    </div>

                </div>

            </div>

        </div>

    );

}

export default PassengerDashboard;