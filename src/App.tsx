import { Routes, Route } from "react-router-dom";
import { Catalog } from "./pages/Catalog";
import SpinTheBottle from "./games/spin-the-bottle";
import LogoMover from "./games/logo-mover";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalog />} />
      <Route path="/games/spin-the-bottle" element={<SpinTheBottle />} />
      <Route path="/games/logo-mover" element={<LogoMover />} />
    </Routes>
  );
}

export default App;
