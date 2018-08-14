import React from 'react';
import NavContainer from './nav/nav_container';
import { Switch, Route } from 'react-router-dom';
import HomepageContainer from './homepage/homepage_container';
import LoginFormContainer from './session_form/login_form_container';
import SignupFormContainer from './session_form/signup_form_container';
import SearchContainer from './home/search_container';
import HomeShowContainer from './home/home_show_container';
import Modal from './modal/modal';
import { AuthRoute, ProtectedRoute } from '../util/route_util';

const App = ({ children }) => (
    <div className="home-page">
        <Modal />
        <div>
            <NavContainer />
            <Switch>
                <AuthRoute exact path="/login" component={LoginFormContainer} />
                <AuthRoute exact path="/signup" component={SignupFormContainer} />
                <Route exact path="/search" component={SearchContainer} />
                <Route path="/homes/:homeId" component={HomeShowContainer}/>
                <Route path="/" component={HomepageContainer} />
            </Switch>
        </div>
    </div>
);

export default App;