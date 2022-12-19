import React, { useState } from "react";
import Rating from "./Rating";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ProductItem = ({ fruit, list, recent }) => {
  const [loadedImage, setLoadedImage] = useState(false);
  const loadedEvent = () => {
    setLoadedImage(true);
  };

  return (
    <>
      {recent ? (
        <a href={`/product/detail/${fruit.ID}`}>
          <div className="recent_product">
            {fruit.statusSale === "1" ? (
              <p className="sale_branch">
                -{" "}
                {Math.round(
                  ((fruit.price - fruit.priceSale) / fruit.price) * 100
                )}
                %
              </p>
            ) : (
              ""
            )}
            <img alt="" onLoad={loadedEvent} src={fruit.image} />
            {!loadedImage && (
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            )}
            <div className="card_content">
              <h5>{fruit.name}</h5>
              <p className="price">${fruit.price}</p>
              <Rating value={fruit.rate} />
            </div>
          </div>
        </a>
      ) : (
        <a href={`/product/detail/${fruit.ID}`}>
          <div className={`product_card ${list ? "card_list" : ""}`}>
            {fruit.statusSale === "1" ? (
              <p className="sale_branch">
                Discount{" "}
                {Math.round(
                  ((fruit.price - fruit.priceSale) / fruit.price) * 100
                )}
                %
              </p>
            ) : (
              ""
            )}
            <img alt="" onLoad={loadedEvent} src={fruit.image} />
            {!loadedImage && (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "250px",
                  position: "absolute",
                  zIndex: "100",
                  top: "0",
                  left: "0"
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <div className="card_content">
              <Rating value={fruit.rate} />
              <h5>{fruit.name}</h5>
              <p className="price">${fruit.price}</p>
              <div className="icons">
                <i
                  title="Add to cart"
                  className="fa fa-shopping-bag"
                  aria-hidden="true"
                ></i>
                <i
                  title="Add to wishlist"
                  className="fa fa-heart-o"
                  aria-hidden="true"
                ></i>
                <i
                  title="Quick view"
                  className="fa fa-eye"
                  aria-hidden="true"
                ></i>
              </div>
              {list ? (
                <div className="description">
                  <p>{fruit.description}</p>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </a>
      )}
    </>
  );
};

export default ProductItem;
