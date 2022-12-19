import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryString from "query-string";

const URL = "http://localhost/php/obrien";

const wishlistSliceReducer = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    totalCount: 0,
    method: "",
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // get wish list
      .addCase(getWishList.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getWishList.fulfilled, (state, action) => {
        state.wishlist = action.payload.obj;
        state.totalCount = action.payload.totalCount;
        state.total = action.payload.total;
        state.status = "idle";
      })

      //add wish list
      .addCase(addWishList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addWishList.fulfilled, (state, action) => {
        state.totalCount = state.totalCount + 1;
        toast.success("Add wish list successfully !!!");
        state.status = "idle";
      })

      //remove from wish list
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload.obj;
        state.totalCount = state.totalCount - 1;
        state.status = "idle";
      });
  },
});

export const getWishList = createAsyncThunk(
  "wishlist/getWishList",
  async (wishParams) => {
    const params = queryString.stringify(wishParams);
    const token = localStorage.getItem("token");
    const res = await axios.get(URL + "/wish/getwishlist?" + params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const addWishList = createAsyncThunk(
  "wishlist/addProduct",
  async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      URL + "/wish/addproduct/" + id,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeProduct",
  async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(URL + "/wish/removeproduct/" + id, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export default wishlistSliceReducer;
