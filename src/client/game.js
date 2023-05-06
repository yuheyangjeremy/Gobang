import ReactDOM from "react-dom/client";
import React from 'react';
import $ from 'jquery';

class Game extends React.Component{
    // Constructor for Game.
    constructor(props){
        super(props);
    }
    // call this function after the gane is finished to return to the user page
    returnToUserPage() {
        this.props.returnToUserPage();
    }

    // other game functions

    // render the gameboard and chatbox
    render(){
        return(
            <div>
                <button onClick={() => this.returnToUserPage()}>Return to Home Page</button>
            </div>
        )
    }
}

export default Game;