import React, { useEffect, useState } from "react";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import {
  addFruits,
  deleteFruit,
  fetchFruitDetail,
  fetchFruits,
  saleFruit,
  updateFruit,
} from "../../redux_toolkit/reducer/productSliceReducer";
import {
  loadingSelector,
  loadingUserSelector,
  productsSelector,
  userSelector,
} from "../../redux_toolkit/selector/selector";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Loading from "../utils/Loading/Loading";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import {
  changePassword,
  deleteUser,
  getAllUser,
  logout,
  updateProfile,
  updateUser,
} from "../../redux_toolkit/reducer/userSliceReducer";
import Tooltip from "@mui/material/Tooltip";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import OrderDetail from "../utils/OrderItem/OrderDetail";
import box_empty from "../image/treasure.png";
import AnimatedNumber from "animated-number-react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Radar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {
  getOrder,
  getOrderById,
  getStatus,
  orderReceive,
} from "../../redux_toolkit/reducer/orderSliceReducer";
import { getCategories } from "../../redux_toolkit/reducer/categorySliceReducer";
import OrderManagement from "./OrderManagement";
import ReviewModal from "./ReviewModal";
import { Pagination, Stack } from "@mui/material";
import ProductReview from "./ProductReview";
import GalleryModal from "./GalleryModal";
Chart.register(CategoryScale);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
const MyAccount = () => {
  const [option, setOption] = useState("Dashboard");
  const dispatch = useDispatch();
  const productsList = useSelector(productsSelector);
  const user = useSelector(userSelector);
  const userList = useSelector((state) => state.user.userList);
  const detailProduct = useSelector((state) => state.products.fruitDetail);
  const all = useSelector((state) => state.products.fruitsCount);
  const numOfPage = useSelector((state) => state.products.numOfPage);
  const categories = useSelector((state) => state.category.categories);
  const order = useSelector((state) => state.order);
  const loading = useSelector(loadingSelector);
  const loadingUser = useSelector(loadingUserSelector);
  const loadingOrder = useSelector((state) => state.order.status);
  const loadingReview = useSelector((state) => state.review.status);
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const [openGallery, setOpenGallery] = useState(false);
  const [openReviewProduct, setOpenReviewProduct] = useState(false);
  const [progress, setProgress] = useState(0);
  const [edit, setEdit] = useState(false);
  const [openSaleDialog, setOpenSaleDialog] = useState(false);
  const [reload, setReload] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [productId, setProductId] = useState(0);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const initialState = {
    name: "",
    image: "",
    price: 0,
    category: "",
    description: "",
    IsPublic: 1,
    gallery: [],
  };
  const initialStateCategory = {
    name: "",
    description: ""
  };
  const [product, setProduct] = useState(initialState);
  const [category, setCategory] = useState(initialStateCategory);
  useEffect(() => {
    if (detailProduct) {
      setProduct(detailProduct);
    }
  }, [detailProduct]);
  const [productSale, setProductSale] = useState({
    id: 0,
    priceSale: 0,
    startSale: "",
    endSale: "",
  });
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    avatar: "",
  });
  useEffect(() => {
    if (user) {
      setProfile({
        ...profile,
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        phone: user.user.phone,
        avatar: user.user.avatar,
      });
    }
  }, [user]);
  const handleClickOpen = () => {
    setOpen(true);
    setProduct(initialState);
    setEdit(false);
  };
  const handleClickOpenCategory = () => {
    setOpenCategory(true);
    setCategory(initialStateCategory);
    setEdit(false);
  };
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseCategory = () => {
    setOpenCategory(false);
  };
  const formHandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    console.log(file);
    uploadFile(file);
  };
  const uploadFile = (file) => {
    if (!file) {
      alert("File doesn't exist");
    }
    if (file.size > 1024 * 1024) {
      alert("File too large");
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      alert("File format is incorrect");
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) =>
          setProduct({ ...product, image: url })
        );
      }
    );
  };
  const editProduct = (id) => {
    setEdit(true);
    setTimeout(() => {
      setOpen(true);
    }, [1000]);
    dispatch(fetchFruitDetail(id));
  };
  const editCategory = (id) => {
    setEdit(true);
    setTimeout(() => {
      setOpenCategory(true);
    }, [500]);
  };
  const handleSubmit = () => {
    setOpen(false);
    setProduct(initialState);
    if (edit) {
      dispatch(updateFruit(product));
    } else {
      dispatch(addFruits(product));
    }
    setTimeout(() => {
      setReload(!reload);
    }, [1500]);
  };

  const handleSubmitCategory = () => {
    setOpenCategory(false);
    setCategory(initialState);
    if (edit) {
      dispatch();
    } else {
      dispatch();
    }
    setTimeout(() => {
      setReload(!reload);
    }, [1500]);
  };

  const deleteProduct = (id) => {
    if (window.confirm("Do you really want to remove this product ???")) {
      dispatch(deleteFruit(id));
      setTimeout(() => {
        setReload(!reload);
      }, [2000]);
    }
  };

  const deleteCategory = (id) => {
    if (window.confirm("Do you really want to remove this category ???")) {
      dispatch();
      setTimeout(() => {
        setReload(!reload);
      }, [1500]);
    }
  };
  const createSale = () => {
    setOpenSaleDialog(false);
    dispatch(saleFruit(productSale));
  };
  const uploadAvt = (file) => {
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const prog = Math.round((snapshot.bytesTransferred/ snapshot.totalBytes)*100)
        // setProgress(prog)
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          dispatch(
            updateProfile({
              phone: user.user.phone,
              firstName: user.user.firstName,
              lastName: user.user.lastName,
              avatar: url,
            })
          );
        });
      }
    );
  };
  const handlerImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      alert("File doesn't exist");
    }
    if (file.size > 1024 * 1024) {
      alert("File too large");
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      alert("File format is incorrect");
    }
    uploadAvt(file);
  };
  const handlerChange = () => {
    const inputFile = document.getElementById("file");
    inputFile.click();
  };
  const handlerChangeInput = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  const handleChangeInputCategory = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };
  const updateProfileSubmit = () => {
    dispatch(updateProfile(profile));
  };
  const handlerChangePassword = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };
  const changePasswordSubmit = () => {
    if (
      password.oldPassword &&
      password.newPassword &&
      password.confirmPassword
    ) {
      if (password.newPassword !== password.confirmPassword) {
        toast.warning("Confirm password is incorrect !!!");
      } else {
        dispatch(
          changePassword({
            password: password.oldPassword,
            newPass: password.newPassword,
          })
        );
        setPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    }
  };
  const deleteUserSubmit = (id) => {
    if (window.confirm("Do you really want remove this user ???")) {
      dispatch(deleteUser(id));
    }
  };

  const dashboardOption = () => {
    setOption("Dashboard");
    if (user.isAdmin) {
      dispatch(
        fetchFruits({
          sortBy: "sort=-sold",
          limit: "limit=7",
          page: "",
          category: "",
        })
      );
    }
  };
  const userOption = () => {
    setOption("Users");
  };
  const productOption = () => {
    setOption("Products");
    dispatch(getCategories());
  };

  const categoryOption = () => {
    setOption("Categories");
    dispatch(getCategories());
  };

  const [orderFilter, setOrderFilter] = useState({
    status: "To Ship",
    perPage: "4",
    page: "1",
  });

  const [sort, setSort] = useState("Alphabetically, A-Z");

  const [filter, setFilter] = useState({
    category: "",
    sortBy: "name",
    name: "",
    sale: "",
    sortType: "ASC",
    page: 1,
    perPage: 5,
  });

  const handleChangePage = (event, value) => {
    setFilter({ ...filter, page: value });
  };

  useEffect(() => {
    dispatch(fetchFruits(filter));
  }, [reload, dispatch, filter]);

  const handleChangeSort = (e) => {
    setSort(e.target.value);
  };

  const renderButtonAction = (key, id) => {
    if (key === "To Receive") {
      return (
        <td>
          <p
            onClick={() => {
              if (window.confirm("Do u really want to accept ???")) {
                dispatch(orderReceive(id));
              }
            }}
          >
            Accept
          </p>
        </td>
      );
    } else if (key === "To Rate") {
      return (
        <td>
          <p
            onClick={() => {
              dispatch(getOrderById(id));
              setTimeout(() => {
                setOpenReview(true);
              }, [1000]);
            }}
          >
            Review
          </p>
        </td>
      );
    } else {
      return "";
    }
  };

  const renderTabContent = (index) => (
    <TabPanel value={`${index}`}>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Action</th>
            {orderFilter.status === "To Receive" ||
            orderFilter.status === "To Rate" ? (
              <th></th>
            ) : (
              ""
            )}
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
              {orderFilter.status === "To Receive" ||
              orderFilter.status === "To Rate" ? (
                <td></td>
              ) : (
                ""
              )}
            </tr>
          ) : (
            order.orderList.map((item) => {
              return (
                <tr key={item.ID}>
                  <td>{item.ID}</td>
                  <td>{moment(item.createdAt).format("LLL")}</td>
                  <td>{item.status}</td>
                  <td>${item.total}</td>
                  <td>
                    <p
                      onClick={() => {
                        dispatch(getOrderById(item.ID));
                        setTimeout(() => {
                          setOpenOrder(true);
                        }, [1500]);
                      }}
                    >
                      View
                    </p>
                  </td>
                  {renderButtonAction(orderFilter.status, item.ID)}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </TabPanel>
  );

  const orderOption = () => {
    if (order.orderList.length === 0) {
      dispatch(getOrder(orderFilter));
      dispatch(getStatus());
    }
  };
  useEffect(() => {
    if (option === "Orders") {
      dispatch(getOrder(orderFilter));
    }
  }, [orderFilter, dispatch]);

  const [value, setValue] = useState("1");

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (option === "Dashboard" && user.isAdmin) {
      dispatch(
        getAllUser({
          sortBy: "createdAt",
          sortType: "ASC",
          role: "",
          email: "",
          page: "1",
          perPage: "10",
        })
      );
    }
  }, [dispatch, user.isAdmin]);
  // if( user.token === ""){
  //     return <Navigate replace to='/error'/>
  // }
  return (
    <>
      {[loading, loadingUser, loadingOrder, loadingReview].includes(
        "loading"
      ) ? (
        <Loading />
      ) : (
        ""
      )}
      <div className="my_account">
        <div className="left_bar">
          <i
            onClick={() => dashboardOption()}
            className={`fa fa-tachometer ${
              option === "Dashboard" ? "active_option" : ""
            }`}
            aria-hidden="true"
          >
            <h6>DASHBOARD</h6>
          </i>
          {user.isAdmin ? (
            <>
              <i
                onClick={() => userOption()}
                className={`fa fa-user-plus ${
                  option === "Users" ? "active_option" : ""
                }`}
                aria-hidden="true"
              >
                <h6>USERS MANAGEMENT</h6>
              </i>
              <i
                onClick={() => productOption()}
                className={`fa fa-product-hunt ${
                  option === "Products" ? "active_option" : ""
                }`}
                aria-hidden="true"
              >
                <h6>PRODUCTS MANAGEMENT</h6>
              </i>
              <i
                onClick={() => categoryOption()}
                className={`fa fa-product-hunt ${
                  option === "Categories" ? "active_option" : ""
                }`}
                aria-hidden="true"
              >
                <h6>CATEGORIES MANAGEMENT</h6>
              </i>
              {/* <i onClick={()=>setOption('Blogs')} className={`fa fa-book ${option === 'Blogs' ? 'active_option' : ''}`} aria-hidden="true"><h6>BLOGS MANAGEMENT</h6></i> */}
              <i
                onClick={() => {
                  setOption("OrdersManage");
                }}
                className={`fa fa-credit-card-alt ${
                  option === "OrdersManage" ? "active_option" : ""
                }`}
                aria-hidden="true"
              >
                <h6>ORDERS MANAGEMENT</h6>
              </i>
            </>
          ) : (
            ""
          )}
          <i
            onClick={() => {
              setOption("Orders");
              orderOption();
            }}
            className={`fa fa-cart-arrow-down ${
              option === "Orders" ? "active_option" : ""
            }`}
            aria-hidden="true"
          >
            <h6>ORDERS</h6>
          </i>
          <i
            onClick={() => setOption("Address")}
            className={`fa fa-map-marker ${
              option === "Address" ? "active_option" : ""
            }`}
            aria-hidden="true"
          >
            <h6>ADDRESS</h6>
          </i>
          <i
            onClick={() => setOption("Account")}
            className={`fa fa-user ${
              option === "Account" ? "active_option" : ""
            }`}
            aria-hidden="true"
          >
            <h6>ACCOUNT DETAILS</h6>
          </i>
          <i
            onClick={() => {
              if (window.confirm("Do u really want to logout ???")) {
                dispatch(logout());
              }
            }}
            className={`fa fa-sign-out ${
              option === "Logout" ? "active_option" : ""
            }`}
            aria-hidden="true"
          >
            <h6>LOGOUT</h6>
          </i>
        </div>
        <div className="display_content">
          {option === "Dashboard" ? (
            <div className="dash_board">
              <h6>Dashboard</h6>
              <p>
                Hello,{" "}
                <strong style={{ color: "#e98c81" }}>{user.user.name}</strong>
                <br />
                From your account dashboard. you can easily check & view your
                recent orders, manage your shipping and billing addresses and
                edit your password and account details.
              </p>
              {user.isAdmin ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                      marginTop: "2rem",
                    }}
                  >
                    <div className="card_dashboard">
                      <i className="fa fa-users" aria-hidden="true"></i>
                      <AnimatedNumber
                        value={
                          userList
                            ? userList.filter((item) => item.role === 0).length
                            : 0
                        }
                        duration={1000}
                        formatValue={(n) => n.toFixed(0)}
                      />
                      <strong
                        style={{
                          color: "#e98c81",
                          fontSize: "14px",
                          marginLeft: "10px",
                        }}
                      >
                        -10%
                      </strong>
                      <p>Customers</p>
                    </div>
                    <div className="card_dashboard">
                      <i className="fa fa-product-hunt" aria-hidden="true"></i>
                      <AnimatedNumber
                        value={user ? user.products_quantity : 0}
                        className="animated_number"
                        duration={1000}
                        formatValue={(n) => n.toFixed(0)}
                      />
                      <strong
                        style={{
                          color: "rgb(105, 168, 226)",
                          fontSize: "14px",
                          marginLeft: "10px",
                        }}
                      >
                        +50%
                      </strong>
                      <p>Products</p>
                    </div>
                    <div className="card_dashboard">
                      <i className="fa fa-line-chart" aria-hidden="true"></i>
                      <span>$</span>
                      <AnimatedNumber
                        value={
                          user.allOrders
                            ? user.allOrders.reduce((prev, item) => {
                                return prev + item.total;
                              }, 0)
                            : 0
                        }
                        className="animated_number"
                        duration={1000}
                        formatValue={(n) => n.toFixed(0)}
                      />
                      <strong
                        style={{
                          color: "rgb(105, 168, 226)",
                          fontSize: "14px",
                          marginLeft: "10px",
                        }}
                      >
                        +70%
                      </strong>
                      <p>Sales</p>
                    </div>
                  </div>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleChangeTab}
                        aria-label="lab API tabs example"
                      >
                        <Tab label="Potential Customers" value="1" />
                        <Tab label="Sales (2022)" value="2" />
                        <Tab label="Best Seller" value="3" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <Bar
                        options={{
                          scales: {
                            y: {
                              ticks: {
                                callback: function (value) {
                                  return "$" + value;
                                },
                              },
                            },
                          },
                          plugins: {
                            tooltip: {
                              callbacks: {
                                label: function (context) {
                                  let label = context.dataset.label || "";

                                  if (label) {
                                    label += ": ";
                                  }
                                  if (context.parsed.y !== null) {
                                    label += "$" + context.parsed.y;
                                  }
                                  return label;
                                },
                              },
                            },
                          },
                        }}
                        data={{
                          labels: userList.map((item) => {
                            return item.name;
                          }),
                          datasets: [
                            {
                              fill: true,
                              label: "Potential Customers",
                              data: userList.map((item) => {
                                return item.total_spending;
                              }),
                              backgroundColor: "#e98c81",
                              hoverBackgroundColor: "#e98c81",
                            },
                          ],
                        }}
                      />
                    </TabPanel>
                    <TabPanel value="2">
                      <Line
                        options={{
                          animations: {
                            tension: {
                              duration: 1000,
                              easing: "linear",
                              from: 1,
                              to: 0,
                              loop: true,
                            },
                          },
                          scales: {
                            y: {
                              ticks: {
                                callback: function (value) {
                                  return "$" + value;
                                },
                              },
                            },
                          },
                          plugins: {
                            tooltip: {
                              callbacks: {
                                label: function (context) {
                                  let label = context.dataset.label || "";

                                  if (label) {
                                    label += ": ";
                                  }
                                  if (context.parsed.y !== null) {
                                    label += "$" + context.parsed.y;
                                  }
                                  return label;
                                },
                              },
                            },
                          },
                        }}
                        data={{
                          labels: [
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December",
                          ],
                          datasets: [
                            {
                              label: "Sales (2022)",
                              data: user.sales,
                              borderColor: "#e98c81",
                              fill: true,
                              backgroundColor: "rgba(255, 99, 132, 0.2)",
                            },
                          ],
                        }}
                      />
                    </TabPanel>
                    <TabPanel value="3">
                      <Radar
                        options={{
                          animations: {
                            tension: {
                              duration: 1000,
                              easing: "linear",
                              from: 1,
                              to: 0,
                              loop: true,
                            },
                          },
                        }}
                        data={{
                          labels: productsList.map((item) => {
                            return item.name;
                          }),
                          datasets: [
                            {
                              fill: true,
                              label: "Best Seller",
                              data: productsList.map((item) => {
                                return item.sold;
                              }),
                              backgroundColor: "rgba(255, 99, 132, 0.2)",
                              borderColor: "#e98c81",
                              pointBackgroundColor: "#e98c81",
                              pointBorderColor: "#e98c81",
                              pointHoverBackgroundColor: "#e98c81",
                              pointHoverBorderColor: "#e98c81",
                            },
                          ],
                        }}
                      />
                    </TabPanel>
                  </TabContext>
                </>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {user.isAdmin ? (
            <>
              {option === "Users" ? (
                <div className="dash_board user_manage">
                  <h6>Users Mangement</h6>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Join on</th>
                        <th>isAdmin</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{moment(item.createdAt).format("LL")}</td>
                          <td>
                            {item.role === "ROLE_USER" ? (
                              <i
                                onClick={() => dispatch(updateUser(item))}
                                style={{
                                  fontSize: "1.2rem",
                                  margin: "auto",
                                  color: "black",
                                  background: "none",
                                }}
                                className="fa fa-times"
                                aria-hidden="true"
                              ></i>
                            ) : (
                              <i
                                onClick={() => dispatch(updateUser(item))}
                                style={{
                                  fontSize: "1.2rem",
                                  margin: "auto",
                                  color: "black",
                                  background: "none",
                                }}
                                className="fa fa-check"
                                aria-hidden="true"
                              ></i>
                            )}
                          </td>
                          <td>
                            <i
                              onClick={() => deleteUserSubmit(item.ID)}
                              style={{
                                fontSize: "1.2rem",
                                margin: "auto",
                                color: "black",
                                background: "none",
                              }}
                              className="fa fa-trash-o"
                              aria-hidden="true"
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                ""
              )}

              {option === "Products" ? (
                <div className="dash_board">
                  <h6>Products Management</h6>
                  <div
                    style={{
                      width: "100%",
                      height: "50px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "1rem",
                      marginBottom: "-1rem",
                    }}
                  >
                    <Button variant="outlined" onClick={handleClickOpen}>
                      Create
                    </Button>
                    <FormControl
                      style={{
                        width: "auto",
                        height: "100%",
                        marginTop: "0%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Select
                        value={sort}
                        style={{ height: "80%" }}
                        onChange={handleChangeSort}
                      >
                        <MenuItem
                          onClick={() =>
                            setFilter({
                              ...filter,
                              sortBy: "name",
                              sortType: "ASC",
                            })
                          }
                          value="Alphabetically, A-Z"
                        >
                          Alphabetically, A-Z
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            setFilter({
                              ...filter,
                              sortBy: "sold",
                              sortType: "DESC",
                            })
                          }
                          value="Sort by popularity"
                        >
                          Sort by popularity
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            setFilter({
                              ...filter,
                              sortBy: "createdAt",
                              sortType: "DESC",
                            })
                          }
                          value="Sort by newness"
                        >
                          Sort by newness
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            setFilter({
                              ...filter,
                              sortBy: "price",
                              sortType: "ASC",
                            })
                          }
                          value="Sort by price: low to high"
                        >
                          Sort by price: low to high
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            setFilter({
                              ...filter,
                              sortBy: "price",
                              sortType: "DESC",
                            })
                          }
                          value="Sort by price: high to low"
                        >
                          Sort by price: high to low
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            setFilter({
                              ...filter,
                              sortBy: "rate",
                              sortType: "DESC",
                            })
                          }
                          value="Product name"
                        >
                          Rating
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogTitle>
                      {edit ? "Edit this product" : "Create new product"}
                    </DialogTitle>
                    <DialogContent>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "2rem",
                        }}
                      >
                        <TextField
                          id="outlined-password-input"
                          label="Product Id"
                          type="text"
                          aria-readonly
                          disabled
                          focused={edit}
                          value={edit ? product.ID : "Auto ID"}
                          style={{ width: "46%" }}
                        />
                        <TextField
                          id="outlined-password-input"
                          label="Name"
                          type="text"
                          focused
                          value={product.name}
                          style={{ width: "46%" }}
                          onChange={handleChangeInput}
                          name="name"
                        />
                      </div>
                      <div style={{ display: "flex", marginTop: "1rem" }}>
                        <form
                          style={{ marginTop: "1.5rem" }}
                          onSubmit={formHandler}
                        >
                          <input
                            style={{ display: "none" }}
                            accept=".jpg,.png"
                            id="file"
                            type="file"
                          />
                          <label htmlFor="file">
                            <i
                              style={{
                                color: "#e98c81",
                                marginRight: "0.5rem",
                                cursor: "pointer",
                              }}
                              className="fa fa-file-image-o"
                              aria-hidden="true"
                            ></i>
                            <span style={{ fontSize: "0.8rem" }}>Chọn ảnh</span>
                          </label>
                          <button
                            style={{
                              marginLeft: "1rem",
                              background: "none",
                              color: "#e98c81",
                              border: "1px solid #e98c81",
                              cursor: "pointer",
                              borderRadius: "2px",
                              marginRight: "0.5rem",
                            }}
                            type="submit"
                          >
                            Tải lên
                          </button>
                          <span style={{ fontSize: "0.8rem" }}>
                            Uploaded {progress} %
                          </span>
                        </form>
                        <FormControl
                          style={{
                            marginLeft: "3.6rem",
                            width: "150px",
                            marginTop: "0.5rem",
                          }}
                          variant="standard"
                        >
                          <InputLabel htmlFor="standard-adornment-amount">
                            Price
                          </InputLabel>
                          <Input
                            id="standard-adornment-amount"
                            value={product.price}
                            name="price"
                            onChange={handleChangeInput}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </div>
                      <FormControl
                        style={{ marginTop: "1rem" }}
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Category
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={product.category}
                          name="category"
                          onChange={handleChangeInput}
                          label="Category"
                        >
                          {categories.map((item, index) => (
                            <MenuItem key={index} value={`${item.name}`}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <div style={{ width: "100%", marginTop: "1.5rem" }}>
                        <TextField
                          id="outlined-multiline-static"
                          label="Description"
                          multiline
                          rows={4}
                          focused={edit}
                          style={{ width: "100%" }}
                          name="description"
                          placeholder="Description"
                          value={product.description}
                          onChange={handleChangeInput}
                        />
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button onClick={handleSubmit}>Save</Button>
                    </DialogActions>
                  </Dialog>
                  <Dialog
                    open={openSaleDialog}
                    onClose={() => setOpenSaleDialog(false)}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                  >
                    <DialogTitle
                      style={{ cursor: "move" }}
                      id="draggable-dialog-title"
                    >
                      Create sale for this product
                    </DialogTitle>
                    <DialogContent>
                      <FormControl
                        style={{ width: "100%", paddingBottom: "1.5rem" }}
                        variant="standard"
                      >
                        <InputLabel htmlFor="standard-adornment-amount">
                          Price
                        </InputLabel>
                        <Input
                          id="standard-adornment-amount"
                          value={productSale.priceSale}
                          name="price"
                          onChange={(e) =>
                            setProductSale({
                              ...productSale,
                              priceSale: Number(e.target.value),
                            })
                          }
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                        />
                      </FormControl>
                      <div style={{ display: "flex" }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DesktopDatePicker
                            label="Start sale"
                            inputFormat="yyyy-mm-dd hh:mm:ss"
                            value={productSale.startSale}
                            onChange={(value) =>
                              setProductSale({
                                ...productSale,
                                startSale: value,
                              })
                            }
                            renderInput={(params) => <TextField {...params} />}
                          />
                          <div
                            style={{ width: "1.5rem" }}
                            className="distance"
                          ></div>
                          <DesktopDatePicker
                            label="End sale"
                            inputFormat="yyyy-mm-dd hh:mm:ss"
                            value={productSale.endSale}
                            onChange={(value) => {
                              setProductSale({
                                ...productSale,
                                endSale: value,
                              });
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        autoFocus
                        onClick={() => setOpenSaleDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={createSale}>Save</Button>
                    </DialogActions>
                  </Dialog>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Product_Id</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Edit</th>
                        <th>Remove</th>
                        <th>Sale</th>
                        <th>Review</th>
                        <th>Gallery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsList.map((item) => (
                        <tr key={item._id}>
                          <td>{item.ID}</td>
                          <td>
                            <img
                              style={{ width: "50px", marginTop: "5px" }}
                              alt=""
                              src={item.image}
                            />
                          </td>
                          <td>{item.name}</td>
                          <td>{item.category}</td>
                          <td>${item.price}</td>
                          <td>
                            <i
                              onClick={() => editProduct(item.ID)}
                              style={{
                                fontSize: "1.2rem",
                                margin: "auto",
                                color: "black",
                                background: "none",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                              }}
                              className="fa fa-pencil"
                              aria-hidden="true"
                            ></i>
                          </td>
                          <td>
                            <i
                              onClick={() => deleteProduct(item.ID)}
                              style={{
                                fontSize: "1.2rem",
                                margin: "auto",
                                color: "black",
                                background: "none",
                              }}
                              className="fa fa-trash-o"
                              aria-hidden="true"
                            ></i>
                          </td>
                          <td>
                            <i
                              onClick={() => {
                                setOpenSaleDialog(true);
                                setProductSale({
                                  ...productSale,
                                  id: item.ID,
                                });
                              }}
                              style={{
                                fontSize: "1.2rem",
                                margin: "auto",
                                color: "black",
                                background: "none",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                              }}
                              className="fa fa-angle-double-down"
                              aria-hidden="true"
                            ></i>
                          </td>
                          <td>
                            <i
                              onClick={() => {
                                setTimeout(() => {
                                  setOpenReviewProduct(true);
                                }, [1000]);
                                setProductId(item.ID);
                              }}
                              style={{
                                fontSize: "1.2rem",
                                margin: "auto",
                                color: "black",
                                background: "none",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                              }}
                              className="fa fa-comments-o"
                              aria-hidden="true"
                            ></i>
                          </td>
                          <td>
                            <i
                              onClick={() => {
                                setTimeout(() => {
                                  setOpenGallery(true);
                                }, [1000]);
                                dispatch(fetchFruitDetail(item?.ID));
                              }}
                              style={{
                                fontSize: "1.2rem",
                                margin: "auto",
                                color: "black",
                                background: "none",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                              }}
                              className="fa fa-picture-o"
                              aria-hidden="true"
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div
                    style={{
                      height: "50px",
                      marginTop: "2rem",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack spacing={2}>
                      <Pagination
                        count={numOfPage}
                        variant="outlined"
                        shape="rounded"
                        color="primary"
                        page={filter.page}
                        onChange={handleChangePage}
                      />
                    </Stack>
                    <p>
                      Showing {(filter.page - 1) * 5 + 1} -{" "}
                      {filter.page === numOfPage ? all : filter.page * 5} of{" "}
                      {all} results
                    </p>
                  </div>
                  <ProductReview
                    openReviewProduct={openReviewProduct}
                    setOpenReviewProduct={setOpenReviewProduct}
                    transition={Transition}
                    productId={productId}
                  />
                  <GalleryModal
                    openGallery={openGallery}
                    setOpenGallery={setOpenGallery}
                    transition={Transition}
                  />
                </div>
              ) : (
                ""
              )}

              {option === "Categories" ? (
                <div className="dash_board">
                  <h6>Categories Management</h6>
                  <div
                    style={{
                      width: "100%",
                      height: "50px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "1rem",
                      marginBottom: "-1rem",
                    }}
                  >
                    <Button variant="outlined" onClick={handleClickOpenCategory}>
                      Create
                    </Button>
                  </div>
                  <Dialog
                    open={openCategory}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleCloseCategory}
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogTitle>
                      {edit ? "Edit this category" : "Create new category"}
                    </DialogTitle>
                    <DialogContent>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "2rem",
                        }}
                      >
                        <TextField
                          id="outlined-password-input"
                          label="Category Id"
                          type="text"
                          aria-readonly
                          disabled
                          focused={edit}
                          value={edit ? category.ID : "Auto ID"}
                          style={{ width: "46%" }}
                        />
                        <TextField
                          id="outlined-password-input"
                          label="Name"
                          type="text"
                          focused
                          value={category.name}
                          style={{ width: "46%" }}
                          onChange={handleChangeInputCategory}
                          name="name"
                        />
                      </div>
                      <div style={{ width: "100%", marginTop: "1.5rem" }}>
                        <TextField
                          id="outlined-multiline-static"
                          label="Description"
                          multiline
                          rows={4}
                          focused={edit}
                          style={{ width: "100%" }}
                          name="description"
                          placeholder="Description"
                          value={category.description}
                          onChange={handleChangeInputCategory}
                        />
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseCategory}>Cancel</Button>
                      <Button onClick={handleSubmitCategory}>Save</Button>
                    </DialogActions>
                  </Dialog>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Category_Id</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Edit</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((item) => (
                        <tr key={item.ID}>
                          <td>{item.ID}</td>
                          <td>{item.name}</td>
                          <td>{item.description}</td>
                          <td>
                            <i
                              onClick={() => editCategory(item.ID)}
                              style={{
                                fontSize: "1.2rem",
                                margin: "auto",
                                color: "black",
                                background: "none",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                              }}
                              className="fa fa-pencil"
                              aria-hidden="true"
                            ></i>
                          </td>
                          <td>
                            <i
                              onClick={() => deleteCategory(item.ID)}
                              style={{
                                fontSize: "1.2rem",
                                margin: "auto",
                                color: "black",
                                background: "none",
                              }}
                              className="fa fa-trash-o"
                              aria-hidden="true"
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                ""
              )}

              {option === "Blogs" ? (
                <div className="dash_board">
                  <h6>Blogs Management</h6>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
          {option === "OrdersManage" ? (
            <OrderManagement option={"OrdersManage"} />
          ) : (
            ""
          )}
          {option === "Orders" ? (
            <div className="dash_board">
              <h6>Orders</h6>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChangeTab}
                    aria-label="lab API tabs example"
                  >
                    {order.orderStatus.map((item, index) => (
                      <Tab
                        onClick={() =>
                          setOrderFilter({ ...orderFilter, status: item })
                        }
                        label={`${item}`}
                        value={`${index + 1}`}
                      />
                    ))}
                  </TabList>
                </Box>
                {renderTabContent(value)}
              </TabContext>
              <OrderDetail
                order={order.order}
                steps={order.orderStatus}
                openOrder={openOrder}
                setOpenOrder={setOpenOrder}
                transition={Transition}
                option={"Orders"}
              />
              <ReviewModal
                order={order.order}
                openReview={openReview}
                setOpenReview={setOpenReview}
                transition={Transition}
              />
            </div>
          ) : (
            ""
          )}
          {option === "Address" ? (
            <div className="dash_board">
              <h6>Address</h6>
              <p>
                <strong style={{ color: "#e98c81" }}>Sin Ha</strong>
              </p>
              <p>Hà Nội, Việt Nam</p>
              <p>Ngách 18/35, phường Mộ Lao, quận Hà Đông</p>
              <i className="fa fa-pencil-square-o" aria-hidden="true">
                <p>Edit Address</p>
              </i>
            </div>
          ) : (
            ""
          )}
          {option === "Account" ? (
            <div className="dash_board">
              <h6>Account Details</h6>
              <div className="avatar_edit">
                <img alt="" src={user.user.avatar} />
                <input
                  hidden="hidden"
                  onChange={handlerImage}
                  accept=".jpg,.png"
                  id="file"
                  type="file"
                />
                <Tooltip title="Change Avatar" placement="right">
                  <i
                    onClick={handlerChange}
                    className="fa fa-camera"
                    aria-hidden="true"
                  ></i>
                </Tooltip>
              </div>
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "400",
                  marginBottom: "-20px",
                }}
              >
                Profile change
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "2rem",
                }}
              >
                <TextField
                  id="outlined-password-input"
                  label="First Name"
                  name="firstName"
                  onChange={handlerChangeInput}
                  defaultValue={profile.firstName}
                  type="text"
                  style={{ width: "46%" }}
                />
                <TextField
                  id="outlined-password-input"
                  label="Last Name"
                  name="lastName"
                  onChange={handlerChangeInput}
                  defaultValue={profile.lastName}
                  type="text"
                  style={{ width: "46%" }}
                />
              </div>
              <TextField
                id="outlined-password-input"
                label="Username"
                name="name"
                // onChange={handlerChangeInput}
                aria-readonly
                value={profile.firstName + profile.lastName}
                type="text"
                style={{ width: "100%", marginTop: "2rem" }}
              />
              <TextField
                id="outlined-password-input"
                label="Email Address"
                name="email"
                aria-readonly
                // onChange={handlerChangeInput}
                value={user.user.email}
                type="email"
                style={{ width: "100%", marginTop: "2rem" }}
              />
              <h4 onClick={updateProfileSubmit}>SAVE CHANGES</h4>
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "400",
                  marginBottom: "0",
                }}
              >
                Password change
              </p>
              <div style={{ position: "relative", display: "flex" }}>
                <TextField
                  id="outlined-password-input"
                  label="Current Password"
                  type={`${showPass ? "text" : "password"}`}
                  name="oldPassword"
                  onChange={handlerChangePassword}
                  style={{ width: "100%", marginTop: "1rem" }}
                />
                <i
                  style={{
                    position: "absolute",
                    right: "20px",
                    background: "transparent",
                    color: "#111",
                    padding: "0",
                    top: "50%",
                    width: "auto",
                  }}
                  onClick={() => setShowPass(!showPass)}
                  class={`fa ${showPass ? "fa-eye" : "fa-eye-slash"}`}
                  aria-hidden="true"
                ></i>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "2rem",
                }}
              >
                <TextField
                  id="outlined-password-input"
                  label="New Password"
                  type="text"
                  name="newPassword"
                  onChange={handlerChangePassword}
                  style={{ width: "46%" }}
                />
                <TextField
                  id="outlined-password-input"
                  label="Confirm Password"
                  type="text"
                  name="confirmPassword"
                  onChange={handlerChangePassword}
                  style={{ width: "46%" }}
                />
              </div>
              <h4 onClick={changePasswordSubmit}>SAVE CHANGES</h4>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default MyAccount;
