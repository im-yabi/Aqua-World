import { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteOrder, adminOrders as adminOrdersAction } from "../../actions/orderActions";
import { clearError, clearOrderDeleted } from "../../slices/orderSlice";
import Loader from '../layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import Sidebar from "./Sidebar";
import MetaData from "../layouts/MetaData";

export default function OrderList() {
  const { adminOrders = [], loading = true, error, isOrderDeleted } = useSelector(state => state.orderState);
  const dispatch = useDispatch();

  const setOrders = () => {
    const data = {
      columns: [
        { label: 'ID', field: 'id', sort: 'asc', className: 'desktop-only' },
        { label: 'Quantity', field: 'noOfItems', sort: 'asc' },
        { label: 'Amount', field: 'amount', sort: 'asc' },
        { label: 'Status', field: 'status', sort: 'asc' },
        { label: 'Actions', field: 'actions' }  // no need for sorting here
      ],
      rows: []
    };

    adminOrders.forEach(order => {
      data.rows.push({
        id: order._id,
        noOfItems: order.orderItems.length,
        amount: `$${order.totalPrice.toFixed(2)}`,
        status: (
          <span style={{ color: order.orderStatus.includes('Processing') ? 'red' : 'green' }}>
            {order.orderStatus}
          </span>
        ),
        actions: (
          <Fragment>
            <Link to={`/admin/order/${order._id}`} className="btn btn-primary">
              <i className="fa fa-pencil"></i>
            </Link>
            <Button
              onClick={() => deleteHandler(order._id)}
              className="btn btn-danger py-1 px-2 ml-2"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </Fragment>
        )
      });
    });

    return data;
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: toast.POSITION.BOTTOM_CENTER });
      dispatch(clearError());
    }

    if (isOrderDeleted) {
      toast.success("Order Deleted Successfully!", { position: toast.POSITION.BOTTOM_CENTER });
      dispatch(clearOrderDeleted());
    }

    dispatch(adminOrdersAction());
  }, [dispatch, error, isOrderDeleted]);

  return (
    <div className="row">
      <MetaData title="Order List" />
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Order List</h1>
        <Fragment>
          {loading ? (
            <Loader />
          ) : adminOrders.length === 0 ? (
            <p className="text-center mt-3">No orders found.</p>
          ) : (
            <MDBDataTable
              data={setOrders()}
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
