import ReactDOM from "react-dom/client";
import React, { useRef, useEffect, useState } from 'react';
import $ from 'jquery';

import Login from "./login";
import User from "./user";
import Admin from "./admin";

class Home extends React.Component{
    constructor(props) {
        super(props);
        this.check = this.check.bind(this);
        this.signUp = this.signUp.bind(this);
        this.isEmpty = this.isEmpty.bind(this);
        this.state = { isLoggedIn: false, isAdmin: false, text: null, username: null }
    }

    // empty checking fuction
    isEmpty(str) {
        if (str == null || str.trim() == "") {
            return true;
        } else {
            return false;
        }
    }

    // check the validity and update the state
    check(){
        let uname = $("#username").val();
        let pwd = $("#password").val();
        if (this.isEmpty(uname)) {
            alert("Username can not be empty!");
            return;
        }
        if (this.isEmpty(pwd)) {
            alert("Password can not be empty!");
            return;
        }
        // "localhost:3000" could be omitted by setting proxy in package.json
        let check_url = "http://localhost:3000/login/login_check";
        let data = {
            username: uname,
            password: pwd
        }
        // fetch here
        fetch(check_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(response => {
            console.log(response);

            if(response.validity){
                if(response.isAdmin){
                    this.setState({ isLoggedIn: true, isAdmin: true , username: uname});
                    alert(response.text);
                }else{
                    this.setState({ isLoggedIn: true, isAdmin: false, username: uname });
                    alert(response.text);
                }
            }else{
                alert(response.text);
            }
        })
    }

    // sign up new account
    signUp(){
        let uname = $("#username").val();
        let pwd = $("#password").val();
        if (this.isEmpty(uname)) {
            alert("Username can not be empty!");
            return;
        }
        if (this.isEmpty(pwd)) {
            alert("Password can not be empty!");
            return;
        }
        // "localhost:3000" could be omitted by setting proxy in package.json
        let signup_url = "http://localhost:3000/login/sign_up";
        let data = {
            username: uname,
            password: pwd
        }
        // fetch here
        fetch(signup_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(response => {
            console.log(response);
            if(response.validity){
                this.setState({ isLoggedIn: true, isAdmin: false, username: uname });
                alert(response.text);
            }else{
                alert(response.text);
            }
        })
    }

    // render according to the status
    render(){
        let body;
        if(this.state.isLoggedIn){
            if(this.state.isAdmin){
                body = <Admin />
            }else{
                body = <User username={this.state.username}/>
            }
        }else{
            body = <Login check={this.check} signUp={this.signUp} />
        }
        return(
            <div>
                {body}
            </div>
        )
    }
}

export default Home;