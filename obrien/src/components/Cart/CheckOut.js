import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { loadingUserSelector } from "../../redux_toolkit/selector/selector";
import Loading from "../utils/Loading/Loading";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentCard from "./PaymentCard";
import { ToastContainer } from "react-toastify";

const PUBLIC_KEY =
  "pk_test_51LTHA7AVHCKu53nI8T55HG1R0xG8zEjkQCSdn4rlNW9rr3OBrqLNTJu0tzWqobvL5xJfBongxmvzEERYcWpoVS2S00qz3w1yPz";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const CheckOut = () => {
  const cart = useSelector((state) => state.cart.cart);
  const loadingUser = useSelector(loadingUserSelector);
  const loadingCheckout = useSelector((state) => state.cart.status);
  const total = useSelector((state) => state.cart.total);
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);
  const initialState = {
    phone: "",
    address: "",
    note: "",
  };
  const [order, setOrder] = useState(initialState);
  const handlerChangeInput = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  useEffect(() => {
    if (loadingCheckout === "idle") {
      setOrder(initialState);
    }
  }, [loadingCheckout]);

  return (
    <>
      {loadingUser === "loading" ? <Loading /> : ""}
      {loadingCheckout === "loading" && <Loading />}
      <div className="checkout">
        <div className="bill_detail">
          <h5>BILLING DETAILS</h5>
          <div className="line"></div>
          <TextField
            required
            id="outlined-password-input"
            label="Address"
            name="address"
            onChange={handlerChangeInput}
            type="text"
            style={{ width: "100%", marginTop: "2rem" }}
          />
          <TextField
            required
            id="outlined-password-input"
            label="Phone Number"
            name="phone"
            onChange={handlerChangeInput}
            type="text"
            style={{ width: "100%", marginTop: "2rem" }}
          />
          <TextField
            required
            id="outlined-password-input"
            label="Order Notes"
            name="note"
            onChange={handlerChangeInput}
            type="text"
            style={{ width: "100%", marginTop: "2rem" }}
          />
        </div>
        <div className="your_order">
          <h5>YOUR ORDER</h5>
          <div className="label_title">
            <p>PRODUCT</p>
            <p>TOTAL</p>
          </div>
          {cart.map((item) => {
            return (
              <div key={item._id} className="order_item">
                <p>
                  {item.name} <b>x {item.quantity}</b>
                </p>
                <p>${item.subTotal}</p>
              </div>
            );
          })}
          <div className="order_item">
            <h5>Order Total</h5>
            <h5>${total}</h5>
          </div>
          <h5
            onClick={() => setActive(!active)}
            className={`paypal ${active ? "active" : ""}`}
          >
            Cash on delivery
          </h5>
          <h5
            style={{ marginTop: "1rem" }}
            onClick={() => setShow(!show)}
            className="paypal"
          >
            Payment
          </h5>
          <Elements stripe={stripeTestPromise}>
            <PaymentCard
              show={show}
              order={order}
              cart={cart}
              total={total}
              active={active}
            />
          </Elements>
          {/* <h5 onClick={focusPaypal} className='paypal'>PayPal</h5> */}
          {/* <PaypalButton 
                    ref={paypal}
                    total={total}
                    tranSuccess = {tranSuccess}
                    currency={currency}
                /> */}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default CheckOut;
