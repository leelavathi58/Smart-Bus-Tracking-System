
import { useState } from "react";
import api from "../../api/api";

function ChangePassword() {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const changePassword = async (e) => {

        e.preventDefault();

        try {

            const res = await api.post("/Auth/change-password", {
                currentPassword,
                newPassword,
                confirmPassword
            });

            alert(res.data);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        }
        catch (err) {

            if (err.response)
                alert(err.response.data);
            else
                alert("Something went wrong");

        }

    };

    return (

        <div className="container">

            <h2>Change Password</h2>

            <hr />

            <div className="card shadow">

                <div className="card-body">

                    <form onSubmit={changePassword}>

                        <div className="mb-3">

                            <label>Current Password</label>

                            <input
                                type="password"
                                className="form-control"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label>New Password</label>

                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label>Confirm Password</label>

                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                        </div>

                        <button className="btn btn-primary">
                            Change Password
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default ChangePassword;