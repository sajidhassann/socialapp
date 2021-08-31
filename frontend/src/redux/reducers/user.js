import { LOGIN, SIGNUP, LOGOUT, AUTH_LOADING } from '../types';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
  loading: false,
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN:
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
      return {
        ...state,
        ...payload,
        loading: false,
      };
    case SIGNUP:
      return {
        ...state,
        loading: false,
      };
    case AUTH_LOADING:
      return {
        ...state,
        loading: payload,
      };
    case LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { user: undefined, token: undefined, loading: false };
    default:
      return state;
  }
};

export default userReducer;
