import { Link } from "react-router-dom";
import type { GameMeta } from "../shared/types";
import { NeonPulseBackground } from "../components/NeonPulseBackground";
import "./Catalog.css";

const GAMES: GameMeta[] = [
  {
    id: "spin-the-bottle",
    title: "Gira la Botella",
    description: "Gira una botella con movimientos circulares de la mano",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4L22 18H26L24 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="24" cy="20" rx="4" ry="2" stroke="currentColor" stroke-width="2"/><path d="M20 22C19 24 17 28 17 32C17 36 20 40 24 40C28 40 31 36 31 32C31 28 29 24 28 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M30 10L34 7M18 10L14 7M32 14L37 13M16 14L11 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/></svg>`,
    color: "#00ff88",
    path: "/games/spin-the-bottle",
  },
  {
    id: "logo-mover",
    title: "Mueve el Logo",
    description: "Mueve un logo 3D con el dedo índice",
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 8L38 18V32L24 42L10 32V18L24 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M24 8V22M38 18L24 22M10 18L24 22" stroke="currentColor" stroke-width="1.5" opacity="0.5"/><path d="M24 22V42M10 32L24 22L38 32" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><circle cx="24" cy="22" r="3" stroke="currentColor" stroke-width="1.5"/></svg>`,
    color: "#ff6ec7",
    path: "/games/logo-mover",
  },
];

export function Catalog() {
  return (
    <div className="catalog">
      <NeonPulseBackground />
      <div className="catalog-content">
        <h1 className="catalog-title">Juegos con las Manos</h1>
        <p className="catalog-subtitle">Elige un juego y usa tus manos para jugar</p>

        <div className="catalog-grid">
          {GAMES.map((game) => (
            <Link key={game.id} to={game.path} className="game-card" style={{ "--accent": game.color } as React.CSSProperties}>
              <div className="game-card-icon" dangerouslySetInnerHTML={{ __html: game.icon }} />
              <h2 className="game-card-title">{game.title}</h2>
              <p className="game-card-desc">{game.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
