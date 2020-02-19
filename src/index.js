import React from "react";
import ReactDOM from "react-dom";
import { description, version } from "../version.json";
import App from "./app";

require("../resources/styles/styles.css");

const args = [
  `\n${description} %c ver ${version} \n`,
  "background: #000; padding:5px 0;border-top-left-radius:10px;border-bottom-left-radius:10px;"
];

window.console.log.apply(console, args);

// Canvas Renderer //
window.onload = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};
