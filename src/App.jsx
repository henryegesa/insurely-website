import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import { PrivacyPage, TermsPage } from "./pages/LegalPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import NotFoundPage from "./pages/NotFoundPage";
import MotorInsurancePage from "./pages/MotorInsurancePage";
import ContactPage from "./pages/ContactPage";

const NO_CHROME = ["/confirmation"];

export default function App() {
  const { pathname } = useLocation();
  const hideChrome = NO_CHROME.includes(pathname);

  return (
    <div>
      {!hideChrome && <Nav />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/motor-insurance" element={<MotorInsurancePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!hideChrome && <Footer />}
    </div>
  );
}
