import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Rating from "../utils/ProductItem/Rating";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import ProductItem from "../utils/ProductItem/productItem";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux_toolkit/reducer/cartSliceReducer";
import {
  loadingSelector,
  loadingUserSelector,
  productsSelector,
  userSelector,
} from "../../redux_toolkit/selector/selector";
import {
  fetchFruitDetail,
  fetchFruits,
} from "../../redux_toolkit/reducer/productSliceReducer";
import Loading from "../utils/Loading/Loading";
import ReactImageMagnify from "react-image-magnify";
import ReviewItem from "./ReviewItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { addWishList } from "../../redux_toolkit/reducer/wishlistSliceReducer";
import { getProductReviews } from "../../redux_toolkit/reducer/reviewSliceReducer";
import { Pagination, Stack } from "@mui/material";

function createData(country, s, m, l, xl, xxl) {
  return { country, s, m, l, xl, xxl };
}

const rows = [
  createData("UK", 18, 20, 22, 24, 26),
  createData("European", 46, 48, 50, 52, 54),
  createData("USA", 14, 16, 20, 22, 24),
  createData("Australia", 8, 10, 12, 14, 16),
  createData("Canada", 20, 22, 24, 26, 28),
];
const ProductDetail = () => {
  const params = useParams();
  const [detailProduct, setDetailProduct] = useState([]);
  const [option, setOption] = useState("description");
  const [urlShow, setUrlShow] = useState("");
  const [filter, setFilter] = useState({
    rate: "",
    page: 1,
    perPage: 10,
  });
  const fruitsList = useSelector(productsSelector);
  const fruitDetail = useSelector((state) => state.products.fruitDetail);
  const loading = useSelector(loadingSelector);
  const loadingUser = useSelector(loadingUserSelector);
  const loadingCart = useSelector((state) => state.cart.status);
  const loadingWishList = useSelector((state) => state.wishList.status);
  const loadingReview = useSelector((state) => state.review.status);
  const user = useSelector(userSelector);
  const productReviews = useSelector((state) => state.review.productReviews);
  const countReviews = useSelector((state) => state.review.countReviews);
  const numOfPage = useSelector((state) => state.review.numOfPage);
  const dispatch = useDispatch();
  const [timerDays, setTimerDays] = useState("00");
  const [timerHours, setTimerHours] = useState("00");
  const [timerMins, setTimerMins] = useState("00");
  const [timerSecs, setTimerSecs] = useState("00");
  let interval = useRef();
  const startTimer = () => {
    const endSale = detailProduct.endSale;
    const countdownDate = new Date(endSale).getTime();
    interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(interval.current);
      } else {
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMins(mins);
        setTimerSecs(secs);
      }
    }, 1000);
  };
  useEffect(() => {
    if (detailProduct.statusSale === "1") {
      startTimer();
      return () => {
        clearInterval(interval.current);
      };
    }
  });

  const decrease = () => {
    var amount = detailProduct.quantity;
    if (amount > 0) {
      amount -= 1;
    }
    setDetailProduct({ ...detailProduct, quantity: amount });
  };
  const increase = () => {
    var amount = detailProduct.quantity;
    setDetailProduct({ ...detailProduct, quantity: amount + 1 });
  };
  const addToCart = (product) => {
    if (user.isLogin) {
      dispatch(addProduct(product));
    } else {
      toast.warning("You must login to add cart");
    }
  };
  useEffect(() => {
    dispatch(
      fetchFruits({
        sortBy: "statusSale",
        perPage: 4,
        page: 1,
        category: "",
        sale: "",
        sortType: "DESC",
        name: "",
      })
    );
  }, [dispatch]);

  const addWishListSubmit = (product) => {
    if (user.isLogin) {
      dispatch(addWishList(product.ID));
    } else {
      toast.warning("You must login to add wish list");
    }
  };

  const handleChangePage = (event, value) => {
    setFilter({ ...filter, page: value });
  };

  useEffect(() => {
    if (params) {
      dispatch(fetchFruitDetail(params.id));
    }
  }, [dispatch, params, loadingWishList]);

  useEffect(() => {
    if (fruitDetail) {
      setDetailProduct({
        ...fruitDetail,
        quantity: 1,
      });
    }
  }, [fruitDetail]);

  useEffect(() => {
    if (detailProduct && option === "reviews") {
      dispatch(
        getProductReviews({
          id: detailProduct.ID,
          params: filter,
        })
      );
    }
  }, [filter, dispatch]);

  let all = 0;
  if (countReviews?.length > 0) {
    all = countReviews?.reduce((prev, co) => {
      return prev + co.count;
    }, 0);
  }

  return (
    <>
      {[loading, loadingUser].includes("loading") ? (
        <Loading />
      ) : (
        <>
          {[loadingCart, loadingWishList, loadingReview].includes(
            "loading"
          ) && <Loading />}
          <div className={`product_card card_list detail_product`}>
            <div style={{ width: "40%" }}>
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: "",
                    width: 460,
                    height: 460,
                    src: urlShow ? urlShow : detailProduct?.image,
                  },
                  largeImage: {
                    src: urlShow ? urlShow : detailProduct?.image,
                    width: 900,
                    height: 900,
                  },
                }}
              />
              <div className="gallery-display">
                <img
                  style={
                    urlShow === detailProduct?.image
                      ? { border: "1px solid rgb(153, 153, 153)" }
                      : {}
                  }
                  onClick={() => setUrlShow(detailProduct?.image)}
                  alt=""
                  src={detailProduct?.image}
                />
                {detailProduct?.gallery?.length > 0 &&
                  detailProduct?.gallery?.map((item) => (
                    <img
                      style={
                        urlShow === item?.URLImage
                          ? { border: "1px solid rgb(153, 153, 153)" }
                          : {}
                      }
                      onClick={() => setUrlShow(item?.URLImage)}
                      key={item.ID}
                      alt=""
                      src={item?.URLImage}
                    />
                  ))}
              </div>
            </div>
            <div className="card_content">
              <h5>{detailProduct?.name}</h5>
              {detailProduct?.statusSale !== "0" ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p className="price">${detailProduct.priceSale}</p>
                  <p
                    style={{
                      textDecoration: "line-through",
                      fontSize: "0.85rem",
                      color: "gray",
                      marginLeft: "1rem",
                    }}
                    className="price"
                  >
                    ${detailProduct.price}
                  </p>
                </div>
              ) : (
                <p className="price">${detailProduct.price}</p>
              )}
              <Rating value={detailProduct.rate} />
              {detailProduct.description && (
                <div className="description">
                  <p>{detailProduct.description}</p>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  marginBottom: "15px",
                  marginTop: "15px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h6
                    style={{
                      padding: "0",
                      margin: "0",
                      fontSize: "1rem",
                      marginRight: "10px",
                    }}
                  >
                    Sold :
                  </h6>
                  <p style={{ padding: "0", margin: "0", fontSize: "1.1rem" }}>
                    {detailProduct.sold}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "20px",
                  }}
                >
                  <h6
                    style={{
                      padding: "0",
                      margin: "0",
                      fontSize: "1rem",
                      marginRight: "10px",
                    }}
                  >
                    {" "}
                    Stock :
                  </h6>
                  <p style={{ padding: "0", margin: "0", fontSize: "1.1rem" }}>
                    {detailProduct.stock}
                  </p>
                </div>
              </div>
              {detailProduct.statusSale !== "0" ? (
                <div style={{ marginTop: "10px" }} className="countdown">
                  <p>
                    {timerDays} <br />
                    Days
                  </p>
                  <p>
                    {timerHours} <br />
                    Hours
                  </p>
                  <p>
                    {timerMins} <br />
                    Mins
                  </p>
                  <p>
                    {timerSecs} <br />
                    Secs
                  </p>
                </div>
              ) : (
                ""
              )}
              <div className="function">
                <div className="control">
                  <h6 onClick={decrease}>-</h6>
                  <h6>{detailProduct.quantity}</h6>
                  <h6 onClick={increase}>+</h6>
                </div>
                <h4 onClick={() => addToCart(detailProduct)}>ADD TO CART</h4>
                {detailProduct.wishList !== 0 ? (
                  <p
                    className="active"
                    onClick={() =>
                      alert("This product has been added to wish list")
                    }
                    style={{
                      fontSize: "1rem",
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    Added To Wishlist
                  </p>
                ) : (
                  <p
                    onClick={() => addWishListSubmit(detailProduct)}
                    style={{
                      fontSize: "1rem",
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    Add To Wishlist
                  </p>
                )}
              </div>
              <button className="buy">Buy it now</button>
            </div>
          </div>
        </>
      )}

      <div className="more_info">
        <div className={`option_bar`}>
          <h4
            onClick={() => setOption("description")}
            className={`${option === "description" ? "active" : ""}`}
          >
            DESCRIPTION
          </h4>
          <h4
            onClick={() => {
              setOption("reviews");
              if (detailProduct) {
                dispatch(
                  getProductReviews({
                    id: detailProduct.ID,
                    params: filter,
                  })
                );
              }
            }}
            className={`${option === "reviews" ? "active" : ""}`}
          >
            REVIEWS
          </h4>
          <h4
            onClick={() => setOption("shipping")}
            className={`${option === "shipping" ? "active" : ""}`}
          >
            SHIPPING POLICY
          </h4>
          <h4
            onClick={() => setOption("size")}
            className={`${option === "size" ? "active" : ""}`}
          >
            SIZE CHART
          </h4>
        </div>
        <div className="info_display">
          {option === "description" ? (
            <p>
              On the other hand, we denounce with righteous indignation and
              dislike men who are so beguiled and demoralized by the charms of
              pleasure of the moment, so blinded by desire, that they cannot
              foresee the pain and trouble that are bound to ensue; and equal
              blame belongs to those who fail in their duty through weakness of
              will, which is the same as saying through shrinking from toil and
              pain. These cases are perfectly simple and easy to distinguish. In
              a free hour, when our power of choice is untrammelled and when
              nothing prevents our being able to do what we like best, every
              pleasure is to be welcomed and every pain avoided. But in certain
              circumstances and owing to the claims of duty or the obligations
              of business it will frequently occur that pleasures have to be
              repudiated and annoyances accepted. The wise man therefore always
              holds in these matters to this principle of selection: he rejects
              pleasures to secure other greater pleasures, or else he endures
              pains to avoid worse pains.
              <br />
              <br />
              Et harum quidem rerum facilis est et expedita distinctio. Nam
              libero tempore, cum soluta nobis est eligendi optio cumque nihil
              impedit quo minus id quod maxime placeat facere possimus, omnis
              voluptas assumenda est, omnis dolor repellendus. Temporibus autem
              quibusdam et aut officiis debitis aut rerum necessitatibus saepe
              eveniet ut et voluptates repudiandae sint et molestiae non
              recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut
              aut reiciendis voluptatibus maiores alias consequatur aut
              perferendis doloribus asperiores repellat.
            </p>
          ) : (
            ""
          )}
          {option === "reviews" ? (
            <div className="reviews">
              <div className="review-filter">
                {countReviews?.map((item) => (
                  <div className="filter-item">
                    <button
                      className={`${
                        item.rate === Number(filter.rate) ? "filter-active" : ""
                      }`}
                      onClick={() =>
                        setFilter({ ...filter, rate: `${item.rate}` })
                      }
                    >
                      <span>
                        {item.rate}
                        <i className="fa fa-star"></i>
                      </span>
                    </button>
                    <div className="progress-container">
                      <div
                        style={{
                          width: `${(item.count / all) * 100}%`,
                          background: "#e98c81",
                          height: "34px",
                        }}
                        className="progress-bar"
                      ></div>
                    </div>
                    <span style={{ marginLeft: "15px", fontWeight: "700" }}>
                      {item.count} reviews
                    </span>
                  </div>
                ))}
              </div>
              {productReviews?.filter((rv) => rv.IsPublic === "1")?.length ===
              0 ? (
                <p
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  <em>No reviews</em>
                </p>
              ) : (
                <>
                  {productReviews
                    ?.filter((rv) => rv.IsPublic === "1")
                    .map((item) => (
                      <ReviewItem key={item.ID} review={item} />
                    ))}
                  {/* pagination */}
                  <div
                    style={{
                      height: "50px",
                      marginTop: "2rem",
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack style={{ marginLeft: "1rem" }} spacing={2}>
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
                </>
              )}
            </div>
          ) : (
            ""
          )}
          {option === "shipping" ? (
            <div className="shipping">
              <h5>Shipping policy for our store</h5>
              <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
                nostrud exerci tation ullamcorper suscipit lobortis nisl ut
                aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor
                in hendrerit in vulputate
              </p>
              <ul>
                <li>1-2 business days (Typically by end of day)</li>
                <li>30 days money back guaranty</li>
                <li>24/7 live support</li>
                <li>odio dignissim qui blandit praesent</li>
              </ul>
              <p>
                claritatem. Investigationes demonstraverunt lectores legere me
                lius quod ii legunt saepius. Claritas est etiam processus
                dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum
                est notare quam littera gothica, quam nunc putamus parum claram,
                anteposuerit litterarum formas humanitatis per
              </p>
            </div>
          ) : (
            ""
          )}
          {option === "size" ? (
            <div style={{ width: "100%" }} className="shipping">
              <h5
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                Size Chart
              </h5>
              <Table
                sx={{ marginLeft: "1rem", width: "96%" }}
                size="small"
                aria-label="a dense table"
              >
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.country}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.country}
                      </TableCell>
                      <TableCell align="right">{row.s}</TableCell>
                      <TableCell align="right">{row.m}</TableCell>
                      <TableCell align="right">{row.l}</TableCell>
                      <TableCell align="right">{row.xl}</TableCell>
                      <TableCell align="right">{row.xxl}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="best_sale">
        <h4>RELATED PRODUCT</h4>
        <p>You can check the related product for your shopping collection.</p>
        <div className="fruits_sale">
          {fruitsList.slice(0, 4).map((item) => {
            return <ProductItem key={item._id} fruit={item} />;
          })}
        </div>
      </div>
      <div className="best_sale">
        <h4>YOU MAY ALSO LIKE</h4>
        <p>
          Most of the customers choose our products. You may also like our
          product.
        </p>
        <div className="fruits_sale">
          {fruitsList.slice(0, 4).map((item) => {
            return <ProductItem key={item._id} fruit={item} />;
          })}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProductDetail;
