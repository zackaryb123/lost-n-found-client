import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';
import {SubmissionError} from "redux-form";

export const FETCH_STATES_DATA_SUCCESS = 'FETCH_STATES_DATA_SUCCESS';
export const fetchStatesDataSuccess = data => ({
    type: FETCH_STATES_DATA_SUCCESS,
    data
});

export const FETCH_STATES_DATA_ERROR = 'FETCH_STATES_DATA_ERROR';
export const fetchStatesDataError = error => ({
    type: FETCH_STATES_DATA_ERROR,
    error
});

export const fetchStatesData = () => (dispatch, getState) => {
    const authToken = getState().auth.authToken;
    return fetch(`${API_BASE_URL}/states`, {
        //mode: 'no-cors',
        method: 'GET',
        headers: {
            // Provide our auth token as credentials
            Accept : 'application/json',
            Authorization: `Bearer ${authToken}`
        }
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then((data) => {
            dispatch(fetchStatesDataSuccess(data));
        })
        .catch(err => {
            dispatch(fetchStatesDataError(err));
        });
};

export const postItem = item => (dispatch, getState) => {
    const authToken = getState().auth.authToken;
    return fetch(`${API_BASE_URL}/states/post`, {        //mode: 'no-cors',
        method: 'PUT',
        headers: {
            // Provide our auth token as credentials
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(item)
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .catch(err => {
            const {reason, message, location} = err;
            if (reason === 'ValidationError') {
                // Convert ValidationErrors into SubmissionErrors for Redux Form
                return Promise.reject(
                    new SubmissionError({
                        [location]: message
                    })
                );
            }
        });
};