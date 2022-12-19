import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import {
  forgotPassword,
  login,
} from "../../../redux_toolkit/reducer/userSliceReducer";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  loadingUserSelector,
  userSelector,
} from "../../../redux_toolkit/selector/selector";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Loading from "../../utils/Loading/Loading";
const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const userState = useSelector(userSelector);
  const loading = useSelector(loadingUserSelector);
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const loginSubmit = async (user) => {
    dispatch(login(user));
  };
  const forgetPassword = () => {
    if (user.email) {
      dispatch(forgotPassword(user.email));
    } else {
      toast.warning("You must enter your email first");
    }
  };
  if (userState.isLogin) {
    return <Navigate replace to="/error" />;
  }
  return (
    <>
      {loading === "loading" && <Loading />}
      <div className="login_form">
        <h5>Login</h5>
        <p>Please login using account detail below</p>
        <OutlinedInput
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="input"
          placeholder="Email or Username"
          type="Email"
        />

        <div style={{ position: "relative", display: "flex", width: "90%" }}>
          <OutlinedInput
            style={{ width: "100%" }}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="input"
            placeholder="Enter your password"
            type={`${showPass ? "text" : "password"}`}
          />
          <i
            style={{
              position: "absolute",
              right: "20px",
              background: "transparent",
              color: "#111",
              padding: "0",
              top: "58%",
              cursor: "pointer",
            }}
            onClick={() => setShowPass(!showPass)}
            class={`fa ${showPass ? "fa-eye" : "fa-eye-slash"}`}
            aria-hidden="true"
          ></i>
        </div>
        <div className="remember">
          <FormControlLabel
            label="Remember me"
            control={<Checkbox className="checkbox" />}
          />
          <p onClick={() => forgetPassword()}>Forget Password ?</p>
        </div>
        <div
          style={{
            width: "90%",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Button
            onClick={() => loginSubmit(user)}
            className="button"
            variant="contained"
          >
            Login
          </Button>
        </div>
        <div
          style={{
            width: "90%",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <a className="create_account" href="/register">
            Create Account
          </a>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
