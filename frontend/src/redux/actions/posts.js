import axios from 'axios';
import { ADD_RATING, GET_POSTS } from '../types';

export const getAllPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/posts/getEverything');
    // console.log(res.data);
    const { posts, comments, rated } = res.data;
    dispatch({
      type: GET_POSTS,
      payload: { posts, comments, rated },
    });
  } catch (err) {
    console.log({ err });
  }
};
export const onRating = (id, postRated, rating) => async (dispatch) => {
  if (rating !== postRated) {
    try {
      const res = await axios.put('/ratings/edit/' + id, {
        rating,
      });
      if (res.data.success) {
        // dispatch({ type: ADD_RATING, payload: { rating, posts_id: id } });
        dispatch(getAllPosts());
      }
    } catch (err) {
      console.log({ err });
    }
  }
};

// const getRatings = async (rating) => {
//     try {
//       const res = await axios.get('/ratings/getByPostID/' + activePost?.id);
//       setActivePost({
//         ...activePost,
//         count: res?.data ? res.data : { Likes: 0, Dislikes: 0 },
//         rated: rating === '' ? -1000 : rating,
//       });
//     } catch (err) {
//       console.log({ err });
//     }
//   };

// const getComments = async () => {
//     try {
//       const res = await axios.get('/comments/getByPostID/' + activePost?.id);
//       setActivePost({ ...activePost, comments: res.data });
//     } catch (err) {
//       console.log({ err });
//     }
//   };

export const comment = (id, message) => async (dispatch) => {
  try {
    const res = await axios.post('/comments/post', {
      message,
      posts_id: id,
    });
    dispatch(getAllPosts());
    //   await getComments();
  } catch (err) {
    console.log({ err });
  }
};
