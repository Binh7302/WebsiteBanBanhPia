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
      <p className="title">Giỏ Hàng</p>
      <section id="no-more-tables">
        <table className="table table-bordered table-striped table-condensed cf">
          <thead className="cf">
            <tr>
              <th className="numeric">Hình Ảnh</th>
              <th className="numeric">Tên Sản Phẩm</th>
              <th className="numeric">Giá</th>
              <th className="numeric">Số lượng mua</th>
              <th className="numeric">Tổng</th>
              <th className="numeric"></th>
            </tr>
          </thead>
          {cart.map((c) => (
            <tbody key={c.id}>
              <tr>
                <td className="numeric" data-title="Hình Ảnh">
                  <img src={c.image} alt="" />
                </td>
                <td className="numeric" data-title="Tên Sản Phẩm">
                  {c.name}
                </td>
                <td className="numeric" data-title="Giá">
                  {formatNumber(c.price)}
                </td>
                <td
                  className="numeric"
                  data-title="Số lượng mua"
                  id="amountFormContainer"
                >
                  <div className="amountCont">
                    <button
                      className="tableBtn"
                      onClick={() => decreaseAmount(c.id)}
                    >
                      -
                    </button>

                    {c.amount}
                    <button
                      className="tableBtn"
                      onClick={() => increaseAmount(c.id)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="numeric" data-title="Tổng">
                  {formatNumber(c.total)}
                </td>
                <td>
                  <button className="tableBtn" onClick={() => removeItem(c.id)}>
                    &#215;
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </section>
      <div className="totalCont">
        <table>
          <thead>
            <tr className="totalPrice">
              <td>Tạm tính: </td>
              <td>{formatNumber(totalPrice)}</td>
            </tr>
          </thead>
        </table>
      </div>
      <div className="btnCartContainer">
        <div className="backCartContainer">
          <NavLink to="/">
            <button>Quay về</button>
          </NavLink>
        </div>
        <div className="paymentCartContainer">
          <NavLink to="/payment">
            {cart.length > 0 && <button>Thanh toán</button>}
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Cart;
