import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import img from "../image/feature-1.jpg";
import deal from "../image/deal.png";
import ProductItem from "../utils/ProductItem/productItem";
import banner1 from "../image/banner1.jpg";
import banner2 from "../image/banner2.jpg";
import banner3 from "../image/banner3.jpg";
import BlogItem from "../utils/BlogItem/BlogItem";
import { useSelector, useDispatch } from "react-redux";
import {
  blogsSelector,
  loadingSelector,
  productsSelector,
} from "../../redux_toolkit/selector/selector";
import { fetchFruits } from "../../redux_toolkit/reducer/productSliceReducer";
import Loading from "../utils/Loading/Loading";
const HomePage = () => {
  const [slide, setSlide] = useState();
  const [slideIndex, setSlideIndex] = useState(0);
  const fruitsList = useSelector(productsSelector);
  const blogsList = useSelector(blogsSelector);
  const loading = useSelector(loadingSelector);
  const dispatch = useDispatch();
  const settings = {
    dots: false,
    infinite: true,
    speed: 200,
    fade: true,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    slidesToScroll: 1,
    pauseOnHover: false,
    beforeChange: (current, next) => setSlideIndex(next),
  };
  const setting = {
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 3,
    autoplaySpeed: 7000,
    slidesToScroll: 1,
    pauseOnHover: false,
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
        name: ''
      })
    );
  }, [dispatch]);
  return (
    <>
      {loading === "loading" ? <Loading /> : ""}
      <div className="slider_banner">
        <Slider ref={(c) => setSlide(c)} {...settings}>
          <div className={`slider1 slider ${slideIndex === 0 ? "action" : ""}`}>
            <h4>Cold processed organic fruit</h4>
            <h1>Fresh Avocado</h1>
            <h2>SHOP NOW</h2>
          </div>
          <div className={`slider2 slider ${slideIndex === 1 ? "action" : ""}`}>
            <h4>Healthy life with</h4>
            <h1>Natural Organic</h1>
            <h2>SHOP NOW</h2>
          </div>
        </Slider>
        <div className="btn_arrow">
          <i
            onClick={() => slide.slickNext()}
            className="fa fa-chevron-left"
            aria-hidden="true"
          ></i>
          <i
            onClick={() => slide.slickPrev()}
            className="fa fa-chevron-right"
            aria-hidden="true"
          ></i>
        </div>
      </div>
      <div className="important">
        <div className="important_content">
          <h2>Important to eat fruit</h2>
          <p>
            Eating fruit provides health benefits — people who eat more fruits
            and vegetables as part of an overall healthy diet are likely to have
            a reduced risk of some chronic diseases. Fruits provide nutrients
            vital for health and maintenance of your body.
            <br />
            <br />
            Fruits are sources of many essential nutrients that are
            underconsumed, including potassium, dietary fiber, vitamin C, and
            folate (folic acid).
            <br />
            <br />
            Most fruits are naturally low in fat, sodium, and calories. None
            have cholesterol.
          </p>
        </div>
        <img alt="" src={img} />
      </div>
      <div className="best_sale">
        <h4>BEST SALE</h4>
        <p>
          All best seller product are now available for you and your can buy
          this product from here any time any where so sop now
        </p>
        <div className="fruits_sale">
          {fruitsList?.map((item) => {
            return <ProductItem key={item._id} fruit={item} />;
          })}
        </div>
      </div>
      <div className="flash_deal">
        <img alt="" src={deal} />
        <div className="deal_content">
          <h2>FLASH DEALS</h2>
          <h4>HURRY UP AND GET 25% DISCOUNT</h4>
          <h5>SHOP NOW</h5>
        </div>
      </div>
      <div className="banner">
        <div className="banner_item">
          <img alt="" src={banner1} />
        </div>
        <div className="banner_item">
          <img alt="" src={banner2} />
        </div>
        <div className="banner_item">
          <img alt="" src={banner3} />
        </div>
      </div>
      <div className="best_sale">
        <h4>FEATURED PRODUCTS</h4>
        <p>
          All best seller product are now available for you and your can buy
          this product from here any time any where so sop now
        </p>
        <div className="fruits_sale">
          {fruitsList?.map((item) => {
            return <ProductItem key={item._id} fruit={item} />;
          })}
        </div>
      </div>
      {/* <div className='best_sale'>
                <h4>LATEST BLOG</h4>
                <p>If you want to know about the organic product then keep an eye on our blog.</p>
                <div className='blog'>
                    <Slider {...setting}>
                        {
                            blogsList.map(item => {
                                return <BlogItem key={item.id} blog={item} />
                            })
                        }
                    </Slider>
                </div>
            </div> */}
    </>
  );
};

export default HomePage;
