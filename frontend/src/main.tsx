import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { SmoothScroll } from "./components/layout/SmoothScroll";
import { Cursor } from "./components/layout/Cursor";
import { Loader } from "./components/layout/Loader";
import { Grain } from "./components/layout/Grain";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <SmoothScroll>
        <Grain />
        <Loader />
        <Cursor />
        <App />
      </SmoothScroll>
    </HashRouter>
  </React.StrictMode>,
);
