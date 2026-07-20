import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";


function Login() {

    const navigate = useNavigate();

    // null | Admin | Driver | Passenger
    const [selectedRole, setSelectedRole] = useState(null);

    // Passenger Register Toggle
    const [isRegister, setIsRegister] = useState(false);

    // Login Fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Passenger Registration
    const [fullName, setFullName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

useEffect(() => {

    setEmail("");
    setPassword("");
    setFullName("");
    setPhoneNumber("");

    setConfirmPassword("");

    // Always return to Login tab when Passenger is selected
    setIsRegister(false);

}, [selectedRole]);


    //------------------------------------
    // LOGIN
    //------------------------------------

    const login = async (e) => {

        e.preventDefault();


        console.log({
    email,
    password,
    selectedRole
});
        try {

            const response = await api.post("/Auth/login", {

                email,
                password,
                selectedRole

            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("fullName", response.data.fullName);
            localStorage.setItem("email", response.data.email);

            toast.success("Login Successful");

            if (response.data.role === "Admin") {

                navigate("/admin");

            }
            else if (response.data.role === "Driver") {

                navigate("/driver");

            }
            else {

                navigate("/passenger");

            }

        }
        catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Login Failed"
            );

        }

    };

    //------------------------------------
    // PASSENGER REGISTER
    //------------------------------------

    const registerPassenger = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {

            toast.error("Passwords do not match");

            return;

        }

        try {

  const response = await api.post(
    "/Auth/passenger-register",
    {
        fullName,
        email,
        phoneNumber,
        password,
        confirmPassword
    });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("fullName", response.data.fullName);
            localStorage.setItem("email", response.data.email);

            toast.success("Registration Successful");

            navigate("/passenger");

        }
        catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Registration Failed"
            );

        }

    };
    return (

        <div className="login-page">

            <div className="login-card">

                {/* ================= ROLE SELECTION ================= */}

                {selectedRole === null && (

                    <>

                        <h2 className="text-center mb-4">
                            Smart Bus Tracking
                        </h2>

                        <p className="text-center text-muted mb-4">
                            Select your role
                        </p>

                        <div className="role-select-row">

                            <div
                                className="role-card"
                                onClick={() => setSelectedRole("Admin")}
                            >

                                <div className="dashboard-icon">
                                    🧑‍💼
                                </div>

                                <h5>Admin</h5>

                            </div>

                            <div
                                className="role-card"
                                onClick={() => setSelectedRole("Driver")}
                            >

                                <div className="dashboard-icon">
                                    🚌
                                </div>

                                <h5>Driver</h5>

                            </div>

                            <div
                                className="role-card"
                                onClick={() => {
                                    setSelectedRole("Passenger");
                                    setIsRegister(false);
                                }}
                            >

                                <div className="dashboard-icon">
                                    👤
                                </div>

                                <h5>Passenger</h5>

                            </div>

                        </div>

                    </>

                )}

                {/* ================= ADMIN LOGIN ================= */}

                {selectedRole === "Admin" && (

                    <>

                        <button
                            className="btn btn-link mb-3"
                            onClick={() => setSelectedRole(null)}
                        >
                            ← Back
                        </button>

                        <h3 className="text-center mb-4">
                            Admin Login
                        </h3>

                        <form onSubmit={login}>

                            <div className="mb-3">

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <div className="mb-4">

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <button className="btn btn-primary w-100 login-btn">

                                Login

                            </button>

                        </form>

                    </>

                )}

                {/* ================= DRIVER LOGIN ================= */}

                {selectedRole === "Driver" && (

                    <>

                        <button
                            className="btn btn-link mb-3"
                            onClick={() => setSelectedRole(null)}
                        >
                            ← Back
                        </button>

                        <h3 className="text-center mb-4">

                            Driver Login

                        </h3>

                        <form onSubmit={login}>

                            <div className="mb-3">

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <div className="mb-4">

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <button className="btn btn-primary w-100 login-btn">

                                Login

                            </button>

                        </form>

                    </>

                )}

                {/* ================= PASSENGER ================= */}

                {selectedRole === "Passenger" && (

                    <>

                        <button
                            className="btn btn-link mb-3"
                            onClick={() => setSelectedRole(null)}
                        >
                            ← Back
                        </button>

                        <div className="d-flex mb-4">

                            <button
                                className={`btn w-50 ${!isRegister ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setIsRegister(false)}
                                type="button"
                            >
                                Already Registered
                            </button>

                            <button
                                className={`btn w-50 ${isRegister ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setIsRegister(true)}
                                type="button"
                            >
                                Create New Account
                            </button>

                        </div>

                        {!isRegister ? (

                            <form onSubmit={login}>

                                <div className="mb-3">

                                    <input
                                        className="form-control"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />

                                </div>

 

                                <div className="mb-4">

                                    <input
                                        className="form-control"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                                <button className="btn btn-primary w-100 login-btn">

                                    Login

                                </button>

                            </form>

                        ) : (

                            <form onSubmit={registerPassenger}>

                                <div className="mb-3">

                                    <input
                                        className="form-control"
                                        placeholder="Full Name"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                                <div className="mb-3">

                                    <input
                                        className="form-control"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />

                                </div>
<div className="mb-3">

    <input
        className="form-control"
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
    />

</div>

                                <div className="mb-3">

                                    <input
                                        className="form-control"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                                <div className="mb-4">

                                    <input
                                        className="form-control"
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                                <button className="btn btn-primary w-100 login-btn">

                                    Create Account

                                </button>

                            </form>

                        )}

                    </>

                )}

            </div>

        </div>

    );

}

export default Login;