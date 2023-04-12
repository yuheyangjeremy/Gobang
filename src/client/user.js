import ReactDOM from "react-dom/client";
import React, { useRef, useEffect, useState } from 'react';
import $ from 'jquery';

import Cookies from 'universal-cookie'
const cookies = new Cookies();

import Game from './game';
import Records from './records';
import "./iframe.css";

class User extends React.Component{
    constructor(props){
        super(props);
        this.state = { status: 0, gameId: -1, role: 0  };
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
            let role = 0;
            console.log('player 2 is '+ response.player2);
            if(response.player2 == null){
                role = 1;
            }else{
                role = 2;
            }
            this.setState({ status: 1, gameId: response.gameId, role: role  })
        })
    }
    // Return to this page after finishing a game
    returnToUserPage(){
        this.setState({ status: 0 })
    }
    // render different react component according to the state
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
                <div>
                    <button onClick={this.returnToUserPage}>Return to User Page</button>
                    <iframe className='my-iframe' src={process.env.PUBLIC_URL + '/gobang.html'} 
                    gameid={this.state.gameId}
                    username={this.props.username}
                    role={this.state.role}>
                    </iframe>
                </div>
            )
        }
    }
}

export default User;