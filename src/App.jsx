import { useState } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";

export default function App() {
  const [page, setPage] = useState("Home");

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fff" }}>
      <Nav page={page} setPage={navigate} />
      {page === "Home" && <HomePage />}
      {page === "About" && <AboutPage />}
      {page === "FAQ" && <FAQPage />}
      <Footer setPage={navigate} />
    </div>
  );
}
