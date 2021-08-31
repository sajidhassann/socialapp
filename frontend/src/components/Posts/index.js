import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PostsHeading from '../PostsHeading';
import ThePost from '../ThePost';
import './style.css';
import { getAllPosts } from '../../redux/actions/posts';
import dayjs from 'dayjs';

const Posts = ({ posts, token, getAllPosts }) => {
  const [headedPosts, setHeadedPosts] = useState([]);
  const makeHeadedPosts = () => {
    if (posts.length > 0) {
      let newPosts = [];
      let currentDate = posts[0].date;

      newPosts.push(
        <PostsHeading
          key={currentDate}
          text={dayjs(currentDate).format('DD. MMMM YYYY')}
        />
      );
      for (const index in posts) {
        const { id, mood, message, Likes, Dislikes, date } = posts[index];
        if (dayjs(currentDate).isSame(dayjs(date))) {
          newPosts.push(
            <ThePost
              key={id.toString()}
              id={id}
              content={message}
              emoji={mood}
              count={{ Likes, Dislikes }}
            />
          );
        } else {
          currentDate = date;
          newPosts.push(
            <PostsHeading
              key={currentDate}
              text={dayjs(currentDate).format('DD. MMMM YYYY')}
            />,
            <ThePost
              key={id.toString()}
              id={id}
              content={message}
              emoji={mood}
              count={{ Likes, Dislikes }}
            />
          );
        }
      }
      setHeadedPosts([...newPosts]);
    }
  };
  useEffect(() => {
    if (token) {
      setTimeout(() => {
        getAllPosts();
      }, 0);
    }
    return () => {};
  }, [token]);
  useEffect(() => {
    makeHeadedPosts();
    return () => {};
  }, [posts]);
  return (
    <div className='card-columns columns-2-sm columns-3-md w-100'>
      {headedPosts}
    </div>
  );
};

const mapStateToProps = ({ post: { posts }, user: { token } }) => ({
  posts,
  token,
});
const mapDispatchToProps = { getAllPosts };
export default connect(mapStateToProps, mapDispatchToProps)(Posts);
