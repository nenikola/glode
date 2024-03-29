import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./routes/app/App";
import * as serviceWorker from "./serviceWorker";
import "primeicons/primeicons.css";
import "primereact/resources/themes/nova-light/theme.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
