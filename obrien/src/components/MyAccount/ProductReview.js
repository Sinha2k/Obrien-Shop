import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminProductReviews,
  setPublic,
} from "../../redux_toolkit/reducer/reviewSliceReducer";
import Rating from "../utils/ProductItem/Rating";
import {
  FormControl,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";

const ProductReview = ({
  openReviewProduct,
  setOpenReviewProduct,
  transition,
  productId,
}) => {
  const productReviewList = useSelector((state) => state.review.productReviews);
  const countReviews = useSelector((state) => state.review.countReviews);
  const numOfPage = useSelector((state) => state.review.numOfPage);

  const [filterReview, setFilterReview] = useState({
    rate: "",
    page: 1,
    perPage: 10,
  });

  const [sortReview, setSortReview] = useState("All");

  const dispatch = useDispatch();

  useEffect(() => {
    if (productId > 0) {
      dispatch(
        getAdminProductReviews({
          id: productId,
          params: filterReview,
        })
      );
    }
  }, [dispatch, filterReview, productId]);

  let all = 0;
  if (countReviews?.length > 0) {
    all = countReviews?.reduce((prev, co) => {
      return prev + co.count;
    }, 0);
  }

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="md"
        open={openReviewProduct}
        TransitionComponent={transition}
        keepMounted
        onClose={() => setOpenReviewProduct(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ position: "relative" }}>
          {"Product Reviews"}{" "}
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              position: "relative",
              width: "100%",
              marginBottom: "4rem",
            }}
          >
            <FormControl
              style={{
                position: "absolute",
                right: "0",
                width: "145px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Select
                value={sortReview}
                style={{ height: "80%" }}
                onChange={(e) => setSortReview(e.target.value)}
              >
                <MenuItem
                  onClick={() => setFilterReview({ ...filterReview, rate: "" })}
                  value="All"
                >
                  All
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setFilterReview({ ...filterReview, rate: "1" })
                  }
                  value="Rating 1 star"
                >
                  Rating 1 star
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setFilterReview({ ...filterReview, rate: "2" })
                  }
                  value="Rating 2 star"
                >
                  Rating 2 star
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setFilterReview({ ...filterReview, rate: "3" })
                  }
                  value="Rating 3 star"
                >
                  Rating 3 star
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setFilterReview({ ...filterReview, rate: "4" })
                  }
                  value="Rating 4 star"
                >
                  Rating 4 star
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setFilterReview({ ...filterReview, rate: "5" })
                  }
                  value="Rating 5 star"
                >
                  Rating 5 star
                </MenuItem>
              </Select>
            </FormControl>
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
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Rate</th>
                  <th>Review</th>
                  <th>Public</th>
                </tr>
              </thead>
              <tbody>
                {productReviewList?.length > 0 ? (
                  productReviewList?.map((item, index) => (
                    <tr key={item.ID}>
                      <td>
                        <img
                          style={{ width: "80px" }}
                          src={item?.avatar}
                          alt=""
                        />
                      </td>
                      <td>{item?.name}</td>
                      <td>
                        <Rating value={item?.rate} />
                      </td>
                      <td>{item?.comment}</td>
                      <td>
                        {item?.IsPublic === 0 ? (
                          <i
                            onClick={() => {
                              dispatch(setPublic(item?.ID));
                              setTimeout(() => {
                                setFilterReview({
                                  ...filterReview,
                                  rate: "",
                                });
                                setSortReview("All");
                              }, [2000]);
                            }}
                            style={{
                              fontSize: "1.2rem",
                              margin: "auto",
                              color: "black",
                              background: "none",
                              cursor: "pointer",
                            }}
                            className="fa fa-times"
                            aria-hidden="true"
                          ></i>
                        ) : (
                          <i
                            onClick={() => {
                              dispatch(setPublic(item?.ID));
                              setTimeout(() => {
                                setFilterReview({
                                  ...filterReview,
                                  rate: "",
                                });
                                setSortReview("All");
                              }, [2000]);
                            }}
                            style={{
                              fontSize: "1.2rem",
                              margin: "auto",
                              color: "black",
                              background: "none",
                              cursor: "pointer",
                            }}
                            className="fa fa-check"
                            aria-hidden="true"
                          ></i>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ borderRightColor: "#fff" }}></td>
                    <td style={{ borderRightColor: "#fff" }}></td>
                    <td
                      style={{ borderRightColor: "#fff", padding: "20px 0px" }}
                    >
                      No reviews
                    </td>
                    <td style={{ borderRightColor: "#fff" }}></td>
                    <td style={{ borderLeftColor: "#fff" }}></td>
                  </tr>
                )}
              </tbody>
            </table>
            {productReviewList?.length > 0 && (
              <div
                style={{
                  height: "50px",
                  marginTop: "2rem",
                  display: "flex",
                  alignItems: "center",
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
                    page={filterReview.page}
                    onChange={(event, value) =>
                      setFilterReview({ ...filterReview, page: value })
                    }
                  />
                </Stack>
                <p>
                  Showing {(filterReview.page - 1) * 4 + 1} -{" "}
                  {filterReview.page === numOfPage
                    ? all
                    : filterReview.page * 4}{" "}
                  of {all} results
                </p>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductReview;
