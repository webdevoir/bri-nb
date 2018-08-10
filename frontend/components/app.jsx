import React from 'react';
import NavContainer from './nav/nav_container';
import Modal from './modal/modal';
import { NavLink } from 'react-router-dom';

const App = ({ children }) => (
    <div className="home-page">
        <Modal />
        <div className="full">
            <NavContainer />
            <div className="home-searchbar">
                <input type="text" placeholder="Try 'Homes in Seoul'"/>
            </div>
        </div>
    </div>
);

export default App;