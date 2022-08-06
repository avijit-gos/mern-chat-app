/** @format */

import "./App.css";
import { Switch, Route, useHistory } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Registration from "./Pages/Registration/Registration";
import Home from "./Pages/Home/Home";
import { useEffect } from "react";

function App() {
  return (
    <div className='App'>
      <Switch>
        <Route path='/' exact component={() => <Login />} />
        <Route path='/signup' exact component={() => <Registration />} />
        <Route path='/home' exact component={() => <Home />} />
      </Switch>
    </div>
  );
}

export default App;
