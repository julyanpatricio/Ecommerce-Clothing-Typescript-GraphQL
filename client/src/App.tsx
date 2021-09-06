import Home from "./components/Home/Home";
import "./App.css";
import Products from "./components/products/products";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Cart from "./components/Cart/Cart";
import Profile from "./components/Profile";
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Login/Login";

function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={NavBar} />
      <Route exact path="/" component={Home} />
      <Route exact path="/clothing/:gender" component={Products} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/cart" component={Cart} />
      <Route exact path="/profile" component={Profile} />
    </BrowserRouter>
  );
}

export default App;
