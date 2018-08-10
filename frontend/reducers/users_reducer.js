import { merge } from 'lodash';

import { RECEIVE_CURRENT_USER } from '../actions/session_actions';

const UsersReducer = (state = {}, action) => {
    let newState = merge({}, state);
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            return merge(newState, {[action.currentUser.id]: action.currentUser});
        default:
            return state;
    }
};

export default UsersReducer;