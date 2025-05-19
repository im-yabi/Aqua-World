import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { getUser, updateUser } from "../../actions/userActions";
import { clearError, clearUserUpdated } from "../../slices/userSlice";
import { toast } from "react-toastify";
import MetaData from "../layouts/MetaData";

export default function UpdateUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const { id: userId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, isUserUpdated, error, user } = useSelector(state => state.userState);
    const { user: authUser } = useSelector(state => state.authState);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!name || !email || !role) {
            toast.error("Please fill in all fields.");
            return;
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("role", role);
        dispatch(updateUser(userId, formData));
    };

    useEffect(() => {
        if (isUserUpdated) {
            toast.success("User updated successfully!", {
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearUserUpdated())
            });
            navigate("/admin/users");
        }

        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearError())
            });
        }

        dispatch(getUser(userId));
    }, [isUserUpdated, error, dispatch, userId, navigate]);

    useEffect(() => {
        if (user?._id) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
    }, [user]);

    return (
        <div className="row">
            <MetaData title={"Update User"} />
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <Fragment>
                    <div className="wrapper my-5">
                        <form onSubmit={submitHandler} className="shadow-lg">
                            <h1 className="mb-4">Update User</h1>

                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="role_field">Role</label>
                                <select
                                    id="role_field"
                                    className="form-control"
                                    value={role}
                                    disabled={user?._id === authUser?._id}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>

                            <button
                                id="update_button"
                                type="submit"
                                className="btn btn-block py-3"
                                disabled={loading}
                            >
                                UPDATE
                            </button>
                        </form>
                    </div>
                </Fragment>
            </div>
        </div>
    );
}
