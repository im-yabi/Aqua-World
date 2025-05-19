import { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, getAdminProducts } from "../../actions/productActions";
import { clearError, clearProductDeleted } from "../../slices/productSlice";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import MetaData from "../layouts/MetaData";

export default function ProductList() {
  const { products = [], loading = true, error } = useSelector((state) => state.productsState);
  const { isProductDeleted, error: productError } = useSelector((state) => state.productState);
  const dispatch = useDispatch();

  const setProducts = () => {
    const data = {
      columns: [
        { label: "ID", field: "id", sort: "asc" },
        { label: "Name", field: "name", sort: "asc" },
        { label: "Price", field: "price", sort: "asc" },
        { label: "Stock", field: "stock", sort: "asc" },
        { label: "Actions", field: "actions" } // No need for sorting
      ],
      rows: []
    };

    products.forEach((product) => {
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock: product.stock,
        actions: (
          <Fragment>
            <Link to={`/admin/product/${product._id}`} className="btn btn-primary">
              <i className="fa fa-pencil"></i>
            </Link>
            <Button
              onClick={() => deleteHandler(product._id)}
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
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  useEffect(() => {
    if (error || productError) {
      toast(error || productError, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error"
      });
      dispatch(clearError());
      dispatch(clearProductDeleted());
    }

    if (isProductDeleted) {
      toast("Product Deleted Successfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER
      });
      dispatch(clearProductDeleted());
    }

    dispatch(getAdminProducts());
  }, [dispatch, error, productError, isProductDeleted]);

  return (
    <div className="row">
      <MetaData title={"Product List"} />
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Product List</h1>
        <Fragment>
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <p className="text-center mt-3">No products found.</p>
          ) : (
            <MDBDataTable
              data={setProducts()}
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
