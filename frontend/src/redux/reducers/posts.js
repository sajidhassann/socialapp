import { ADD_RATING, GET_POSTS, LOGOUT } from '../types';

const initialState = {
  posts: [],
  comments: [],
  rated: [],
};

const postReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        ...payload,
      };
    case ADD_RATING:
      const index = state.rated?.findIndex(
        ({ posts_id }) => posts_id === payload.posts_id
      );
      if (index === -1) state.rated = [payload, ...state.rated];
      else state.rated[index] = payload;
      return {
        ...state,
        rated: [...state.rated],
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default postReducer;
