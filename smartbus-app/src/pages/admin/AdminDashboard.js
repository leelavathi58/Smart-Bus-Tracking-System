import { useEffect, useState } from "react";
import {
    getDashboardCounts,
    getBusesPerRoute,
    getTripStatus
} from "../../services/DashboardService";

import "../../css/adminDashboard.css";

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

function AdminDashboard() {

    const [routeChart, setRouteChart] = useState([]);

    const [tripStatus, setTripStatus] = useState([]);

    const [counts, setCounts] = useState({
        buses: 0,
        drivers: 0,
        routes: 0,
        passengers: 0
    });

useEffect(() => {

    loadDashboard();
    loadRouteChart();
    loadTripStatus();

}, []);
    const loadDashboard = async () => {
        try {
            const data = await getDashboardCounts();
            setCounts(data);
        }
        catch (err) {
            console.log(err);
        }
    };

    const loadRouteChart = async () => {

    try {

        const data = await getBusesPerRoute();
 console.log("Route chart data:", data); 
        setRouteChart(data);

    }
    catch (err) {

        console.log(err);

    }

};
const loadTripStatus = async () => {

    try {

        const data = await getTripStatus();

        setTripStatus(data);

    }
    catch (err) {

        console.log(err);

    }

};
const barData = {
    labels: ["Buses", "Drivers", "Routes", "Passengers"],
  datasets: [
{
    label: "Count",
    data: [
        counts.buses,
        counts.drivers,
        counts.routes,
        counts.passengers
    ],
    backgroundColor: [
        "#2563EB",
        "#16A34A",
        "#F59E0B",
        "#DC2626"
    ],
    borderRadius: 10
}
]
};
const doughnutData = {
    labels: ["Buses", "Drivers", "Routes", "Passengers"],
    datasets: [
{
    data: [
        counts.buses,
        counts.drivers,
        counts.routes,
        counts.passengers
    ],
    backgroundColor: [
        "#2563EB",
        "#16A34A",
        "#F59E0B",
        "#DC2626"
    ],
    borderWidth: 0
}
]
};

   const routeChartData = {
    labels: routeChart.map(r => r.routeName),

    datasets: [
        {
            label: "Buses",

            data: routeChart.map(r => r.busCount),

            backgroundColor: [
                "#2563EB", // Blue
                "#22C55E", // Green
                "#F59E0B", // Orange
                "#EF4444", // Red
                "#8B5CF6", // Purple
                "#06B6D4", // Cyan
                "#EC4899", // Pink
                "#84CC16", // Lime
                "#F97316", // Deep Orange
                "#14B8A6"  // Teal
            ],

            borderRadius: 10,
            borderWidth: 0
        }
    ]
};
const tripStatusData = {

    labels: tripStatus.map(t => t.status),

    datasets: [

        {

            data: tripStatus.map(t => t.count),

            backgroundColor: [

                "#2563EB",
                "#22C55E",
                "#F59E0B",
                "#EF4444"

            ],

            borderWidth: 0

        }

    ]

};

    return (

        <div>

            <h2 className="page-title">
                Dashboard
            </h2>


<div className="welcome-banner d-flex justify-content-between align-items-center">

    <div>

        <h3>
            Welcome, {localStorage.getItem("fullName")} 👋
        </h3>

        <p>
            Monitor buses, drivers, routes and passenger activities in real time.
        </p>

    </div>

    <i className="bi bi-bus-front-fill"></i>

</div>
           <div className="row">

   <div className="col-md-3 mb-4">
    <div className="dashboard-card admin-blue">
        <i className="bi bi-bus-front dashboard-icon"></i>
        <h2>{counts.buses}</h2>
        <p>Total Buses</p>
    </div>
</div>

<div className="col-md-3 mb-4">
    <div className="dashboard-card admin-green">
        <i className="bi bi-person-badge dashboard-icon"></i>
        <h2>{counts.drivers}</h2>
        <p>Total Drivers</p>
    </div>
</div>

<div className="col-md-3 mb-4">
    <div className="dashboard-card admin-orange">
        <i className="bi bi-signpost dashboard-icon"></i>
        <h2>{counts.routes}</h2>
        <p>Total Routes</p>
    </div>
</div>

<div className="col-md-3 mb-4">
    <div className="dashboard-card admin-red">
        <i className="bi bi-people dashboard-icon"></i>
        <h2>{counts.passengers}</h2>
        <p>Total Passengers</p>
    </div>
</div>

</div>
<div className="row mt-4">

    <div className="col-lg-7">

        <div className="chart-card">

            <h4 className="mb-4">

                🚌 Buses Per Route

            </h4>


     <Bar
    data={routeChartData}
    options={{
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#334155",
                    stepSize: 1
                },
                grid: {
                    color: "#E2E8F0"
                }
            },
            x: {
                ticks: {
                    color: "#334155"
                },
                grid: {
                    display: false
                }
            }
        }
    }}
/>

        </div>

    </div>

    <div className="col-lg-5">

        <div className="chart-card">

            <h4 className="mb-4">

                🚦 Trip Status

            </h4>

            <Doughnut
                data={tripStatusData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }}
            />

        </div>

    </div>

</div>

            <div className="row">

                <div className="col-md-7">

                    <div className="table-card">

                        <h5 className="mb-3">
                            System Statistics
                        </h5>

                        <Bar data={barData} />

                    </div>

                </div>

                <div className="col-md-5">

                    <div className="table-card">

                        <h5 className="mb-3">
                            Distribution
                        </h5>

                        <Doughnut data={doughnutData} />

                    </div>

                </div>

            </div>

        </div>

    );
}

export default AdminDashboard;