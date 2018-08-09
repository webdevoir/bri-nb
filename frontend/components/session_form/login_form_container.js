import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { openModal, closeModal } from '../../actions/modal_actions';
import { login, signup } from '../../actions/session_actions';
import LoginForm from './login_form';

const mapStateToProps = ({ session }) => ({
    formType: 'login',
    errors: session.errors
});

const mapDispatchToProps = dispatch => ({
    processForm: user => dispatch(login(user)),
    otherForm: () => dispatch(openModal('signup')),
    closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);