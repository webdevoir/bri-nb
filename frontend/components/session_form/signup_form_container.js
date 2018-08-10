import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { openModal, closeModal } from '../../actions/modal_actions';
import { signup } from '../../actions/session_actions';
import SignUpForm from './signup_form';

const mapStateToProps = ({ errors }) => ({
    formType: 'signup',
    errors: errors.session
});

const mapDispatchToProps = dispatch => ({
    processForm: user => dispatch(signup(user)),
    otherForm: () => dispatch(openModal('login')),
    closeModal: () => dispatch(closeModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);