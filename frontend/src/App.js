import "./styles.css";

//import thư viện
import { BrowserRouter, Route, Routes } from "react-router-dom";

//import giao diện từ thư mục pages
import Header from "./pages/Header";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Footer from "./pages/Footer";
import Cart from "./pages/Cart";
import Detail from "./pages/Detail";
import Payment from "./pages/Payment";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/:id/detail-product" element={<Detail />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
