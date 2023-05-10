//import css
import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-slideshow-image/dist/styles.css";
import { NavLink } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import searchIcon from "/public/images/icon/search-icon.png";

import "./Home.css";

function Home() {
  const formatNumber = (n) => {
    return String(n).replace(/(.)(?=(\d{3})+$)/g, "$1,");
  };
  const images = [
    "https://f16-zpc.zdn.vn/1742302556357215724/e66baf0a30cfef91b6de.jpg",
    "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
  ];
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:8080/product`).then((response) => {
      setProducts(response.data);
    });
  }, []);

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = products.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  return (
    <div className="containerHome">
      <div className="bannerContainer">
        <div className="imageArea">
          <Carousel
            autoPlay={true}
            showStatus={false}
            dynamicHeight={true}
            interval="3000"
            showThumbs={false}
            showArrows={true}
            infiniteLoop={true}
          >
            <NavLink to="/">
              <div>
                <img width="90%" height="450px" alt="" src={images[0]} />
              </div>
            </NavLink>
            <NavLink to="/">
              <div>
                <img width="90%" height="450px" alt="" src={images[1]} />
              </div>
            </NavLink>
            <NavLink to="/">
              <div>
                <img width="90%" height="450px" alt="" src={images[2]} />
              </div>
            </NavLink>
          </Carousel>
        </div>
      </div>
      <div className="searchContainer">
        <div className="searchInputs">
          <input
            type="text"
            value={wordEntered}
            onChange={handleFilter}
            placeholder="Từ khóa tìm kiếm..."
          />
          <div className="searchIcon">
            <img alt="" src={searchIcon} />
          </div>
        </div>
        {filteredData.length !== 0 && (
          <div className="dataResult">
            {filteredData.slice(0, 15).map((value, key) => {
              return (
                <NavLink
                  key={key}
                  to={"/" + value._id + "/detail-product"}
                  alt=""
                  className="dataItem"
                >
                  <p>{value.name} </p>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
      <div className="productsArea">
        {products.map((product) => (
          <div key={product._id} className="productContainer">
            <NavLink
              to={"/" + product._id + "/detail-product"}
              style={{ textDecoration: "none" }}
            >
              <div className="glassContainer">
                <div className="imageContainer">
                  <img src={product.avatarImage} alt="new" />
                </div>
                <div className="name">
                  <h2>{product.name}</h2>
                </div>
                <div className="price">
                  <span>{formatNumber(product.price)}₫</span>
                </div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
