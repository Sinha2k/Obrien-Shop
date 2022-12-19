import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import queryString from "query-string";

const URL = "http://localhost/php/obrien";

const orderSliceReducer = createSlice({
  name: "order",
  initialState: {
    orderList: [],
    orderAdmin: [],
    orderStatus: [],
    order: {},
    totalCount: 0,
    numOfPage: 0,
    status: "idle",
    cancelReason: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //get order list
      .addCase(getOrder.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.totalCount = 0;
        state.status = "idle";
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.orderList = action.payload.obj;
        state.totalCount = action.payload.totalCount;
        state.numOfPage = action.payload.numOfPage;
        state.status = "idle";
      })

      //get admin order list
      .addCase(getAdminOrder.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAdminOrder.rejected, (state, action) => {
        state.totalCount = 0;
        state.status = "idle";
      })
      .addCase(getAdminOrder.fulfilled, (state, action) => {
        state.orderAdmin = action.payload.obj;
        state.totalCount = action.payload.totalCount;
        state.numOfPage = action.payload.numOfPage;
        state.status = "idle";
      })

      //get order by id
      .addCase(getOrderById.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.order = action.payload.obj;
        state.status = "idle";
      })

      //get admin order by id
      .addCase(getAdminOrderById.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAdminOrderById.fulfilled, (state, action) => {
        state.order = action.payload.obj;
        state.status = "idle";
      })

      //get status list
      .addCase(getStatus.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getStatus.fulfilled, (state, action) => {
        state.orderStatus = Object.values(action.payload);
        state.status = "idle";
      })

      //create order - check out
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        toast.success("Check out successfully !!!");
        state.status = "idle";
      })

      //update status order
      .addCase(updateStatusOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateStatusOrder.fulfilled, (state, action) => {
        toast.success("Update status successfully !!!");
        state.status = "idle";
      })

      //get cancel reason
      .addCase(getCancelReason.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getCancelReason.fulfilled, (state, action) => {
        state.cancelReason = action.payload;
        state.status = "idle";
      })

      //cancel order
      .addCase(CancelOrder.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(CancelOrder.fulfilled, (state, action) => {
        state.status = "idle";
      })

      //receive order
      .addCase(orderReceive.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(orderReceive.fulfilled, (state, action) => {
        state.status = "idle";
      });
  },
});

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (orderParams) => {
    const token = localStorage.getItem("token");
    const params = queryString.stringify(orderParams);
    const res = await axios.get(URL + "/order/mylistOrder?" + params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const getAdminOrder = createAsyncThunk(
  "order/getAdminOrder",
  async (orderParams) => {
    const token = localStorage.getItem("token");
    const params = queryString.stringify(orderParams);
    const res = await axios.get(URL + "/order/adminListOrder?" + params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);
  
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (information) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "/order/createOrder/",
      { ...information },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }
);

export const getStatus = createAsyncThunk("order/getStatus", async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(URL + "/order/liststatus", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
});

export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(URL + "/order/getMyOrder/" + id, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const getAdminOrderById = createAsyncThunk(
  "order/getAdminOrderById",
  async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(URL + "/order/admingetOrder/" + id, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const updateStatusOrder = createAsyncThunk(
  "order/updateStatusOrder",
  async (order) => {
    const token = localStorage.getItem("token");
    await axios.put(
      URL + "/order/setStatusOrder/" + order.id,
      order.statusOrder,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // console.log(res.data);
  }
);

export const getCancelReason = createAsyncThunk(
  "order/getCancelReason",
  async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(URL + "/order/cancelReason", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const CancelOrder = createAsyncThunk(
  "order/CancelOrder",
  async (reason) => {
    const token = localStorage.getItem("token");
    await axios.put(
      URL + "/order/cancelOrder/" + reason.id,
      { reason: reason.reason },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("Cancel this order successfully !!!")
  }
);

export const orderReceive = createAsyncThunk(
  "order/orderReceive",
  async (id) => {
    const token = localStorage.getItem("token");
    await axios.put(
      URL + "/order/orderReceived/" + id,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("Accept receive successfully !!!")
  }
);

export default orderSliceReducer;
