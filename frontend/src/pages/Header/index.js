//import thư viện
import { NavLink } from "react-router-dom";
//import css
import "./Header.css";
//import logo
import logo from "/public/images/logo/logo.png";
import menuicon from "/public/images/icon/menu-icon.png";
import closeicon from "/public/images/icon/close-icon.png";
import carticon from "/public/images/icon/cart-icon.png";
//import thu vien
import { useEffect, useState } from "react";

function Header() {
  const [state, setState] = useState(false);
  const [srcBar, setSrcBar] = useState("");
  const [classNameNavBar, setClassNameNavBar] = useState("");

  //doi state khi click
  const clickBar = () => {
    if (state === true) {
      setState(false);
    } else {
      setState(true);
    }
  };

  useEffect(() => {
    if (state === true) {
      return setSrcBar(closeicon), setClassNameNavBar("#navbar active");
    } else {
      return setSrcBar(menuicon), setClassNameNavBar("#navbar");
    }
  }, [state, srcBar, classNameNavBar]);
  return (
    <header className="container">
      <nav className="nav">
        <NavLink to="/">
          <img className="logo" src={logo} alt="logo" />
        </NavLink>
        <ul id="navbar" className={classNameNavBar}>
          <li className="active">
            <NavLink to="/">Trang Chủ</NavLink>
          </li>
          <li>
            <NavLink to="/about">Giới Thiệu</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Liên Hệ</NavLink>
          </li>
        </ul>
        <div>
          <NavLink to="/cart">
            <img className="carticon" src={carticon} alt="cart-icon" />
          </NavLink>
        </div>
        <div id="mobile">
          <img onClick={clickBar} id="bar" src={srcBar} alt="bar" />
        </div>
      </nav>
    </header>
  );
}

export default Header;
