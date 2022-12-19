import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ProductItem from "../utils/ProductItem/productItem";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  loadingSelector,
  productsCurrentList,
} from "../../redux_toolkit/selector/selector";
import { fetchFruits } from "../../redux_toolkit/reducer/productSliceReducer";
import Loading from "../utils/Loading/Loading";
import { getCategories } from "../../redux_toolkit/reducer/categorySliceReducer";
const Shop = () => {
  const [sort, setSort] = useState("Alphabetically, A-Z");
  const [display, setDisplay] = useState("grid");
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const all = useSelector((state) => state.products.fruitsCount);
  const numOfPage = useSelector((state) => state.products.numOfPage);
  const categories = useSelector((state) => state.category.categories);
  const fruitList = useSelector(productsCurrentList);
  const [filter, setFilter] = useState({
    category: "",
    sortBy: "name",
    name: "",
    sale: "",
    sortType: "ASC",
    page: 1,
    perPage: 6,
  });
  const loading = useSelector(loadingSelector);
  const dispatch = useDispatch();
  const handleChange = (event) => {
    setSort(event.target.value);
  };
  const handleChangePage = (event, value) => {
    setPage(value);
    setFilter({ ...filter, page: value });
  };

  useEffect(() => {
    dispatch(fetchFruits(filter));
  }, [dispatch, filter]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <>
      {loading === "loading" ? <Loading /> : ""}
      <div className="shop_page">
        <div className="left_sidebar">
          <h5>Search</h5>
          <div className="line"></div>
          <div className="search_field">
            <OutlinedInput
              style={{ width: "100%" }}
              placeholder="Search Our Store"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <i
              onClick={() => setFilter({ ...filter, name: searchValue })}
              class="fa fa-search"
              aria-hidden="true"
            ></i>
          </div>
          <h5>Menu Categories</h5>
          <div className="line"></div>
          <p onClick={() => setFilter({ ...filter, category: "" })}>All</p>
          {categories?.map((item) => (
            <p
              onClick={() => setFilter({ ...filter, category: item.name })}
              key={item.id}
            >
              {item.name}
            </p>
          ))}
          <h5>Categories</h5>
          <div className="line"></div>
          <p>All Products</p>
          <p>Best Seller</p>
          <p>Featured</p>
          <p>New Products</p>
          <h5>Recents Products</h5>
          <div className="line"></div>
          <div className="recent_list">
            {fruitList.slice(0, 3).map((item) => {
              return <ProductItem key={item.ID} fruit={item} recent />;
            })}
          </div>
        </div>
        <div className="shop_list">
          <div className="nav_option">
            <i
              onClick={() => setDisplay("grid")}
              className={`fa fa-th ${display === "grid" ? "active" : ""}`}
              aria-hidden="true"
            ></i>
            <i
              onClick={() => setDisplay("list")}
              className={`fa fa-th-list ${display === "list" ? "active" : ""}`}
              aria-hidden="true"
            ></i>
            <FormControl
              style={{
                marginRight: "0px",
                position: "absolute",
                right: "2.2rem",
                width: "auto",
                height: "80%",
                marginTop: "0%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Select
                value={sort}
                style={{ height: "80%" }}
                onChange={handleChange}
              >
                <MenuItem
                  onClick={() =>
                    setFilter({ ...filter, sortBy: "name", sortType: "ASC" })
                  }
                  value="Alphabetically, A-Z"
                >
                  Alphabetically, A-Z
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setFilter({ ...filter, sortBy: "sold", sortType: "DESC" })
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
                    setFilter({ ...filter, sortBy: "price", sortType: "ASC" })
                  }
                  value="Sort by price: low to high"
                >
                  Sort by price: low to high
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setFilter({ ...filter, sortBy: "price", sortType: "DESC" })
                  }
                  value="Sort by price: high to low"
                >
                  Sort by price: high to low
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setFilter({ ...filter, sortBy: "rate", sortType: "DESC" })
                  }
                  value="Product name"
                >
                  Rating
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          {display === "grid" ? (
            <div className="fruits_grid">
              {fruitList.map((item) => {
                return <ProductItem key={item._id} fruit={item} />;
              })}
            </div>
          ) : (
            <div className="fruits_list">
              {fruitList.map((item) => {
                return <ProductItem key={item._id} fruit={item} list />;
              })}
            </div>
          )}
          <div
            style={{
              height: "50px",
              marginTop: "2rem",
              justifyContent: "space-between",
            }}
            className="nav_option results"
          >
            <Stack style={{ marginLeft: "1rem" }} spacing={2}>
              <Pagination
                count={numOfPage}
                variant="outlined"
                shape="rounded"
                color="primary"
                page={page}
                onChange={handleChangePage}
              />
            </Stack>
            <p>
              Showing {(page - 1) * 6 + 1} -{" "}
              {page === numOfPage ? all : page * 6} of {all} results
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
