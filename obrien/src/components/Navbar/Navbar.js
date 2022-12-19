import React, { useEffect, useState } from "react";
import logo from "../image/logo.jpg";
import Scroll from "react-scroll";
import { useSelector, useDispatch } from "react-redux";
import { userSelector } from "../../redux_toolkit/selector/selector";
import { getUser, refresh } from "../../redux_toolkit/reducer/userSliceReducer";
import Avatar from "@mui/material/Avatar";
import { fetchCart } from "../../redux_toolkit/reducer/cartSliceReducer";
import { getWishList } from "../../redux_toolkit/reducer/wishlistSliceReducer";

const Navbar = () => {
  const cartStore = useSelector((state) => state.cart);
  const user = useSelector(userSelector);
  const wishListCount = useSelector((state) => state.wishList.totalCount);
  const dispatch = useDispatch();
  const [y, setY] = useState(window.scrollY);
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(true);
  const [active, setActive] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [title, setTitle] = useState("");
  const [upArrow, setUpArrow] = useState(false);
  const appearNavbar = () => {
    if (window.scrollY > 300) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };
  const appearArrow = (e) => {
    if (window.scrollY > 300) {
      const window = e.currentTarget;
      if (y > window.scrollY) {
        setUpArrow(true);
      } else if (y < window.scrollY) {
        setUpArrow(false);
      }
      setY(window.scrollY);
    } else {
      setUpArrow(false);
    }
  };
  const scroll = Scroll.animateScroll;
  window.addEventListener("scroll", appearNavbar);
  window.addEventListener("scroll", (e) => appearArrow(e));
  const scroll_to_top = () => {
    scroll.scrollToTop(Navbar);
  };
  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      dispatch(refresh());
      setTimeout(() => {
        dispatch(refresh());
      }, 10 * 60 * 1000);
    }
  }, [dispatch]);
  useEffect(() => {
    if (user.token) {
      dispatch(getUser(user.token));
      dispatch(fetchCart());
      dispatch(getWishList({perPage: "10", page: 1}));
    }
  }, [dispatch, user.token]);
  // useEffect(()=>{
  //     if(user.user.cart){
  //         dispatch(cartSliceReducer.actions.getCart(user.user.cart))
  //     }
  // },[dispatch,user.user.cart])
  // useEffect(()=>{
  //     if(user.user.wishList){
  //         dispatch(userSliceReducer.actions.getWishList(user.user.wishList))
  //     }
  // },[dispatch,user.user.wishList])

  useEffect(() => {});
  return (
    <>
      {hide ? (
        <div className="advertise">
          <p>Get 35% off for new product</p>
          <button onClick={() => (window.location = "/shop")}>
            <h5>Shop Now</h5>
          </button>
          <i
            onClick={() => setHide(false)}
            className="fa fa-times"
            aria-hidden="true"
          ></i>
        </div>
      ) : (
        ""
      )}
      <header className={`mega_menu ${navbar ? "active" : ""}`}>
        <div className="container_megamenu">
          <div className="row_megamenu v-center">
            <div className="header-item item-left">
              <div className="logo">
                <a href="/">
                  <img style={{ cursor: "pointer" }} alt="" src={logo} />
                </a>
              </div>
            </div>
            <div className="header-item item-center">
              <div className={`menu-overlay ${show ? "active" : ""}`}></div>
              <nav className={`menu_mega ${show ? "active" : ""}`}>
                <div className="mobile-menu-head">
                  <div
                    onClick={() => {
                      setActive(false);
                      setTitle("");
                    }}
                    className="go-back"
                  >
                    <i className="fa fa-angle-left"></i>
                  </div>
                  <div className="current-menu-title">{title}</div>
                  <div
                    onClick={() => setShow(false)}
                    className="mobile-menu-close"
                  >
                    &times;
                  </div>
                </div>
                <ul className="menu-main">
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li className="menu-item-has-children">
                    <div className="item_list">
                      <a href="/shop">Shop</a>
                      <i
                        onClick={() => {
                          setActive(true);
                          setTitle("Shop");
                        }}
                        className="fa fa-angle-down"
                      ></i>
                    </div>
                    {/* <div className={`sub-menu mega-menu mega-menu-column-4 ${active ? "active" : ""}`}>
                                        <div className="list-item">
                                            <h4 className="title">Tất cả</h4>
                                        </div>
                                        <div className="list-item">
                                            <h4 className="title">Cà phê</h4>
                                            <ul>
                                                <li><a href="/products">Cà phê Việt Nam</a></li>
                                                <li><a href="/products">Cà phê máy</a></li>
                                                <li><a href="/products">Cold Brew</a></li>
                                            </ul>
                                        
                                        </div>
                                        <div className="list-item">
                                            <h4 className="title">Trà</h4>
                                            <ul>
                                                <li><a href="/products">Trà trái cây</a></li>
                                                <li><a href="/products">Trà sữa Macchiato</a></li>
                                            </ul>
                                        </div> 
                                    </div> */}
                  </li>
                  <li className="menu-item-has-children">
                    <div className="item_list">
                      <a href="/blogs">Blog</a>
                      <i
                        onClick={() => {
                          setTitle("Blog");
                        }}
                        className="fa fa-angle-down"
                      ></i>
                    </div>
                    {/* <div className={`sub-menu mega-menu mega-menu-column-4 `}>
                                        <div className="list-item">
                                            <h4 className="title">Coffeeholic</h4>
                                            <ul>
                                                <li><a href="/stories">#chuyencaphe</a></li>
                                                <li><a href="/stories">#phacaphe</a></li>
                                            </ul>
                                        
                                        </div>
                                        <div className="list-item">
                                            <h4 className="title">Teaholic</h4>
                                            <ul>
                                                <li><a href="/stories">#cauchuyenvetra</a></li>
                                                <li><a href="/stories">#phatra</a></li>
                                            </ul>
                                        </div>
                                        <div className="list-item">
                                            <h4 className="title">Blog</h4>
                                            <ul>
                                                <li><a href="/stories">#inthemood</a></li>
                                                <li><a href="/stories">#review</a></li>
                                            </ul>
                                        </div>
                                        
                                    </div> */}
                  </li>

                  <li>
                    <a href="#footer">About</a>
                  </li>
                  <li>
                    <a href="#footer">Contact</a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="header-item item-right">
              {user.isLogin ? (
                ""
              ) : (
                <>
                  <a href="/login">Login</a>
                  <div
                    style={{
                      background: "black",
                      height: "15px",
                      width: "1px",
                      marginLeft: "10px",
                    }}
                  ></div>
                  <a href="/register">Register</a>
                </>
              )}
              <div
                style={{ marginRight: "1rem" }}
                onClick={() => (window.location = "/cart")}
                className="cart"
              >
                <i className="fa fa-shopping-bag" aria-hidden="true"></i>
                <span>{cartStore.numOfPro}</span>
              </div>
              {user.isLogin ? (
                <>
                  <div
                    style={{ marginRight: "1rem", marginLeft: "0" }}
                    onClick={() => (window.location = "/wish-list")}
                    className="cart"
                  >
                    <i className="fa fa-heart" aria-hidden="true"></i>
                    <span>
                      {wishListCount}
                    </span>
                  </div>
                  <Avatar
                    onClick={() => (window.location = "/my-account")}
                    style={{ cursor: "pointer" }}
                    alt=""
                    src={user && user.user.avatar}
                  />
                </>
              ) : (
                ""
              )}
              <div
                onClick={() => setShow(!show)}
                className="mobile-menu-trigger"
              >
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <i
        onClick={scroll_to_top}
        className={`fa fa-angle-up ${upArrow ? "appear" : ""} `}
        aria-hidden="true"
      ></i>
    </>
  );
};

export default Navbar;
