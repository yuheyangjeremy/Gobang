import ReactDOM from "react-dom/client";
import React from 'react';
import $ from 'jquery';

import "./styles.css";

class Login extends React.Component{
    // render login page
    render(){
        return(
            <main>
              <div style={{margin: 'auto', justifyContent: 'center', alignItems: 'center', backgroundImage: 'url(./back_ground.png)', backgroundSize: 'cover', backgroundPosition: 'center center', minHeight: '100vh', minWidth: '100vh' }} >
                <br/> <br/><br/> <br/><br/> <br/><br/>
                <form action="/login_check" method="post" id="loginForm">
                <h1>Login Page</h1>
                  <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" />
                  </div>
                  <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" />
                  </div>
                  <button type="button" id="loginBtn" onClick={(e) => this.props.check()}>Login</button><br/><br/>
                  <button type="button" id="registerBtn" onClick={(e) => this.props.signUp()}>Sign up</button>
                </form>
              </div>
            </main>
        );
    }
}

export default Login;