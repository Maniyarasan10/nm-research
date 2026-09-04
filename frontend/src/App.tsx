import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PageTransition from "./components/layout/PageTransition";
import Chatbot from "./components/layout/Chatbot";
import ScrollProgress from "./components/ui/ScrollProgress";
import SceneEnergy from "./components/SceneEnergy";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Research = lazy(() => import("./pages/Research"));
const Membership = lazy(() => import("./pages/Membership"));
const Contact = lazy(() => import("./pages/Contact"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = (window as unknown as {
      __lenis?: { scrollTo: (y: number, o?: { immediate?: boolean }) => void };
    }).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Pages() {
  const location = useLocation();
  return (
    <PageTransition key={location.pathname}>
      <Suspense fallback={null}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/research" element={<Research />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <SceneEnergy />
      <Navbar />
      <Chatbot />
      <main>
        <Pages />
      </main>
      <Footer />
    </>
  );
}
