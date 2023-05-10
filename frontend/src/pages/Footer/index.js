import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footerContainer">
        <div className="row">
          <div className="footer-col">
            <h4>www.banhchay.com.vn</h4>
            <h4>www.banhpialongan.com.vn</h4>
            <h4>Chuyên cung cấp đặc sản bánh Pía chay</h4>
          </div>
          <div className="footer-col">
            <h4 className="format">Hỗ trợ khách hàng</h4>
            <ul>
              <li>
                <a href="#">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="#">Điều khoản sử dụng</a>
              </li>
              <li>
                <a href="#">Giao hàng và đổi trả</a>
              </li>
              <li>
                <a href="#">Phương thức thanh toán</a>
              </li>
              <li>
                <a href="#">Chính sách chiết khấu</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="format">Liên hệ</h4>
            <h4>
              <b>Địa chỉ: </b>363/1f Chu Văn An, Phường 12, Bình Thạnh, Thành
              Phố Hồ Chí Minh
            </h4>
            <h4>
              <b>Số điện thoại: </b>016457511
            </h4>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
