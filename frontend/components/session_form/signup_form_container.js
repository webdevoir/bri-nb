import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { openModal, closeModal } from '../../actions/modal_actions';
import { login, signup } from '../../actions/session_actions';
import SignUpForm from './signup_form';

const mapStateToProps = ({ session }) => ({
    loggedIn: Boolean(session.currentUser),
    formType: 'signup',
    errors: session.errors
});

const mapDispatchToProps = dispatch => ({
    processForm: user => dispatch(signup(user)),
    otherForm: () => dispatch(openModal('login')),
    closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);