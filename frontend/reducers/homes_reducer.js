import merge from 'lodash/merge';

import {
    RECEIVE_HOMES,
    RECEIVE_HOME,
} from '../actions/home_actions';

const homesReducer = (state = {}, action) => {
    Object.freeze(state);
    let newState = merge({}, state);

    switch (action.type) {
        case RECEIVE_HOMES:
            return action.homes;
        case RECEIVE_HOME:
            const newHome = {
                [action.home.id]: action.home
            };
            return merge(newState, newHome);
        // case RECEIVE_REVIEW:
        //     const {
        //         review,
        //         average_rating
        //     } = action;
        //     const newState = merge({}, state);
        //     newState[review.home_id].reviewIds.push(review.id);
        //     newState[review.home_id].average_rating = average_rating;
        //     return newState;
        default:
            return state;
    }
};

export default homesReducer;