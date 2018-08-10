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
                    <div onClick={this.props.closeModal} className="close-x">
                        <svg viewBox="0 0 24 24" role="img" aria-label="Close" focusable="false">
                            <path d="m23.25 24c-.19 0-.38-.07-.53-.22l-10.72-10.72-10.72 10.72c-.29.29-.77.29-1.06 0s-.29-.77 0-1.06l10.72-10.72-10.72-10.72c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l10.72 10.72 10.72-10.72c.29-.29.77-.29 1.06 0s .29.77 0 1.06l-10.72 10.72 10.72 10.72c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22" fillRule="evenodd">
                            </path>
                        </svg>
                    </div>
					<br />
                    {this.renderErrors()}
                    <div className="login-form">
                        <br />
                        <input type="email"
                            placeholder="Email address"
                            value={this.state.email}
                            onChange={this.update("email")}
                            className="login-input" />
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
                        <button type="submit">Sign up</button>
                    </div>
                    <div className="line-container"><div className="line"></div></div>
                    <div className='redirect'>
                        <span>Already have an Airbnb account? </span>
                        <span>
                            <a onClick={() => this.props.otherForm()}>
                                Log in
                            </a>
                        </span>
                    </div>
                </form>
            </div>
        );
    }

}

export default withRouter(SignupForm);