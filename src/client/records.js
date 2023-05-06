import ReactDOM from "react-dom/client";
import React, { useRef, useEffect, useState } from 'react';
import $ from 'jquery';

function Records(props){
    // Constructor for Records.
    const [games, setGames] = useState([]);
    const [status, setStatus] = useState(0);
    const [gameId, setGameId] = useState(0);

    useEffect(() => {
        // "localhost:3000" could be omitted by setting proxy in package.json
        fetch("http://localhost:3000/records/getRecords/"+props.username, {method: "GET"})
        .then((res) => res.json())
        .then((data) => setGames(data))
        .catch((err) => console.error(err));
    }, []);

    // Return players to list view.
    const returnToListView = () => {
      setStatus(0);
    }

    // Check current records.
    const viewRecordDetails = (gameId) => {
      setStatus(1);
      setGameId(gameId)
    }

    // HTML code for players to check their information.
    if(status == 0){
      return (
        <div className="container">
        <h1>Game Records</h1>
        <table className="table">
          <thead>
            <tr>
                <th>Black</th>
                <th>White</th>
                <th>Start Time</th>
                <th>Elapsed Time</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game._id} onClick={() => viewRecordDetails(game.gameId)}>
                <td>< img src={game.Status == 1 ? 'star.png' : 'blank_star.png'} width="20" height="20" /> {game.player1} </td>
                <td>< img src={game.Status == 2 ? 'star.png' : 'blank_star.png'} width="20" height="20" /> {game.player2} </td>
                <td>{game.startTime}</td>
                <td>{game.elapsedTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    }else{
      return(
        <div>
          <br/><br/>
          <button onClick={returnToListView}>Return to Listview</button>
          <iframe className='my-iframe' src={process.env.PUBLIC_URL + '/gobang_record.html'} gameid={gameId}></iframe>
        </div>
      )
      
    }
    
}

export default Records;