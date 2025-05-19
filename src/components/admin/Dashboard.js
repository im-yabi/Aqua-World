import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from "react";
import { getAdminProducts } from "../../actions/productActions";
import { getUsers } from '../../actions/userActions';
import { adminOrders as adminOrdersAction } from '../../actions/orderActions';
import { Link } from "react-router-dom";
import MetaData from "../layouts/MetaData";

export default function Dashboard() {
    const { products = [] } = useSelector(state => state.productsState);
    const { adminOrders = [] } = useSelector(state => state.orderState);
    const { users = [] } = useSelector(state => state.userState);
    const dispatch = useDispatch();

    const outOfStock = useMemo(() => 
        products.filter(p => p.stock === 0).length
    , [products]);

    const totalAmount = useMemo(() => 
        adminOrders.reduce((sum, order) => sum + order.totalPrice, 0)
    , [adminOrders]);

    useEffect(() => {
        dispatch(getAdminProducts());
        dispatch(getUsers());
        dispatch(adminOrdersAction());
    }, [dispatch]);

    return (
        <div className="row">
            <MetaData title="Admin Dashboard" />
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4 text-center text-dark">Dashboard</h1>

                <div className="row pr-4">
                    <div className="col-12 mb-3">
                        <div className="card text-white o-hidden h-100" style={{ backgroundColor: '#2f4f4f' }}>
                            <div className="card-body">
                                <div className="text-center card-font-size">
                                    Total Amount<br />
                                    <b>${totalAmount.toFixed(2)}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row pr-4">
                    {/* Products */}
                    <StatCard title="Products" value={products.length} color="success" link="/admin/products" />

                    {/* Orders */}
                    <StatCard title="Orders" value={adminOrders.length} color="warning" link="/admin/orders" />

                    {/* Users */}
                    <StatCard title="Users" value={users.length} color="info" link="/admin/users" />

                    {/* Out of Stock */}
                    <StatCard title="Out of Stock" value={outOfStock} color="danger" />
                </div>
            </div>
        </div>
    );
}

// Helper component for stat cards
function StatCard({ title, value, color, link }) {
    return (
        <div className="col-xl-3 col-sm-6 mb-3">
            <div className={`card text-white bg-${color} o-hidden h-100`}>
                <div className="card-body">
                    <div className="text-center card-font-size">
                        {title}<br /><b>{value}</b>
                    </div>
                </div>
                {link && (
                    <Link className="card-footer text-white clearfix small z-1" to={link}>
                        <span className="float-left">View Details</span>
                        <span className="float-right"><i className="fa fa-angle-right"></i></span>
                    </Link>
                )}
            </div>
        </div>
    );
}
