import { useState } from "react";
import "./Payment.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();

  let cart = [];
  let totalPrice = 0;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(0);

  console.log(name);
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

  const formatNumber = (n) => {
    return String(n).replace(/(.)(?=(\d{3})+$)/g, "$1,");
  };

  getData();

  const onChangeName = (event) => {
    setName(event.target.value);
  };

  const onChangeAddress = (event) => {
    setAddress(event.target.value);
  };

  const onChangePhone = (event) => {
    setPhone(event.target.value);
  };

  const resetCart = () => {
    localStorage.setItem("cart", []);
  };

  const onPaymentClick = async () => {
    if (name.trim() === "" || address.trim() === "" || phone.trim() === "") {
      alert("Không được để trống thông tin");
    } else if (cart.length === 0) {
      alert("Không có sản phẩm nào trong giỏ hàng của bạn");
    } else {
      let order = {
        Cart: cart,
        Customer: {
          name: name,
          phone: phone,
          address: address
        }
      };
      const respone = await axios.post(
        "http://localhost:8080/create-order",
        order
      );
      if (respone === false) {
        alert("Đã có lỗi xảy ra");
      } else {
        alert("Đặt hàng thành công");
        resetCart();
        navigate("/");
      }
    }
  };

  return (
    <div className="paymentContainer">
      <h2 className="titlePayment">Thanh Toán</h2>
      <div className="inputBox">
        <input onChange={onChangeName} type="text" required="required"></input>
        <span>Họ và tên</span>
      </div>
      <div className="inputBox">
        <input
          onChange={onChangeAddress}
          type="text"
          required="required"
        ></input>
        <span>Địa chỉ</span>
      </div>
      <div className="inputBox">
        <input onChange={onChangePhone} type="tel" required="required"></input>
        <span>Số điện thoại</span>
      </div>
      <table className="paymentTB">
        <thead>
          <tr>
            <th colSpan="2">Đơn hàng</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tổng:</td>
            <td>{formatNumber(totalPrice)}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <button className="paymentButton" onClick={onPaymentClick}>
          Đặt hàng
        </button>
      </div>
    </div>
  );
}

export default Payment;
