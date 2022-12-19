import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryString from "query-string";

const URL = "http://localhost/php/obrien";

const reviewSliceReducer = createSlice({
  name: "review",
  initialState: {
    productReviews: [],
    status: "idle",
    countReviews: [],
    numOfPage: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      //get product review list
      .addCase(getProductReviews.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.productReviews = action.payload.obj;
        state.countReviews = action.payload.countOfReviews;
        state.numOfPage = action.payload.numOfPage;
        state.status = "idle";
      })

      //get admin product review list
      .addCase(getAdminProductReviews.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAdminProductReviews.fulfilled, (state, action) => {
        state.productReviews = action.payload.obj;
        state.countReviews = action.payload.countOfReviews;
        state.numOfPage = action.payload.numOfPage;
        state.status = "idle";
      })

      //add review
      .addCase(addReview.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(addReview.rejected, (state, action) => {
        alert(action.payload);
        state.status = "idle";
      })

      //set public review
      .addCase(setPublic.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(setPublic.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(setPublic.rejected, (state, action) => {
        alert(action.payload);
        state.status = "idle";
      });
  },
});

export const getProductReviews = createAsyncThunk(
  "review/getProductReviews",
  async (productReview) => {
    const params = queryString.stringify(productReview.params);
    const res = await axios.get(
      URL + `/review/productReview/` + productReview.id + `?${params}`
    );
    return res.data;
  }
);

export const getAdminProductReviews = createAsyncThunk(
  "review/getAdminProductReviews",
  async (productReview) => {
    const token = localStorage.getItem("token");
    const params = queryString.stringify(productReview.params);
    const res = await axios.get(
      URL + `/review/adminProductReview/` + productReview.id + `?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }
);

export const addReview = createAsyncThunk(
  "review/addReview",
  async (review) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        URL + "/review/addReview/" + review.id,
        { review: review.review },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Review product successfully");
    } catch (err) {
      toast.error(err.response.data.errors);
    }
  }
);

export const setPublic = createAsyncThunk("review/setPublic", async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      URL + "/review/adminSetPublic/" + id,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("Set public review successfully");
  } catch (err) {
    toast.error(err.response.data.errors);
  }
});

export default reviewSliceReducer;
