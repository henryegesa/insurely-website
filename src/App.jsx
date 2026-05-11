import { useState } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import { PrivacyPage, TermsPage } from "./pages/LegalPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import NotFoundPage from "./pages/NotFoundPage";
import QuotePage from "./pages/QuotePage";
import MotorInsurancePage from "./pages/MotorInsurancePage";
import PartnersPage from "./pages/PartnersPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  const initialPage = new URLSearchParams(window.location.search).get("confirmed") === "true"
    ? "Confirmation"
    : "Home";
  const [page, setPage] = useState(initialPage);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const noNav = ["Confirmation", "NotFound"].includes(page);

  return (
    <div>
      {!noNav && <Nav page={page} setPage={navigate} />}
      {page === "Home"          && <HomePage setPage={navigate} />}
      {page === "About"         && <AboutPage />}
      {page === "FAQ"           && <FAQPage />}
      {page === "Motor"         && <MotorInsurancePage setPage={navigate} />}
      {page === "Partners"      && <PartnersPage setPage={navigate} />}
      {page === "Contact"       && <ContactPage setPage={navigate} />}
      {page === "Quote"         && <QuotePage setPage={navigate} />}
      {page === "Privacy"       && <PrivacyPage />}
      {page === "Terms"         && <TermsPage />}
      {page === "Confirmation"  && <ConfirmationPage setPage={navigate} />}
      {page === "NotFound"      && <NotFoundPage setPage={navigate} />}
      {!noNav && <Footer setPage={navigate} />}
    </div>
  );
}
