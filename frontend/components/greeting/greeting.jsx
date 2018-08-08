import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';

const sessionLinks = () => (
    <nav className="login-signup">
        <NavLink to="/login" activeClassName="current">Login</NavLink>
        &nbsp;or&nbsp;
        <NavLink to="/signup" activeClassName="current">Sign up!</NavLink>
    </nav>
);

const personalGreeting = (currentUser, logout) => (
    <hgroup className="header-group">
        <h2 className="header-name">Hi, {currentUser.username}!</h2>
        <button className="header-button" onClick={logout}>Log Out</button>
    </hgroup>
);

const Greeting = ({ currentUser, logout }) => (
    currentUser ? personalGreeting(currentUser, logout) : sessionLinks()
);

export default withRouter(Greeting);