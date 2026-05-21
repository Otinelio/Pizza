import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CartProvider } from "@/lib/cart";
import { getRestaurantData, initSupabaseData } from "@/lib/data";
import Loader from "@/components/site/Loader";
import Ticker from "@/components/site/Ticker";
import Navbar from "@/components/site/Navbar";
import BottomNav from "@/components/site/BottomNav";
import Footer from "@/components/site/Footer";
import { CartFab, CartDrawer } from "@/components/site/Cart";
import HomePage from "@/pages/HomePage";
import MenuRoute from "@/pages/MenuRoute";
import MenuScanRoute from "@/pages/MenuScanRoute";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import AdminPage from "@/pages/AdminPage";
import KitchenPage from "@/pages/KitchenPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function ClosedBanner() {
  const [data, setData] = useState(getRestaurantData);
  useEffect(() => {
    const h = () => setData(getRestaurantData());
    window.addEventListener("mrpizza_data_changed", h);
    return () => window.removeEventListener("mrpizza_data_changed", h);
  }, []);
  if (data.status !== "closed") return null;
  return (
    <div style={{ background: "var(--color-fire)", color: "#0D0D0D", textAlign: "center", padding: "10px 16px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      Actuellement fermé — nous revenons bientôt
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(6rem, 20vw, 14rem)", color: "var(--color-fire)", lineHeight: 1, opacity: 0.3 }}>404</span>
      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--color-smoke)", margin: "16px 0 32px" }}>Page introuvable</p>
      <Link to="/" className="press" style={{ padding: "14px 32px", background: "var(--color-fire)", color: "#0D0D0D", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textTransform: "uppercase", textDecoration: "none", borderRadius: "var(--radius-sm)" }}>Retour à l'accueil</Link>
    </div>
  );
}

function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const isKitchen = pathname.startsWith("/kitchen");
  const isScan = pathname.startsWith("/menu/scan");

  useEffect(() => {
    // Initialiser les données Supabase avec les données par défaut si la base est vide
    initSupabaseData();
  }, []);

  // Admin and Kitchen get no public chrome at all
  if (isAdmin || isKitchen) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <CartProvider>
      <Loader />
      <Ticker />
      <ClosedBanner />
      {!isScan && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuRoute />} />
          <Route path="/menu/scan" element={<MenuScanRoute />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isScan && <CartFab />}
      {!isScan && <CartDrawer />}
      {!isScan && <Footer />}
      {!isScan && <BottomNav />}
    </CartProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppShell />
    </BrowserRouter>
  );
}
