import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


import "./styles.css";

function GobangLogin() {
  return (
    <form>
      <h1>Gobang</h1>
      <label htmlFor="username">Username or Email:</label>
      <input type="text" id="username" name="username" />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" />
      <button>Login</button>
      <div>
        Don't have an account? <Link to="/register">Register here.</Link>
      </div>
    </form>
  );
}


function GobangRegister() {
  return (
    <form>
      <h1>Gobang</h1>
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" />
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" name="username" />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" />
      <button>Sign up</button>
      <div>
      Already have an account? <Link to="/login">Login here.</Link>
      </div>
    </form>
  );
}

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <GobangLogin />
        </Route>
        <Route path="/login">
          <GobangLogin />
        </Route>
        <Route path="/register">
          <GobangRegister />
        </Route>
      </Switch>
    </Router>
  );
}


export default App;
