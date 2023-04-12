import ReactDOM from "react-dom/client";
import React, { useRef, useEffect, useState } from 'react';
import $ from 'jquery';

import Game from './game';
import Records from './records';

class User extends React.Component{
    constructor(props){
        super(props);
        this.gameId = -1;
        this.state = { status: 0 };
        this.returnToUserPage = this.returnToUserPage.bind(this);
    }
    // start a pvp game
    pvp(){
        let data = { username: this.props.username };
        fetch('http://localhost:3000/game/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(response =>{
            console.log(response.gameId);
            this.setState({ status: 1 })
        })
    }
    // Return to this page after finishing a game
    returnToUserPage(){
        this.setState({ status: 0 })
    }
    render(){
        if(this.state.status == 0){
            return(
                <div>
                    <h1>{this.props.username}'s Page</h1>
                    <button onClick={(e) => this.pvp()}>PvP</button>
                    <button>PvE</button>
                    <button>Check Game History</button>
                </div>
            )
        }else{
            return(
                // render a game page
                <Game returnToUserPage={this.returnToUserPage}/>
            )
        }
    }
}

export default User;