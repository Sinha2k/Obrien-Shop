import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@mui/material";
import {
  CancelOrder,
  getAdminOrderById,
  getCancelReason,
  updateStatusOrder,
} from "../../../redux_toolkit/reducer/orderSliceReducer";

const OrderDetail = ({
  openOrder,
  setOpenOrder,
  transition,
  steps,
  order,
  option,
}) => {
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const listStatus = useSelector((state) => state.order.orderStatus);
  const cancelReason = useSelector((state) => state.order.cancelReason);
  const [reason, setReason] = useState("");
  const [statusOrder, setStatusOrder] = useState({
    status: "",
    description: "",
  });

  const dispatch = useDispatch();

  const updateStatus = () => {
    setOpenStatusDialog(false);
    if (option === "OrdersManage") {
      dispatch(
        updateStatusOrder({
          id: order.ID,
          statusOrder: statusOrder,
        })
      );
    } else {
      setOpenStatusDialog(false);
      dispatch(
        CancelOrder({
          id: order.ID,
          reason: reason,
        })
      );
    }
    setTimeout(() => {
      dispatch(getAdminOrderById(order.ID));
    }, [3000]);
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="md"
        open={openOrder}
        TransitionComponent={transition}
        keepMounted
        onClose={() => setOpenOrder(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ position: "relative" }}>
          {"Order Detail"}{" "}
          {option === "OrdersManage" ? (
            <Button
              style={{ position: "absolute", right: "2rem" }}
              onClick={() => setOpenStatusDialog(true)}
            >
              Update status
            </Button>
          ) : (
            <Button
              style={{ position: "absolute", right: "2rem" }}
              onClick={() => {
                if (cancelReason?.length === 0) {
                  dispatch(getCancelReason())
                }
                setTimeout(() => {
                  setOpenStatusDialog(true);
                }, [1000]);
              }}
            >
              Cancel
            </Button>
          )}
        </DialogTitle>
        <DialogContent>
          {/* <Stepper activeStep={steps.indexOf(order?.status)} alternativeLabel>
            {steps?.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper> */}
          <div style={{ marginTop: "-20px" }} className="dash_board">
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Fullname</th>
                  <th>Address</th>
                  <th>Phone number</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
                    {order?.user?.name}
                  </td>
                  <td style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
                    {order?.address}
                  </td>
                  <td style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
                    {order?.phone}
                  </td>
                  <td style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
                    {order?.note}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            style={{
              width: "100%",
              marginLeft: "0",
              textAlign: "center",
              marginTop: "2rem",
            }}
            className="shopping_cart"
          >
            <table className="shopping_table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {order &&
                  order.product?.map((item) => (
                    <tr key={item.ID}>
                      <td>
                        <img
                          style={{ width: "80px" }}
                          src={item.image}
                          alt=""
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>${item.unitPrice}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 1,
              },
            }}
          >
            {order?.shipping?.map((item, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent color="textSecondary">
                  {item.createdAt}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  {index === order?.shipping?.length - 1 ? (
                    <TimelineDot color="success" />
                  ) : (
                    <>
                      <TimelineDot variant="outlined" />
                      <TimelineConnector />
                    </>
                  )}
                </TimelineSeparator>
                <TimelineContent>{item.description}</TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle id="draggable-dialog-title">
          {option === "OrdersManage"
            ? "Update status for this order"
            : "Reason for cancelling this order"}
        </DialogTitle>
        <DialogContent>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={option === "OrdersManage" ? statusOrder.status : reason}
            onChange={(e) =>
              option === "OrdersManage"
                ? setStatusOrder({ ...statusOrder, status: e.target.value })
                : setReason(e.target.value)
            }
          >
            {option === "OrdersManage"
              ? listStatus
                  ?.slice(listStatus?.indexOf(order?.status) + 1)
                  ?.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      value={item}
                      control={<Radio />}
                      label={item}
                    />
                  ))
              : cancelReason?.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item}
                    control={<Radio />}
                    label={item}
                  />
                ))}
          </RadioGroup>
          {option === "OrdersManage" && (
            <TextField
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={4}
              required
              style={{ width: "100%", marginTop: "1rem" }}
              placeholder="Description"
              value={statusOrder.description}
              onChange={(e) =>
                setStatusOrder({ ...statusOrder, description: e.target.value })
              }
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpenStatusDialog(false)}>
            Cancel
          </Button>

          {option === "OrdersManage" ? (
            <Button
              disabled={!(statusOrder.status && statusOrder.description)}
              onClick={updateStatus}
            >
              Update
            </Button>
          ) : (
            <Button disabled={!reason} onClick={updateStatus}>
              {" "}
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderDetail;
