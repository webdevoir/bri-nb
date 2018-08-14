import { fetchHomes } from '../actions/home_actions';

export const UPDATE_BOUNDS = "UPDATE_BOUNDS";

export const changeFilter = bounds => ({
    type: UPDATE_BOUNDS,
    bounds
});

export function updateFilter(filter, value) {
    return (dispatch, getState) => {
        dispatch(changeFilter(filter, value));
        return fetchHomes(getState().filters)(dispatch);
    };
}