import { Link } from "react-router-dom";

function GameHomePage() {
  return (
    <div className="game-homepage-container">
      <h1>Gobang Game</h1>
      <div className="buttons-container">
        <Link to="/game">
          <button className="start-game-button">Start Game</button>
        </Link>
        <Link to="/game-history">
          <button className="game-history-button">Game History</button>
        </Link>
      </div>
      <div className="friend-list-container">
        <h3>Friends</h3>
        <ul className="friend-list">
          <li>Friend 1</li>
          <li>Friend 2</li>
          <li>Friend 3</li>
        </ul>
      </div>
    </div>
  );
}

export default GameHomePage;