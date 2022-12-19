import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const URL = "http://localhost/php/obrien";

const categorySliceReducer = createSlice({
  name: "category",
  initialState: {
    categories: [],
    status: "idle",
  },
  reducers: {
    addToCart: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder

      //get category list
      .addCase(getCategories.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload.obj;
        state.status = "idle";
      });
  },
});

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async () => {
    const res = await axios.get(URL + `/category/listcategory`);
    return res.data;
  }
);

export default categorySliceReducer;
