import ReactDOM from "react-dom/client";
import React, { useRef, useEffect, useState } from 'react';
import $ from 'jquery';

import Cookies from 'universal-cookie'
const cookies = new Cookies();

import Game from './game';
import Records from './records';
import "./iframe.css";
import "./styles.css";

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

    // start a pve game
    pve(){
        this.setState({ status: 2 });
    }

    //check game records
    check_records(){
        this.setState({ status: 3 });
    }
    // logout
    logout(){
        window.location.replace("http://localhost:80");
    }
    // Return to this page after finishing a game
    returnToUserPage(){
        this.setState({ status: 0 })
    }
    // render different react component according to the state
    render(){
        if(this.state.status == 0){
            return(
                <div style={{backgroundImage: 'url(./back_ground.png)', backgroundSize: 'cover', backgroundPosition: 'center center', minHeight: '100vh', minWidth: '100vh' }}>
                <br/> <br/><br/> <br/><br/> <br/><br/> <br/><br/>
                <div className="container" style={{maxWidth: '400px', margin: 'auto',  backgroundColor: '#f0f0f0', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)', padding: "20px", justifyContent: 'center', alignItems: 'center'}}>
                    <h1>{this.props.username}'s Page</h1>
                    <button onClick={(e) => this.pvp()}>PvP</button> <br/><br/>
                    <button onClick={(e) => this.pve()}>PvE</button> <br/><br/>
                    <button onClick={(e) => this.check_records()}>Check Game History</button> <br/><br/>
                    <button onClick={(e) => this.logout()}>Logout</button>
                </div>
                </div>
            )
        }else if (this.state.status == 1){
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
        }else if (this.state.status == 2){
            return(
                <div>
                    <button onClick={this.returnToUserPage}>Return to User Page</button>
                    <iframe className='my-iframe' src={process.env.PUBLIC_URL + '/gobang_local.html'}></iframe>
                </div>
            )
        }else if (this.state.status == 3){
            return(
                <div>
                    <button onClick={this.returnToUserPage}>Return to User Page</button>
                    <Records username={this.props.username}/>
                </div>
            )
        }
    }
}

export default User;