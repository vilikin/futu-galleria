import React from 'react';
import ReactDOM from 'react-dom';

// Import global stylesheet
import './styles/global.scss';

import App from "./components/App/App";

// When hash changes (navigation event), always scroll page to the top.
window.addEventListener("hashchange", () => window.scrollTo(0, 0));

ReactDOM.render(
    <App/>,
    document.getElementById("root")
);