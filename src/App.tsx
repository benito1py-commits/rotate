import { Routes, Route } from "react-router-dom";
import { Catalog } from "./pages/Catalog";
import SpinTheBottle from "./games/spin-the-bottle";
import LogoMover from "./games/logo-mover";
import BallThrower from "./games/ball-thrower";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalog />} />
      <Route path="/games/spin-the-bottle" element={<SpinTheBottle />} />
      <Route path="/games/logo-mover" element={<LogoMover />} />
      <Route path="/games/ball-thrower" element={<BallThrower />} />
    </Routes>
  );
}

export default App;
