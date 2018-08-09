import React from 'react';

class Nav extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { openModal, currentUser, logout } = this.props;

        const sessionLinks = () => (
            <nav className="login-signup">
                <button onClick={() => openModal('login')}>Login</button>
                &nbsp;or&nbsp;
                <button onClick={() => openModal('signup')}>Signup</button>
            </nav>
        );

        const personalGreeting = () => (
            <hgroup className="header-group">
                <h2 className="header-name">Hi, {currentUser.first_name}!</h2>
                <button className="header-button" onClick={logout}>Log Out</button>
            </hgroup>
        );


        return (
            currentUser ?
                personalGreeting(currentUser, logout) :
                sessionLinks()
        );
    }
}

export default Nav;