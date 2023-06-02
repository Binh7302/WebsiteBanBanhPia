//import css
import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-slideshow-image/dist/styles.css";
import { NavLink } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import searchIcon from "/public/images/icon/search-icon.png";
import banner1 from "/public/images/logo/banner1.jpg";
import banner2 from "/public/images/logo/banner2.jpg";
import banner3 from "/public/images/logo/banner3.jpg";
import "./Home.css";

function Home() {
  const formatNumber = (n) => {
    return String(n).replace(/(.)(?=(\d{3})+$)/g, "$1,");
  };
  const images = [banner1, banner2, banner3];
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:8080/product`).then((response) => {
      setData(response.data);
    });
  }, []);

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    let searchProducts = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].products.length; j++) {
        searchProducts.push(data[i].products[j]);
      }
    }

    const newFilter = searchProducts.filter((value) => {
      return value?.name.toLowerCase().includes(searchWord.toLowerCase());
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
                <img width="90%x" alt="" src={images[0]} />
              </div>
            </NavLink>
            <NavLink to="/">
              <div>
                <img width="90%" alt="" src={images[1]} />
              </div>
            </NavLink>
            <NavLink to="/">
              <div>
                <img width="90%" alt="" src={images[2]} />
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
      <div className="homeArea">
        {data &&
          data.map((d, index) => (
            <div key={index}>
              <div className="category">
                <p>{d.category?.name}</p>
              </div>

              <div className="productsArea">
                {d.products?.map((p, index) => (
                  <div key={index} className="productContainer">
                    <NavLink
                      to={"/" + p._id + "/detail-product"}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="glassContainer">
                        <div className="imageContainer">
                          <img src={p?.avatarImage} alt="new" />
                        </div>
                        <div className="name">
                          <p>{p?.name}</p>
                        </div>
                        <div className="weigth">
                          <p>Trọng lượng: {p?.weigth}g</p>
                        </div>
                        <div className="price">
                          <span>{formatNumber(p?.price)}₫</span>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Home;
