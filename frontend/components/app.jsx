import React from 'react';
import NavContainer from './nav/nav_container';
import Modal from './modal/modal';
import { NavLink } from 'react-router-dom';

const App = ({ children }) => (
    <div>
        <Modal />
        <NavContainer />
        <header>
            <NavLink to="/" className="header-link">
                <h1>Bri-nb</h1>
            </NavLink>
        </header>
    </div>
);

export default App;