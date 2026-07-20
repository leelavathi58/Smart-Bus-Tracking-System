import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

function UpdateLocation() {

    const [buses, setBuses] = useState([]);

    const [busId, setBusId] = useState("");

    const [latitude, setLatitude] = useState("");

    const [longitude, setLongitude] = useState("");

    const [liveTracking, setLiveTracking] = useState(false);

    const watchId = useRef(null);

    const lastSent = useRef(0);

    useEffect(() => {

        loadBuses();

    }, []);

    const loadBuses = async () => {

        try {

            const res = await api.get("/Bus");

            setBuses(res.data);

        }
        catch {

            toast.error("Unable to load buses.");

        }

    };

    const useCurrentLocation = () => {

        if (!navigator.geolocation) {

            toast.error("Geolocation is not supported.");

            return;

        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setLatitude(position.coords.latitude.toFixed(6));

                setLongitude(position.coords.longitude.toFixed(6));

                toast.success("Current location captured.");

            },

            () => {

                toast.error("Unable to get current location.");

            },

            {

                enableHighAccuracy: true,

                timeout: 10000

            }

        );

    };

    const saveLocation = async (

        lat = latitude,

        lng = longitude

    ) => {

        if (!busId) return;

        try {

            await api.post("/BusLocation", {

                busId,

                latitude: lat,

                longitude: lng

            });

        }
        catch {

            toast.error("Failed to update location.");

        }

    };

    useEffect(() => {

        if (!liveTracking) {

            if (watchId.current !== null) {

                navigator.geolocation.clearWatch(watchId.current);

                watchId.current = null;

            }

            return;

        }

        if (!navigator.geolocation) {

            toast.error("Geolocation not supported.");

            return;

        }

        toast.success("Live Tracking Started");

        watchId.current = navigator.geolocation.watchPosition(

            async (position) => {

                const lat = position.coords.latitude.toFixed(6);

                const lng = position.coords.longitude.toFixed(6);

                setLatitude(lat);

                setLongitude(lng);

                const now = Date.now();

                if (now - lastSent.current >= 10000) {

                    lastSent.current = now;

                    await saveLocation(lat, lng);

                }

            },

            () => {

                toast.error("Unable to access GPS.");

            },

            {

                enableHighAccuracy: true,

                maximumAge: 0,

                timeout: 10000

            }

        );

        return () => {

            if (watchId.current !== null) {

                navigator.geolocation.clearWatch(watchId.current);

                watchId.current = null;

            }

        };

    }, [liveTracking, busId]);

    const submitLocation = async (e) => {

        e.preventDefault();

        await saveLocation();

        toast.success("Location Updated Successfully");

    };

    return (

        <div className="container">

            <h2 className="page-title">

                <i className="bi bi-geo-alt-fill text-danger me-2"></i>

                Update Bus Location

            </h2>

            <div className="form-card">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h5 className="mb-0">

                        Update Current Bus Location

                    </h5>

                    <div className="form-check form-switch">

                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={liveTracking}
                            onChange={(e) =>
                                setLiveTracking(e.target.checked)
                            }
                        />

                        <label className="form-check-label ms-2">

                            Live Tracking

                        </label>

                        {

                            liveTracking && (

                                <span
                                    className="ms-3"
                                    style={{

                                        width:12,

                                        height:12,

                                        background:"#22C55E",

                                        borderRadius:"50%",

                                        display:"inline-block",

                                        animation:"pulse 1s infinite"

                                    }}
                                ></span>

                            )

                        }

                    </div>

                </div>

                <form onSubmit={submitLocation}>

                    <div className="mb-4">

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={useCurrentLocation}
                        >

                            📍 Use My Current Location

                        </button>

                    </div>

                    <div className="row g-3">

                        <div className="col-md-4">

                            <label className="form-label">

                                Bus

                            </label>

                            <select
                                className="form-select"
                                value={busId}
                                onChange={(e) => setBusId(e.target.value)}
                                required
                            >

                                <option value="">

                                    Select Bus

                                </option>

                                {

                                    buses.map(bus => (

                                        <option
                                            key={bus.id}
                                            value={bus.id}
                                        >

                                            {bus.busNumber}

                                        </option>

                                    ))

                                }

                            </select>

                        </div>

                        <div className="col-md-4">

                            <label className="form-label">

                                Latitude

                            </label>

                            <input
                                className="form-control"
                                value={latitude}
                                onChange={(e) =>
                                    setLatitude(e.target.value)
                                }
                            />

                        </div>

                        <div className="col-md-4">

                            <label className="form-label">

                                Longitude

                            </label>

                            <input
                                className="form-control"
                                value={longitude}
                                onChange={(e) =>
                                    setLongitude(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <div className="mt-4">

                        <button className="btn btn-success">

                            <i className="bi bi-save me-2"></i>

                            Save Location

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default UpdateLocation;