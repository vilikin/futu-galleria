import React from 'react';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
import './NavBar.scss';

export const NavBar = ({title}) => (
    <header className="top-bar">
        <Link to="/">
            <span className="title">{title}</span>
        </Link>
    </header>
);

NavBar.propTypes = {
    title: PropTypes.string.isRequired
};

export default NavBar;