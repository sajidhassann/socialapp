import { Card } from 'antd';

const PostsHeading = ({ text, ...rest }) => {
  return (
    <Card
      {...rest}
      className='border-1 card custom-heading m-2 rounded-3'
      hoverable
    >
      {text}
    </Card>
  );
};

export default PostsHeading;
