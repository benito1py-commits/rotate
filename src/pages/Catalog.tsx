import { Link } from "react-router-dom";
import type { GameMeta } from "../shared/types";
import "./Catalog.css";

const GAMES: GameMeta[] = [
  {
    id: "spin-the-bottle",
    title: "Spin the Bottle",
    description: "Spin a bottle with circular hand motions",
    emoji: "🍾",
    color: "#00ff88",
    path: "/games/spin-the-bottle",
  },
  {
    id: "logo-mover",
    title: "Logo Mover",
    description: "Move a 3D logo around with your finger",
    emoji: "💎",
    color: "#ff6ec7",
    path: "/games/logo-mover",
  },
  {
    id: "ball-thrower",
    title: "Ball Thrower",
    description: "Pinch to grab a ball, release to throw it",
    emoji: "🏀",
    color: "#ffa500",
    path: "/games/ball-thrower",
  },
];

export function Catalog() {
  return (
    <div className="catalog">
      <h1 className="catalog-title">Hand Tracking Games</h1>
      <p className="catalog-subtitle">Choose a game to play with your hands</p>

      <div className="catalog-grid">
        {GAMES.map((game) => (
          <Link key={game.id} to={game.path} className="game-card" style={{ "--accent": game.color } as React.CSSProperties}>
            <span className="game-card-emoji">{game.emoji}</span>
            <h2 className="game-card-title">{game.title}</h2>
            <p className="game-card-desc">{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
