import React from 'react';
import GreetingContainer from './greeting/greeting_container';
import Modal from './modal/modal';
import { NavLink } from 'react-router-dom';

const App = ({ children }) => (
    <div>
        <Modal />
        <header>
            <NavLink to="/" className="header-link">
                <h1>Bri-nb</h1>
            </NavLink>
            <GreetingContainer />
        </header>
    </div>
);

export default App;