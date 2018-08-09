import React from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: "", password: "", first_name: "", last_name: "" };
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
        this.props.processForm(user).then(this.props.closeModal);
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
                    <div onClick={this.props.closeModal} className="close-x">X</div>
					<br />
                    {this.renderErrors()}
                    <div className="login-form">
                        <br />
                        <input type="email"
                            placeholder="Email address"
                            value={this.state.email}
                            onChange={this.update("email")}
                            className="login-input" />
                        <br />
                        <input type="text"
                            placeholder="First name"
                            value={this.state.first_name}
                            onChange={this.update("first_name")}
                            className="login-input" />
                        <input type="text"
                            placeholder="Last name"
                            value={this.state.last_name}
                            onChange={this.update("last_name")}
                            className="login-input" />
                        <input type="password"
                            placeholder="Create a Password"
                            value={this.state.password}
                            onChange={this.update("password")}
                            className="login-input" />
                        <br />
                        <button type="submit">Submit</button>
                    </div>
                </form>
                Already have an Airbnb account? <NavLink to="/login">Log in</NavLink>;
            </div>
        );
    }

}

export default withRouter(SignupForm);