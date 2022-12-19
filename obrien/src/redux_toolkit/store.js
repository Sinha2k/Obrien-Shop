import { configureStore } from "@reduxjs/toolkit";
import blogSliceReducer from "./reducer/blogSliceReducer";
import cartSliceReducer from "./reducer/cartSliceReducer";
import productSliceReducer from "./reducer/productSliceReducer";
import filterSliceReducer from "./reducer/filterSliceReducer";
import userSliceReducer from "./reducer/userSliceReducer";
import orderSliceReducer from "./reducer/orderSliceReducer";
import wishlistSliceReducer from "./reducer/wishlistSliceReducer";
import categorySliceReducer from "./reducer/categorySliceReducer";
import reviewSliceReducer from "./reducer/reviewSliceReducer";

const store = configureStore({
  reducer: {
    products: productSliceReducer.reducer,
    category: categorySliceReducer.reducer,
    blogs: blogSliceReducer.reducer,
    cart: cartSliceReducer.reducer,
    filter: filterSliceReducer.reducer,
    user: userSliceReducer.reducer,
    order: orderSliceReducer.reducer,
    wishList: wishlistSliceReducer.reducer,
    review: reviewSliceReducer.reducer
  },
});

export default store;
