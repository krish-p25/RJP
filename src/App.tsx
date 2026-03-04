import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { SiteHeader } from "./components/SiteHeader";
import { HomePage } from "./pages/HomePage";
import { PortfolioPage } from "./pages/PortfolioPage";

function App() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <div className="fixed -left-20 top-24 -z-10 h-80 w-80 rounded-full bg-[#b69bff] opacity-35 blur-[70px]" />
      <div className="fixed -right-28 -bottom-10 -z-10 h-[360px] w-[360px] rounded-full bg-[#d2beff] opacity-35 blur-[70px]" />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:projectName" element={<PortfolioPage />} />
      </Routes>
    </>
  );
}

export default App;
