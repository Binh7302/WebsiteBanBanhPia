import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "./Detail.css";
import carticon from "/public/images/icon/cart-icon.png";

function Detail() {
  const id = useParams();
  console.log("id: " + id.id);
  const [imageIndex, setImageIndex] = useState(0);

  const [proId, setProId] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState(0);
  const [ingredient, setIngredient] = useState("");
  const [expirationDate, setExpirationDate] = useState(0);
  const [productManual, setProductManual] = useState("");
  const [productImage, setProductImage] = useState([{ name: "" }]);

  let url = "http://localhost:8080/" + id.id + "/detail-product";
  const getData = () => {
    axios.get(url).then((response) => {
      console.log(response.data);
      setProId(response.data.product._id);
      setName(response.data.product.name);
      setImage(response.data.product.avatarImage);
      setPrice(response.data.product.price);
      setDescription(response.data.product.description);
      setBrand(response.data.product.brand);
      setWeight(response.data.product.weigth);
      setIngredient(response.data.product.ingredient);
      setExpirationDate(response.data.product.expirationDate);
      setProductManual(response.data.product.productManual);
      setProductImage(response.data.productImage);
    });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getData();
  }, []);

  const handleTab = (index) => {
    setImageIndex(index);
    console.log(imageIndex);
  };

  const onClick = () => {
    let p = {
      id: proId,
      name: name,
      image: image,
      price: price,
      amount: 1,
      total: price
    };
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", []);
    }
    let cart = localStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];
    if (cart.length === 0) {
      cart.push(p);
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      let res = cart.find((e) => e.id === p.id);
      if (res === undefined) {
        cart.push(p);

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Thêm vào giỏ hàng thành công");
      } else {
        alert("Sản phẩm đã ở trong giỏ hàng");
      }
    }
  };

  const formatNumber = (n) => {
    return String(n).replace(/(.)(?=(\d{3})+$)/g, "$1,");
  };
  return (
    <div className="detailContainer">
      <div className="details">
        <div className="big-img">
          <img src={productImage[imageIndex].image} alt="" />
        </div>

        <div className="box">
          <div className="thumb">
            {productImage &&
              productImage.map((img, index) => (
                <img
                  onClick={() => handleTab(index)}
                  className={imageIndex === index ? "active" : ""}
                  key={index}
                  src={img.image}
                  alt=""
                />
              ))}
          </div>
          <div className="row">
            <h2>{name}</h2>
            <span>{formatNumber(price)}₫</span>
          </div>
          <p className="formatDetail">
            <b>Mô tả:</b> {description}
          </p>
          <p>
            <b>Hãng:</b> {brand}
          </p>
          <p>
            <b>Khối lượng:</b> {weight}g
          </p>
          <p className="formatDetail">
            <b>Thành phần:</b> {ingredient}g
          </p>
          <p className="formatDetail">
            <b>Hạn sử dụng:</b> {expirationDate}
          </p>
          <p className="formatDetail">
            <b>Hướng dẫn sử dụng:</b> {productManual}
          </p>

          <button onClick={onClick} className="cart">
            <img className="carticonDetail" src={carticon} alt="cart-icon" />{" "}
            <p>Thêm Vào Giỏ Hàng</p>
          </button>
        </div>
      </div>
      ;
    </div>
  );
}

export default Detail;
