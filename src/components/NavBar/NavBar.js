import React from 'react';
import {Link} from "react-router-dom";

import './NavBar.scss';

export const NavBar = ({title}) => (
    <header className="top-bar">
        <Link to="/">
            <span className="title">{title}</span>
        </Link>
    </header>
);

export default NavBar;