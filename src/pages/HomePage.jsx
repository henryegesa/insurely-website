import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import CoverOptions from "../components/CoverOptions";
import Trust from "../components/Trust";
import CTASection from "../components/CTASection";

export default function HomePage({ setPage }) {
  return (
    <>
      <Hero setPage={setPage} />
      <HowItWorks />
      <CoverOptions />
      <Trust />
      <CTASection setPage={setPage} />
    </>
  );
}
