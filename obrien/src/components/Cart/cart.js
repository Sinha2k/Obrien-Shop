import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeProduct,
} from "../../redux_toolkit/reducer/cartSliceReducer";
import { loadingUserSelector } from "../../redux_toolkit/selector/selector";
import Loading from "../utils/Loading/Loading";
import empty_cart from "../image/empty-cart.png";
import { ToastContainer } from "react-toastify";
const Cart = () => {
  const [total, setTotal] = useState(0);
  const cartStore = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const loadingUser = useSelector(loadingUserSelector);
  useEffect(() => {
    const getTotal = () => {
      const total = cartStore.cart.reduce((prev, item) => {
        return prev + item.unitPrice * item.quantity;
      }, 0);
      setTotal(total);
    };
    getTotal();
  }, [cartStore.cart]);
  const decrease = (id) => {
    dispatch(decreaseQuantity(id));
  };
  const increase = (id) => {
    dispatch(increaseQuantity(id));
  };
  const deleteProduct = (id) => {
    if (window.confirm("Do you really want to remove this product ???")) {
      dispatch(removeProduct(id));
    }
  };
  //   const updateCart = () => {
  //     dispatch(addCartFunction());
  //   };
  return (
    <>
      {loadingUser === "loading" ? <Loading /> : ""}
      {cartStore.status === "loading" ? <Loading /> : ""}
      <div className="shopping_cart">
        <table className="shopping_table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartStore.numOfPro === 0 ? (
              <tr className="no_order_row_cart">
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <div
                    style={{ transform: "translateX(-100px)" }}
                    className="no_order"
                  >
                    <img alt="" src={empty_cart} />
                    <span>Cart Empty</span>
                  </div>
                </td>
                <td></td>
                <td></td>
              </tr>
            ) : (
              cartStore.cart.map((item) => (
                <tr key={item.productID}>
                  <td>
                    <img src={item.image} alt="" />
                  </td>
                  <td>{item.name}</td>
                  <td>${item.sale === 1 ? item.priceSale : item.unitPrice}</td>
                  <td>
                    <div className="function">
                      <div
                        style={{
                          width: "80%",
                          marginLeft: "15px",
                          paddingTop: "2rem",
                        }}
                        className="control"
                      >
                        <h6 onClick={() => decrease(item.productID)}>-</h6>
                        <h6>{item.quantity}</h6>
                        <h6 onClick={() => increase(item.productID)}>+</h6>
                      </div>
                    </div>
                  </td>
                  <td>${item.subTotal}</td>
                  <td>
                    <i
                      onClick={() => deleteProduct(item.productID)}
                      style={{ fontSize: "1.5rem" }}
                      className="fa fa-trash-o"
                      aria-hidden="true"
                    ></i>
                  </td>
                </tr>
              ))
            )}
            {/* {cartStore.numOfPro === 0 ? (
              ""
            ) : (
              <tr className="update_cart">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <h4 onClick={updateCart}>UPDATE CART</h4>
              </tr>
            )} */}
          </tbody>
        </table>
        <div className="cart_total">
          <h6>Cart Totals</h6>
          <div className="total_item">
            <p>Sub Total</p>
            <p>${cartStore?.total}</p>
          </div>
          <div className="total_item">
            <p>Shipping</p>
            <p>$70</p>
          </div>
          <div className="total_item">
            <p>Total</p>
            <p style={{ color: "green" }}>${cartStore?.total + 70}</p>
          </div>
          <a href="/checkout">
            <h5>PROCEED TO CHECKOUT</h5>
          </a>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Cart;
