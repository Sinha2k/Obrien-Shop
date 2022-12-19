import React, { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Slide from "@mui/material/Slide";
import OrderDetail from "../utils/OrderItem/OrderDetail";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import box_empty from "../image/treasure.png";
import {
  getAdminOrder,
  getAdminOrderById,
  getStatus,
} from "../../redux_toolkit/reducer/orderSliceReducer";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import { Pagination, Stack } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const OrderManagement = ({ option }) => {
  const [openOrder, setOpenOrder] = useState(false);
  const order = useSelector((state) => state.order);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const [orderFilterAdmin, setOrderFilterAdmin] = useState({
    page: 1,
    perPage: 5,
    status: "To Ship",
    startDate: moment(firstDay).format("YYYY-MM-DD"),
    endDate: moment(lastDay).format("YYYY-MM-DD"),
  });

  const handleChangePage = (event, value) => {
    setPage(value);
    setOrderFilterAdmin({ ...orderFilterAdmin, page: value });
  };

  const renderTabContent = (index) => (
    <TabPanel value={`${index}`}>
      <div style={{ display: "flex" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="Start date"
            inputFormat="yyyy-MM-dd"
            value={new Date(orderFilterAdmin.startDate)}
            onChange={(value) => {
              setOrderFilterAdmin({
                ...orderFilterAdmin,
                startDate: moment(value).format("YYYY-MM-DD"),
              });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <div style={{ width: "1.5rem" }} className="distance"></div>
          <DesktopDatePicker
            label="End date"
            inputFormat="yyyy-MM-dd"
            value={new Date(orderFilterAdmin.endDate)}
            onChange={(value) => {
              setOrderFilterAdmin({
                ...orderFilterAdmin,
                endDate: moment(value).format("YYYY-MM-DD"),
              });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {order.totalCount === "0" ? (
            <tr className="no_order_row">
              <td></td>
              <td></td>
              <td>
                <div className="no_order">
                  <img alt="" src={box_empty} />
                  <span>No order</span>
                </div>
              </td>
              <td></td>
              <td></td>
            </tr>
          ) : (
            order.orderAdmin.map((item) => {
              return (
                <tr key={item.ID}>
                  <td>{item.ID}</td>
                  <td>{moment(item.createdAt).format("LLL")}</td>
                  <td>{item.status}</td>
                  <td>${item.total}</td>
                  <td>
                    <p
                      onClick={() => {
                        dispatch(getAdminOrderById(item.ID));
                        setTimeout(() => {
                          setOpenOrder(true);
                        }, [1500]);
                      }}
                    >
                      View
                    </p>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "50px",
          marginTop: "2rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={2}>
          <Pagination
            count={order.numOfPage}
            variant="outlined"
            shape="rounded"
            color="primary"
            page={page}
            onChange={handleChangePage}
          />
        </Stack>
        <p>
          Showing {(page - 1) * 5 + 1} -{" "}
          {page === order.numOfPage ? order.totalCount : page * 5} of{" "}
          {order.totalCount} results
        </p>
      </div>
    </TabPanel>
  );

  const [valueManage, setValueManage] = useState("1");

  const handleChangeTabManage = (event, newValue) => {
    setValueManage(newValue);
  };

  useEffect(() => {
    if (option === "OrdersManage") {
      dispatch(getAdminOrder(orderFilterAdmin));
    }
  }, [orderFilterAdmin, dispatch]);

  useEffect(() => {
    dispatch(getStatus());
  }, [dispatch]);

  return (
    <div className="dash_board">
      <h6>Orders</h6>
      <TabContext value={valueManage}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChangeTabManage}
            aria-label="lab API tabs example"
          >
            {order.orderStatus?.map((item, index) => (
              <Tab
                onClick={() =>
                  setOrderFilterAdmin({ ...orderFilterAdmin, status: item })
                }
                label={`${item}`}
                value={`${index + 1}`}
              />
            ))}
          </TabList>
        </Box>
        {renderTabContent(valueManage)}
      </TabContext>
      <OrderDetail
        order={order.order}
        steps={order.orderStatus}
        openOrder={openOrder}
        setOpenOrder={setOpenOrder}
        transition={Transition}
        option={option}
      />
    </div>
  );
};

export default OrderManagement;
