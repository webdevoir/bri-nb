import {
    RECEIVE_CURRENT_USER,
    LOGOUT,
    RECEIVE_ERRORS
} from '../actions/session_actions';
import merge from 'lodash/merge';

const _nullUser = Object.freeze({
    id: null,
    errors: []
});

const SessionReducer = (state = _nullUser, action) => {
    Object.freeze(state);
    
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            const { id } = action.currentUser;
            return merge({}, { id });
        case LOGOUT:
            return _nullUser;
        case RECEIVE_ERRORS:
            const errors = action.errors;
            return merge({}, _nullUser, {
                errors
            });
        default:
            return state;
    }
};

export default SessionReducer;
