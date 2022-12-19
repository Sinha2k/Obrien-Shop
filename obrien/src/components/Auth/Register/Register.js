import React, { useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../redux_toolkit/reducer/userSliceReducer";
import { Navigate } from "react-router-dom";
import {
  loadingUserSelector,
  userSelector,
} from "../../../redux_toolkit/selector/selector";
import Loading from "../../utils/Loading/Loading";
const Register = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const userState = useSelector(userSelector);
  const loading = useSelector(loadingUserSelector);
  const registerSubmit = (email) => {
    dispatch(register(email));
  };
  if (userState.isLogin) {
    return <Navigate replace to="/error" />;
  }
  return (
    <>
      {loading === "loading" && <Loading />}
      <div className="login_form">
        <h5>Create Account</h5>
        <p>Please Register account by get password from email.</p>
        <OutlinedInput
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="Enter your email"
          type="Email"
        />
        <div
          style={{
            width: "90%",
            display: "flex",
            justifyContent: "center",
            paddingBottom: "2rem",
            marginTop: "1rem",
          }}
        >
          <Button
            onClick={() => registerSubmit(email)}
            className="button"
            variant="contained"
          >
            Get password to login
          </Button>
        </div>
      </div>
    </>
  );
};

export default Register;
