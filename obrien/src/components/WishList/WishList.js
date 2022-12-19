import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadingUserSelector } from "../../redux_toolkit/selector/selector";
import Loading from "../utils/Loading/Loading";
import box_empty from "../image/safety-box.png";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { addProduct } from "../../redux_toolkit/reducer/cartSliceReducer";
import { removeFromWishlist } from "../../redux_toolkit/reducer/wishlistSliceReducer";

const WishList = () => {
  const dispatch = useDispatch();
  const wishList = useSelector((state) => state.wishList.wishlist);
  const loading = useSelector((state) => state.wishList.status);
  const loadingCart = useSelector(state => state.cart.status)
  const total = useSelector((state) => state.wishList.totalCount);
  const loadingUser = useSelector(loadingUserSelector);
  // const addToCart = (product)=>{
  //     if(user.isLogin){
  //         if(cart){
  //             const check = cart.every(item =>item._id !== product._id)
  //             if(check){
  //                 dispatch(cartSliceReducer.actions.addToCart(product))
  //                 dispatch(addCartFunction())
  //             }else{
  //                 toast.error("This product has been added your cart before")
  //             }
  //         }
  //     }else{
  //         toast.warning('You must login to add cart')
  //     }
  // }
  const addToCart = (product) => {
    dispatch(addProduct({...product, quantity: 1}));
  };
  const removeWishList = (id) => {
    if (
      window.confirm(
        "Do you really want to remove this product from wish list ???"
      )
    ) {
      dispatch(removeFromWishlist(id))
    }
  };
  // if(!user.isLogin){
  //     return <Navigate replace to='/error'/>
  // }
  return (
    <>
      {[loadingUser, loading, loadingCart].includes("loading") ? <Loading /> : ""}
      <div className="wish_list shopping_cart">
        <table className="shopping_table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Price</th>
              <th>Add to cart</th>
              <th style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {total === 0 ? (
              <tr className="no_order_row">
                <td></td>
                <td></td>
                <td>
                  <div className="no_order">
                    <img alt="" src={box_empty} />
                    <span>Whishlist empty</span>
                  </div>
                </td>
                <td></td>
                <td></td>
              </tr>
            ) : (
              wishList.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img src={item.image} alt="" />
                  </td>
                  <td>{item.name}</td>
                  <td>${item.sale === 1 ? item.priceSale : item.price}</td>
                  <td>
                    <div
                      style={{ margin: "auto", marginLeft: "10px" }}
                      className="function"
                    >
                      <h4
                        onClick={() => addToCart(item)}
                        style={{ width: "80%" }}
                      >
                        ADD TO CART
                      </h4>
                    </div>
                  </td>
                  <td>
                    <i
                      onClick={() => removeWishList(item.ID)}
                      style={{ fontSize: "1.5rem" }}
                      className="fa fa-trash-o"
                      aria-hidden="true"
                    ></i>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </>
  );
};

export default WishList;
