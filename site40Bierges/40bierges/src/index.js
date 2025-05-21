import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

// styles
import "./assets/css/main.css";

// pages
import Index from "./views/Index.js";
import Admin from './views/admin/admin';
import AdminShadow from './views/admin/AdminShadow';
import Login from './views/login/login';
import Blog from './views/blog/blog';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/admin" render={props => <Admin {...props} />} />
      <Route exact path="/admin-shadow" render={props => <AdminShadow {...props} />} />
      <Route exact path="/login" render={props => <Login {...props} />} />
      <Route exact path="/blog" render={props => <Blog {...props} />} />
      <Route path="/index" render={props => <Index {...props} />} />
      <Redirect to="/index" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

// ===  BACKDOOR CLAVIER : CTRL + SHIFT + B ===
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === "KeyB") {
    if (document.getElementById("backdoor-password-box")) return;

    const input = document.createElement("input");
    input.type = "password";
    input.placeholder = "Mot de passe admin";
    input.id = "backdoor-password-box";

    Object.assign(input.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "10px",
      zIndex: 9999,
      border: "1px solid #ccc",
      borderRadius: "5px",
      boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      fontSize: "16px"
    });

    input.onkeydown = (ev) => {
      if (ev.key === "Enter") {
        if (input.value === "admin123") {
          window.location.href = "/admin-shadow"; // 👈 Redirige vers le faux admin
        } else {
          alert("Mot de passe incorrect");
          input.remove();
        }
      }
    };

    document.body.appendChild(input);
    input.focus();
  }
});
