import React from 'react';
import NavContainer from './nav/nav_container';
import HomepageContainer from './homepage/homepage_container';
import Modal from './modal/modal';
import { NavLink } from 'react-router-dom';

const App = ({ children }) => (
    <div className="home-page">
        <Modal />
        <div>
            <NavContainer />
            <HomepageContainer />
        </div>
    </div>
);

export default App;