import ReactDOM from "react-dom/client";
import React from 'react';
import $ from 'jquery';

class Login extends React.Component{
    // render login page
    render(){
        return(
            <main>
                <div className="container">
                    <h1>Login Page</h1>
                    <form action="/login_check" method="post" id="loginForm">
                        Username: <input type="text" name="username" id="username" /> <br />
                        Password: <input type="password" name="password" id="password" /> <br />
                        <button type="button" id="loginBtn" onClick={(e) => this.props.check()} className="btn btn-outline-primary">Login</button> <br />
                        <button type="button" id="registerBtn" onClick={(e) => this.props.signUp()} className="btn btn-outline-primary">Sign up</button>
                    </form>
                </div>
            </main>
        );
    }
}

export default Login;