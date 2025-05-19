import { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUsers } from "../../actions/userActions";
import { clearError, clearUserDeleted } from "../../slices/userSlice";
import Loader from '../layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "./Sidebar";
import MetaData from "../layouts/MetaData";

export default function UserList() {
    const dispatch = useDispatch();
    const { users = [], loading = true, error, isUserDeleted } = useSelector(state => state.userState);
    const { user: authUser } = useSelector(state => state.authState);

    const setUsers = () => {
        const data = {
            columns: [
                { label: 'ID', field: 'id', sort: 'asc' },
                { label: 'Name', field: 'name', sort: 'asc' },
                { label: 'Email', field: 'email', sort: 'asc' },
                { label: 'Role', field: 'role', sort: 'asc' },
                { label: 'Actions', field: 'actions', sort: 'disabled' }
            ],
            rows: []
        };

        users.forEach(user => {
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                actions: (
                    <Fragment>
                        {/* Uncomment if edit functionality is needed
                        <Link to={`/admin/user/${user._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </Link> */}
                        {authUser._id !== user._id && (
                            <Button
                                onClick={(e) => deleteHandler(e, user._id)}
                                className="btn btn-danger py-1 px-2 ml-2"
                            >
                                <i className="fa fa-trash"></i>
                            </Button>
                        )}
                    </Fragment>
                )
            });
        });

        return data;
    };

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteUser(id));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearError())
            });
        }

        if (isUserDeleted) {
            toast.success('User deleted successfully!', {
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearUserDeleted())
            });
        }

        dispatch(getUsers());
    }, [dispatch, error, isUserDeleted]);

    return (
        <div className="row">
            <MetaData title={'User List'} />
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">User List</h1>
                <Fragment>
                    {loading ? (
                        <Loader />
                    ) : (
                        <MDBDataTable
                            data={setUsers()}
                            bordered
                            striped
                            hover
                            className="px-3 table-body"
                        />
                    )}
                </Fragment>
            </div>
        </div>
    );
}
