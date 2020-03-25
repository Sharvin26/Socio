import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from '../types';
import axios from 'axios';

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
		.post('/login', userData)
		.then((response) => {
            const FBAuthToken = `Bearer ${response.data.token}`;
			localStorage.setItem('FBAuthToken', FBAuthToken);
            axios.defaults.headers.common['Authorization'] = FBAuthToken;
            dispatch(getUserData());
            dispatch({type: CLEAR_ERRORS});
            history.push('/');
		})
		.catch((error) => {
			dispatch({
                type: SET_ERRORS,
                payload: error.response.data
            });
		});
};

export const getUserData = () => (dispatch) => {
    axios.get('/user')
    .then((response) => {
        dispatch({
            type: SET_USER,
            payload: response.data
        })
    })
    .catch((error) => console.log(error));
};