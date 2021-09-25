import axios from 'axios';
import { api } from '../urlConfig';
import store from '../store';
import { authConstants, serverConstants } from '../actions/constants';

const token = window.localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: api,
    headers: {
        'Authorization': token ? `Bearer ${token}` : ''
    }
})

axiosInstance.interceptors.request.use((req) => {
    const { auth } = store.getState();
    if (auth.token) {
        req.headers.Authorization = `Bearer ${auth.token}`;
    }
    return req;
})

axiosInstance.interceptors.response.use((res) => {
    return res;
}, (error) => {
    if (error.response === undefined) {
        store.dispatch({
            type: serverConstants.SERVER_OFFLINE,
            payload: {
                msg: "Server is not running😢"
            }
        })
    } else {
        const { status } = error.response;
        if (status === 500 || status === 400) {
            localStorage.clear();
            store.dispatch({ type: authConstants.LOGOUT_SUCCESS });
        }
    }
    return Promise.reject(error);
})

export default axiosInstance