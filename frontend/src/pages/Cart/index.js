import "./Cart.css";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
function Cart() {
  // lay du lieu
  let cart = [];
  let totalPrice = 0;
  const getData = () => {
    totalPrice = 0;
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", []);
    }
    try {
      cart = JSON.parse(localStorage.getItem("cart"));
    } catch (err) {}
    for (let product of cart) {
      totalPrice += product.total;
    }
  };
  getData();

  //refresh lai trang
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    setTimeout(() => setRefreshing(false), 1000);
  }, [refreshing]);

  const formatNumber = (n) => {
    return String(n).replace(/(.)(?=(\d{3})+$)/g, "$1,");
  };

  const removeItem = (productId) => {
    console.log("product id: " + productId);
    let temp = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(temp));
    onRefresh();
  };

  const increaseAmount = (productId) => {
    for (let product of cart) {
      if (product.id === productId) {
        product.amount += 1;
        product.total = product.amount * product.price;
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    onRefresh();
  };
  const decreaseAmount = (productId) => {
    for (let product of cart) {
      if (product.id === productId && product.amount !== 1) {
        product.amount -= 1;
        product.total = product.amount * product.price;
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    onRefresh();
  };
  return (
    <div className="cartContainer">
      <h2 className="title">Giỏ Hàng</h2>
      <table className="table">
        <thead>
          <tr className="titleTB">
            <th className="nameTB">Tên Sản Phẩm</th>
            <th className="imgTB">Hình Ảnh</th>
            <th className="priceTB">Giá</th>
            <th className="amountTB">Số lượng mua</th>
            <th className="totalTB">Tổng</th>
            <th className="btnTB"></th>
          </tr>
        </thead>
        {cart.map((c) => (
          <tbody className="tableBody" key={c.id}>
            <tr>
              <td>{c.name}</td>
              <td>
                <img className="img-cart" src={c.image} alt="" />
              </td>
              <td className="nowrap">{formatNumber(c.price)}</td>
              <td className="nowrap">
                <button
                  className="deceaseBtn"
                  onClick={() => decreaseAmount(c.id)}
                >
                  -
                </button>
                {c.amount}
                <button
                  className="inceaseBtn"
                  onClick={() => increaseAmount(c.id)}
                >
                  +
                </button>
              </td>
              <td className="nowrap">{formatNumber(c.total)}</td>
              <td className="nowrap">
                <button onClick={() => removeItem(c.id)}>Xóa</button>
              </td>
            </tr>
          </tbody>
        ))}
        <tfoot>
          <tr className="totalPrice">
            <td colSpan="4">Tổng: </td>
            <td>{formatNumber(totalPrice)}</td>
          </tr>
        </tfoot>
      </table>
      <NavLink to="/payment">
        {cart.length > 0 && (
          <button className="paymentButton">Tiến Hành Thanh toán</button>
        )}
      </NavLink>
    </div>
  );
}

export default Cart;
