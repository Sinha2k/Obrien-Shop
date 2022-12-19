import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { TextareaAutosize } from "@mui/material";
import RatingBar from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import { addReview } from "../../redux_toolkit/reducer/reviewSliceReducer";

const StyledRating = styled(RatingBar)({
  "& .MuiRating-iconFilled": {
    color: "#e98c81",
  },
  "& .MuiRating-iconHover": {
    color: "#e98c81",
  },
});

const ReviewModal = ({ openReview, setOpenReview, transition, order }) => {
  const [productListReview, setProductListReview] = useState([]);

  const dispatch = useDispatch();

  const onChangeRate = (value, index) => {
    const newItem = productListReview[index];
    const newArray = productListReview?.map((item, i) =>
      i === index
        ? {
            productID: newItem.productID,
            comment: newItem.comment, 
            rate: value,
          }
        : productListReview[i]
    );
    setProductListReview(newArray);
  };

  const onChangeComment = (value, index) => {
    const newItem = productListReview[index];
    const newArray = productListReview?.map((item, i) =>
      i === index
        ? {
            productID: newItem.productID,
            comment: value,
            rate: newItem.rate,
          }
        : productListReview[i]
    );
    setProductListReview(newArray);
  };

  const reviewProduct = () => {
    setOpenReview(false);
    dispatch(addReview({ id: order.ID, review: productListReview }));
  };

  useEffect(() => {
    const array = [];
    if (order?.product?.length > 0) {
      order?.product.forEach((item) => {
        const newReview = {
          productID: item.ID,
          comment: "",
          rate: 5,
        };
        array.push(newReview);
      });
      setProductListReview(array);
    }
  }, [order?.product]);

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth="md"
        open={openReview}
        TransitionComponent={transition}
        keepMounted
        onClose={() => setOpenReview(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ position: "relative" }}>
          {"Review Product"}{" "}
        </DialogTitle>
        <DialogContent>
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
                  <th>Rate</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {order?.product?.length > 0 &&
                  order.product?.map((item, index) => (
                    <tr key={item.ID}>
                      <td>
                        <img
                          style={{ width: "80px" }}
                          src={item.image}
                          alt=""
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>
                        <StyledRating
                          name="customized-color"
                          value={
                            productListReview.length > 0
                              ? productListReview[index]?.rate
                              : 5
                          }
                          precision={1}
                          onChange={(event, newValue) =>
                            onChangeRate(newValue, index)
                          }
                          icon={
                            <i className="fa fa-star" aria-hidden="true"></i>
                          }
                          emptyIcon={
                            <i
                              style={{ color: "#e98c81" }}
                              className="fa fa-star-o"
                              aria-hidden="true"
                            ></i>
                          }
                        />
                      </td>
                      <td>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={3}
                          value={productListReview[index]?.comment}
                          onChange={(e) =>
                            onChangeComment(e.target.value, index)
                          }
                          placeholder="Your review"
                          style={{
                            width: 200,
                            padding: "10px",
                            marginTop: "7px",
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpenReview(false)}>
            Cancel
          </Button>
          <Button onClick={reviewProduct}> Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReviewModal;
