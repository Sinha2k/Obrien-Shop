import React from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
// import { createPayment } from "../../redux_toolkit/reducer/userSliceReducer";
import { checkout } from "../../redux_toolkit/reducer/cartSliceReducer";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#3391E4",
      color: "black",
      fontWeight: 700,
      // fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "black" },
      "::placeholder": { color: "black" },
    },
    invalid: {
      iconColor: "#e98c81",
      color: "#e98c81",
    },
  },
};

const PaymentCard = ({ show, order, cart, total, active }) => {
//   const stripe = useStripe();
//   const elements = useElements();
  const dispatch = useDispatch();
  // const handleSubmit = async () => {
  //     if(order.fullName && order.phoneNumber && order.address && cart && order.note){
  //         order.cart = cart
  //         order.total = total
  //         if(active){
  //             order.method = 1
  //             dispatch(createPayment(order))
  //             dispatch(cartSliceReducer.actions.getCart([]))
  //             dispatch(addCartFunction())
  //         }else if(show && !active){
  //             const {error, paymentMethod} = await stripe.createPaymentMethod({
  //                 type: "card",
  //                 card: elements.getElement(CardElement)
  //             })
  //             if(!error) {
  //                 const {id} = paymentMethod
  //                 order.paymentID = id
  //                 dispatch(createPayment(order))
  //                 dispatch(cartSliceReducer.actions.getCart([]))
  //                 dispatch(addCartFunction())
  //             } else {
  //                 alert('Something went wrong')
  //             }
  //         }else if(active && show){
  //             alert('You only can choose one of two methods to checkout')
  //         }else{
  //             alert('You must choose checkout method to place order')
  //         }
  //     }else{
  //         alert('You must enter full information !!!')
  //     }
  // }

  const handleSubmit = () => {
    dispatch(checkout(order));
  };

  return (
    <>
      <div>
        {show ? (
          <div
            style={{
              marginLeft: "1.5rem",
              marginRight: "1.5rem",
              marginTop: "1rem",
            }}
          >
            <CardElement options={CARD_OPTIONS} />
          </div>
        ) : (
          ""
        )}
        <h5 onClick={handleSubmit} className="place_order">
          PLACE ORDER
        </h5>
      </div>
    </>
  );
};

export default PaymentCard;
