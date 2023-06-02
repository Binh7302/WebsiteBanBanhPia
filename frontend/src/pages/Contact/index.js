import "./Contact.css";
import address from "/public/images/logo/address.png";
function Contact() {
  return (
    <div className="contactContainer">
      <div className="glassContactContainer">
        <h2>Liên Hệ</h2>
        <p>
          <b>Địa chỉ: </b>363/1f Chu Văn An, Phường 12, Bình Thạnh, Thành Phố Hồ
          Chí Minh
        </p>
        <p>
          <b>Số Điện Thoại: </b>016457511
        </p>
        <div className="img">
          <a href="https://www.google.com/maps/place/363+Chu+Văn+An,+Phường+12,+Bình+Thạnh,+Thành+phố+Hồ+Chí+Minh/@10.8116329,106.6990547,17.78z/data=!4m6!3m5!1s0x31752895301b5e99:0x7f5c64ed722c6cc4!8m2!3d10.8115562!4d106.698357!16s%2Fg%2F11c5nbs1xd">
            <img src={address} alt="new" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;
