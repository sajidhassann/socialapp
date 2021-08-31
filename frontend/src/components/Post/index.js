import { ImSmile2, ImSad2, ImNeutral2 } from 'react-icons/im';

import { Card } from 'antd';

const Post = ({ emoji, content, ...rest }) => {
  return (
    <Card
      {...rest}
      className='border-1 card custom-card m-2 rounded-3'
      hoverable
    >
      {emoji === 1 ? (
        <ImSmile2 size={40} color='#77dd77' />
      ) : emoji === 3 ? (
        <ImSad2 size={40} color='#FAA0A0' />
      ) : emoji === 2 ? (
        <ImNeutral2 size={40} color='#CFCFC4' />
      ) : null}
      „<i>{content}</i>“
    </Card>
  );
};

export default Post;
