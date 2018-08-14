import merge from 'lodash/merge';

import { UPDATE_BOUNDS } from '../actions/filter_actions';

const filtersReducer = (state = {}, action) => {
    Object.freeze(state);
    let newState = merge({}, state);

    switch (action.type) {
        case UPDATE_BOUNDS:
            return action.bounds;
        default:
            return state;
    }
};

export default filtersReducer;