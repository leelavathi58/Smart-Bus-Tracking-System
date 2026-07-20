import { useEffect, useState } from "react";
import api from "../../api/api";
import ChangePassword from "./ChangePassword";
import { useNavigate } from "react-router-dom";

function Profile() {

    const navigate = useNavigate();

const user = JSON.parse(localStorage.getItem("user"));

    const [profile, setProfile] = useState(null);

    // NEW
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            const res = await api.get("/Auth/profile");

            setProfile(res.data);

        }
        catch (err) {

            console.log(err);

            alert("Unable to load profile");

        }

    };

    if (!profile) {

        return <h4>Loading...</h4>;

    }

    return (

        <div className="container">

            <h2 className="page-title">
                <i className="bi bi-person-circle me-2 text-primary"></i>
                My Profile
            </h2>

            <div className="form-card">

                <h4 className="mb-4">
                    {profile.fullName}
                </h4>

                <table className="table">

                    <tbody>

                        <tr>
                            <th>User ID</th>
                            <td>{profile.id}</td>
                        </tr>

                        <tr>
                            <th>Full Name</th>
                            <td>{profile.fullName}</td>
                        </tr>

                        <tr>
                            <th>Email</th>
                            <td>{profile.email}</td>
                        </tr>

                        <tr>
                            <th>Phone</th>
                            <td>{profile.phoneNumber}</td>
                        </tr>

                        <tr>
                            <th>Role</th>
                            <td>{profile.role}</td>
                        </tr>

                        <tr>
                            <th>Created</th>
                            <td>
                                {new Date(profile.createdAt).toLocaleString()}
                            </td>
                        </tr>

                    </tbody>

                </table>

                <hr />

                {!showPasswordForm ? (
  <div className="d-flex gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowPasswordForm(true)}
                    >
                        <i className="bi bi-key-fill me-2"></i>
                        Change Password
                    </button>

                       {user?.role === "Admin" && (
            <button
                className="btn btn-dark"
                onClick={() => navigate("/admin/history")}
            >
                <i className="bi bi-clock-history me-2"></i>
                History
            </button>
        )}

    </div>

                ) : (

                    <div
                        className="mt-4"
                        style={{
                            overflow: "hidden",
                            transition: "all 0.3s ease"
                        }}
                    >

                        <ChangePassword />

                        <div className="mt-3">

                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPasswordForm(false)}
                            >
                                Cancel
                            </button>

                        </div>
                        

                    </div>

                )}
                {
    profile.role === "Admin" && (
        <div className="mt-3">
            <button
                className="btn btn-success"
                onClick={() => navigate("/admin/history")}
            >
                <i className="bi bi-clock-history me-2"></i>
                Activity History
            </button>
        </div>
    )
}
                

            </div>

        </div>

    );

}

export default Profile;