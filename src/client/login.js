import ReactDOM from "react-dom/client";
import React from 'react';
import $ from 'jquery';

class Login extends React.Component{
    // render login page
    render(){
        return(
            <main>
      <div className="container" style={{maxWidth: '800px', margin: '0 auto'}}>
        <h1>Login Page</h1>
        <form action="/login_check" method="post" id="loginForm">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" className="form-control" id="username" name="username" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" className="form-control" id="password" name="password" />
          </div>
          <button type="button" id="loginBtn" onClick={(e) => this.props.check()} className="btn btn-primary">Login</button>
          <button type="button" id="registerBtn" onClick={(e) => this.props.signUp()} className="btn btn-primary">Sign up</button>
        </form>
      </div>
    </main>
        );
    }
}

export default Login;