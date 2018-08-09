import React from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

class SessionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: "", password: "" };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate() {
        this.redirectIfLoggedIn();
    }

    redirectIfLoggedIn() {
        if (this.props.loggedIn) {
            this.props.history.push("/");
        }
    }

    update(field) {
        return e => this.setState({
            [field]: e.currentTarget.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = this.state;
        this.props.processForm({ user });
    }

    navLink() {
        if (this.props.formType === "login") {
            return <NavLink to="/signup">sign up instead</NavLink>;
        } else {
            return <NavLink to="/login">log in instead</NavLink>;
        }
    }

    renderErrors() {
        return (
            <ul>
                {this.props.errors.map((error, i) => (
                    <li key={`error-${i}`}>
                        {error}
                    </li>
                ))}
            </ul>
        );
    }

    render() {
        return (
            <div className="login-form-container">
                <form onSubmit={this.handleSubmit} className="login-form-box">
                    Welcome to Bri-nb!
					<br />
                    Please {this.props.formType} or {this.navLink()}
                    {this.renderErrors()}
                    <div className="login-form">
                        <br />
                        <label> Email:
							<input type="text"
                                value={this.state.email}
                                onChange={this.update("email")}
                                className="login-input" />
                        </label>
                        <br />
                        <label> Password:
							<input type="password"
                                value={this.state.password}
                                onChange={this.update("password")}
                                className="login-input" />
                        </label>
                        <br />
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        );
    }

}

export default withRouter(SessionForm);