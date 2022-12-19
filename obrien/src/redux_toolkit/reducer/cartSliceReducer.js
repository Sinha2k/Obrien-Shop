import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const URL = "http://localhost/php/obrien";

const cartSliceReducer = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    numOfPro: 0,
    total: 0,
    method: "",
    status: "idle",
  },
  reducers: {
    getCart: (state, action) => {
      if (action.payload) {
        state.cart = action.payload;
        state.method = "GET";
      }
    },
    addToCart: (state, action) => {
      if (action.payload) {
        const check = state.cart.every((item) => {
          return item._id !== action.payload._id;
        });
        if (check) {
          state.method = "POST";
          state.cart.push(action.payload);
        }
      }
    },
    decreasement: (state, action) => {
      state.method = "UPDATE";
      state.cart.forEach((item) => {
        if (item._id === action.payload) {
          if (item.quantity > 1) {
            item.quantity -= 1;
          }
        }
      });
    },
    increasement: (state, action) => {
      state.method = "UPDATE";
      state.cart.forEach((item) => {
        if (item._id === action.payload) {
          if (item.quantity < 6) {
            item.quantity += 1;
          }
        }
      });
    },
    removeProduct: (state, action) => {
      const index = state.cart.findIndex((item) => item._id === action.payload);
      state.cart.splice(index, 1);
      state.method = "DELETE";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload.obj;
        state.numOfPro = action.payload.numOfProduct;
        state.total = action.payload.total;
        state.status = "idle";
      })

      //add to cart
      .addCase(addProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.numOfPro = action.payload.numOfProduct;
        toast.success("Add cart successfully !!!");
        state.status = "idle";
      })

      .addCase(removeProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.cart = action.payload.obj;
        state.numOfPro = action.payload.numOfProduct;
        state.total = action.payload.total;
        state.status = "idle";
      })

      //increase quantity

      .addCase(increaseQuantity.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.cart = action.payload.obj;
        state.total = action.payload.total;
        state.status = "idle";
      })

      //decrease quantity

      .addCase(decreaseQuantity.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.cart = action.payload.obj;
        state.total = action.payload.total;
        state.status = "idle";
      })

      //check out
      .addCase(checkout.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.cart = [];
        state.total = 0;
        state.numOfPro = 0;
        state.status = "idle";
        toast.success("Check out successfully !!!")
      });
  },
});

export const fetchCart = createAsyncThunk("cart/getCart", async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(URL + "/cart/getCart", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const addProduct = createAsyncThunk(
  "cart/addProduct",
  async (product) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      URL + "/cart/addProduct/" + product.ID,
      { quantity: product.quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }
);

export const removeProduct = createAsyncThunk(
  "cart/removeProduct",
  async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(URL + "/cart/removeProduct/" + id, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      URL + "/cart/incrementByOne/" + id,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      URL + "/cart/decrementByOne/" + id,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }
);

export const checkout = createAsyncThunk(
  "cart/checkout",
  async (information) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      URL + "/order/createOrder/",
      { ...information },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }
);

export default cartSliceReducer;
