import { notification } from 'antd';
import axios from 'axios';
import { AUTH_LOADING, LOGIN, LOGOUT, SIGNUP } from '../types';

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_LOADING, payload: true });
    const res = await axios.post('/signin', data);
    dispatch({
      type: LOGIN,
      payload: { user: res.data.user, token: res.data.token },
    });
  } catch (err) {
    dispatch({ type: AUTH_LOADING, payload: false });
    notification.error({ message: err?.response?.data?.message });
    console.log(err);
  }
};

export const signup = (data) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_LOADING, payload: true });
    const res = await axios.post('/signup', data);
    dispatch({ type: SIGNUP });
    notification.success({ message: res.data?.message });
  } catch (err) {
    dispatch({ type: AUTH_LOADING, payload: false });
    console.log(err);
    notification.error({ message: err?.response?.data?.message });
  }
};

export const logout = () => ({ type: LOGOUT });
