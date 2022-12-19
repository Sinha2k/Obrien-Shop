import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import queryString from "query-string";

const URL = "http://localhost/php/obrien";

const userSliceReducer = createSlice({
  name: "users",
  initialState: {
    user: {},
    userList: [],
    token: "",
    status: "idle",
    isLogin: false,
    isAdmin: false,
    wishList: [],
    orders: [],
    allOrders: [],
    sales: [],
    customers: [
      {
        name: "",
        total: 0,
      },
    ],
    products_quantity: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      //login
      .addCase(login.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
      })

      //register
      .addCase(register.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(register.rejected, (state, action) => {
        alert(action.payload);
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "idle";
      })

      //forgot password
      .addCase(forgotPassword.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.status = "idle";
      })

      //refresh token
      .addCase(refresh.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isLogin = true;
      })
      //get user
      .addCase(getUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        if (state.user.role === "ROLE_ADMIN") {
          state.isAdmin = true;
        } else {
          state.isAdmin = false;
        }
        state.status = "idle";
      })

      //logout
      .addCase(logout.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state, action) => {
        localStorage.clear();
        state.isLogin = false;
        state.isAdmin = false;
        state.status = "idle";
      })

      //update profile
      .addCase(updateProfile.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user.firstName = action.payload.firstName;
        state.user.lastName = action.payload.lastName;
        state.user.avatar = action.payload.avatar;
        state.status = "idle";
        // alert("Upload profile successfully !!!");
      })

      //change password
      .addCase(changePassword.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "idle";
        toast.error("Something went wrong :(((");
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = "idle";
        toast.success("Change password successfully !!!");
      })

      //get all user
      .addCase(getAllUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.userList = action.payload;
        state.status = "idle";
      })

      //change role
      .addCase(updateUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.userList.findIndex(
          (item) => item.ID === action.payload.ID
        );
        if (index >= 0) {
          state.userList[index].role = action.payload.role;
        }
        toast.success("Change role successfully !!!");
        state.status = "idle";
      })

      //delete user
      .addCase(deleteUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const index = state.userList.findIndex(
          (item) => item.ID === action.payload
        );
        state.userList.splice(index, 1);
        state.status = "idle";
        toast.success("Remove user successfully");
        // alert('Remove user successfully !!!')
      });
  },
});

export const login = createAsyncThunk("users/login", async (user) => {
  try {
    const res = await axios.post(
      "http://localhost/php/obrien/auth/login/",
      { ...user }
    );
    toast.success("Login successfully ^^");
    window.location = "/";
    localStorage.setItem("firstLogin", true);
    localStorage.setItem("refreshtoken", res.data.refreshToken);
    return res.data.token;
  } catch (err) {
    toast.error(err.response.data.errors[0]);
  }
});

export const register = createAsyncThunk("users/register", async (email) => {
  try {
    await axios.post(URL + "/auth/register", { email: email });
    toast.success("Register successfully ^^");
    window.location = "/login";
  } catch (err) {
    toast.error(err.response.data.errors);
  }
});

export const forgotPassword = createAsyncThunk("users/forgotPassword", async (email) => {
  try {
    await axios.post(URL + "/auth/forgotPassword", { email: email });
    toast.success("Check mail and get new password ^^");
  } catch (err) {
    toast.error(err.response.data.errors);
  }
});

export const refresh = createAsyncThunk("users/refresh_token", async () => {
  let token = localStorage.getItem("refreshtoken");
  const res = await axios.get(
    "http://localhost/php/obrien/auth/refreshtoken",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  localStorage.setItem("token", res.data.token);
  return res.data.token;
});

export const getUser = createAsyncThunk("users/getUser", async (token) => {
  const res = await axios.get(URL + "/user/getprofile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  // localStorage.setItem("user", JSON.stringify(res.data.obj));
  return res.data.obj;
});

export const updateProfile = createAsyncThunk(
  "users/updateProfile",
  async (profile) => {
    const token = localStorage.getItem("token");
    await axios.put(
      URL + "/user/updateprofile",
      { ...profile },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("Update profile successfully");
    return profile;
  }
);

export const changePassword = createAsyncThunk(
  "users/changePassword",
  async (password) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        URL + "/user/changePassword",
        { ...password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  }
);

export const getAllUser = createAsyncThunk(
  "users/getAllUser",
  async (filter) => {
    const token = localStorage.getItem("token");
    const params = queryString.stringify(filter);
    const res = await axios.get(URL + `/user/listuser?` + params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.obj;
  }
);

export const updateUser = createAsyncThunk("users/updateUser", async (user) => {
  const token = localStorage.getItem("token");
  await axios.put(
    URL + `/user/updateUser/` + user.ID,
    {
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role === "ROLE_USER" ? "ROLE_ADMIN" : "ROLE_USER",
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return {
    ID: user.ID,
    role: user.role === "ROLE_USER" ? "ROLE_ADMIN" : "ROLE_USER",
  };
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(URL + "/user/deleteuser/" + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
});

export const logout = createAsyncThunk("users/logout", async () => {
  let token = localStorage.getItem("refreshtoken");
  await axios.post(
    URL + "/auth/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  window.location = "/login";
});

export default userSliceReducer;
