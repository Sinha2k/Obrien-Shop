import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryString from "query-string";
import moment from "moment";

const URL = "http://localhost/php/obrien";

const productSliceReducer = createSlice({
  name: "products",
  initialState: {
    fruits: [],
    fruitDetail: {},
    status: "idle",
    fruitsCount: 0,
    numOfPage: 0,
  },
  reducers: {
    addToCart: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder

      //fetch fruits list
      .addCase(fetchFruits.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchFruits.fulfilled, (state, action) => {
        state.fruits = action.payload.obj;
        state.numOfPage = action.payload.numOfPage;
        state.fruitsCount = action.payload.totalCount;
        state.status = "idle";
      })

      //fetch fruit detail
      .addCase(fetchFruitDetail.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchFruitDetail.fulfilled, (state, action) => {
        state.fruitDetail = action.payload;
        state.status = "idle";
      })

      //add fruit
      .addCase(addFruits.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addFruits.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(addFruits.rejected, (state, action) => {
        alert(action.payload);
        state.status = "idle";
      })

      //update fruit
      .addCase(updateFruit.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateFruit.fulfilled, (state, action) => {
        state.status = "idle";
        toast.success("Update product successfully");
      })
      .addCase(updateFruit.rejected, (state, action) => {
        alert(action.payload);
        state.status = "idle";
      })

      //delete fruit
      .addCase(deleteFruit.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteFruit.fulfilled, (state, action) => {
        const index = state.fruits.findIndex(
          (item) => item._id === action.payload
        );
        state.fruits.splice(index, 1);
        state.status = "idle";
        toast.success("Remove product successfully");
      })

      //sale fruit
      .addCase(saleFruit.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(saleFruit.fulfilled, (state, action) => {
        state.status = "idle";
      })

      //add gallery
      .addCase(addImages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addImages.fulfilled, (state, action) => {
        state.status = "idle";
      })

      //delete gallery
      .addCase(deleteImages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteImages.fulfilled, (state, action) => {
        state.status = "idle";
      })
  },
});
// export const fetchFruits = createAsyncThunk('products/fetchFruits',async()=>{
//    const res = await axios.get(`/fruits`)
//    return res.data.fruits;
// })
export const fetchFruits = createAsyncThunk(
  "products/fetchFruits",
  async (filter) => {
    const params = queryString.stringify(filter);
    const res = await axios.get(URL + `/product/listproduct?` + params);
    return res.data;
  }
);

export const fetchFruitDetail = createAsyncThunk(
  "products/fetchFruitDetail",
  async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      URL + "/product/getproduct/" + id,
      token
        ? {
            headers: { Authorization: `Bearer ${token}` },
          }
        : {}
    );
    return res.data.obj;
  }
);

export const addFruits = createAsyncThunk(
  "products/addFruits",
  async (newProduct) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        URL + "/product/createproduct",
        { ...newProduct },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Create product successfully");
      return res.data.obj;
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  }
);

export const updateFruit = createAsyncThunk(
  "products/updateFruit",
  async (updateProduct) => {
    const token = localStorage.getItem("token");
    await axios.put(
      URL + "/product/updateProduct/" + updateProduct.ID,
      {
        category: updateProduct.category,
        name: updateProduct.name,
        price: updateProduct.price,
        image: updateProduct.image,
        description: updateProduct.description,
        IsPublic: 1,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return updateProduct;
  }
);

export const deleteFruit = createAsyncThunk(
  "products/deleteFruit",
  async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(URL + "/product/deleteproduct/" + id, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  }
);

export const saleFruit = createAsyncThunk(
  "products/saleFruit",
  async (product) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        URL + "/product/updateSale/" + product.id,
        {
          priceSale: product.priceSale,
          startSale: moment(product.startSale).format("YYYY-MM-DD hh:mm:ss"),
          endSale: moment(product.endSale).format("YYYY-MM-DD hh:mm:ss"),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Create sale successfully");
    } catch (err) {
      toast.error(err.response.data.errors);
    }
  }
);

export const addImages = createAsyncThunk(
  "products/addImages",
  async (gallery) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        URL + "/gallery/addImage/" + gallery.id,
        { gallery: gallery.gallery },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Add gallery successfully");
      return res.data.obj;
    } catch (err) {
      toast.error(err.response.data.errors);
    }
  }
);

export const deleteImages = createAsyncThunk(
  "products/deleteImages",
  async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        URL + "/gallery/deleteImage/" + id,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Delete image successfully");
      // return res.data.obj;
    } catch (err) {
      toast.error(err.response.data.errors);
    }
  }
);

export default productSliceReducer;
