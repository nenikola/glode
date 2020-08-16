import React from "react";
import Login from "./../login/Login";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Dashboard}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
