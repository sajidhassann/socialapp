import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Comment, Form, Input, List } from 'antd';
import { ImSmile2, ImSad2, ImNeutral2 } from 'react-icons/im';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { BiCommentDetail } from 'react-icons/bi';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { comment, onRating } from '../../redux/actions/posts';
const relativeTime = require('dayjs/plugin/relativeTime');
const avatar = require('generate-avatar');
dayjs.extend(relativeTime);

const ThePost = ({
  id,
  emoji,
  content = '',
  count,
  comments,
  comment,
  rated,
  onRating,
}) => {
  const ref = useRef(null);
  const formRef = useRef(null);

  const [postRated, setPostRated] = useState();
  const [postComments, setPostComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPostRated(rated?.find(({ posts_id }) => posts_id === id)?.rating);
    setPostComments(comments?.filter(({ posts_id }) => posts_id === id));
    return () => {};
  }, [rated, comments, id]);

  const onFinish = async (values) => {
    console.log('Success:', { values });
    const { message } = values;
    setLoading(true);
    await comment(id, message);
    setTimeout(() => {
      setLoading(false);
      formRef.current?.resetFields();
      ref.current?.scrollIntoView({ behvior: 'smooth', block: 'nearest' });
    }, 500);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', { errorInfo });
  };
  const numFormatter = (num) => {
    if (num > 999 && num < 1000000) {
      return num % 10 === 0 ? num / 1000 + 'K' : (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
    } else if (num >= 1000000) {
      return num % 10 === 0
        ? num / 1000000 + 'M'
        : (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
    } else if (num <= 999) {
      return num; // if value < 1000, nothing to do
    }
  };

  return (
    <Card className='border-1 card custom-card m-2 rounded-3' hoverable>
      <div className='card p-2'>
        <div className='row'>
          <div className='col-2'>
            {emoji === 1 ? (
              <ImSmile2 size={40} color='#77dd77' />
            ) : emoji === 3 ? (
              <ImSad2 size={40} color='#FAA0A0' />
            ) : emoji === 2 ? (
              <ImNeutral2 size={40} color='#CFCFC4' />
            ) : null}
          </div>
          <div className='col-10'>„{content}“</div>
          <div className='row'>
            <div className='col-9 p-0 ml-4'>
              <Button
                type={postRated === 1 ? 'primary' : 'default'}
                ghost={postRated === 1}
                // shape='circle'
                className='border-0 mr-1 bg-transparent'
                icon={<FaThumbsUp className='mx-2' size={20} />}
                onClick={() => onRating(id, postRated, 1)}
              >
                <b>{count?.Likes} Agree</b>
              </Button>
              <Button
                type={postRated === -1 ? 'primary' : 'default'}
                ghost={postRated === -1}
                // shape='circle'
                className='border-0 bg-transparent'
                icon={<FaThumbsDown className='mx-2' size={20} />}
                onClick={() => onRating(id, postRated, -1)}
              >
                <b>{count?.Dislikes} Disagree</b>
              </Button>
            </div>
            <div className='col-2 p-0 d-flex align-items-end justify-content-end'>
              <div className='d-flex align-items-centers'>
                <span className='text-primary fw-bolder mr10'>
                  {numFormatter(postComments.length)}
                </span>
                <BiCommentDetail
                  size={24}
                  textRendering={postComments.length}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          maxHeight: 250,
          overflow: 'auto',
          scrollBehavior: 'smooth',
        }}
        className='my-1'
      >
        <List
          className='comment-list bg-white rounded-2'
          itemLayout='vertical'
          dataSource={postComments}
          locale={{ emptyText: 'No comments yet' }}
          loading={loading}
          rowKey={({ id }) => id.toString()}
          renderItem={(item, i) => (
            <div
              key={item?.id.toString()}
              ref={i === postComments.length - 1 ? ref : null}
            >
              <List.Item
                itemID={item?.id.toString()}
                key={item?.id.toString()}
                className='py-2 px-3'
              >
                {item?.isAuthor ? (
                  <Badge.Ribbon text='Author'>
                    <Comment
                      author={<b>{item?.pseudonyms}</b>}
                      avatar={`data:image/svg+xml;utf8,${avatar.generateFromString(
                        item?.pseudonyms
                      )}`}
                      //'https://bulma.io/images/placeholders/128x128.png'
                      content={<p>{item?.message}</p>}
                      datetime={dayjs(item?.createdAt).fromNow()}
                    />
                  </Badge.Ribbon>
                ) : (
                  <Comment
                    author={<b>{item?.pseudonyms}</b>}
                    avatar={`data:image/svg+xml;utf8,${avatar.generateFromString(
                      item?.pseudonyms
                    )}`}
                    //'https://bulma.io/images/placeholders/128x128.png'
                    content={<p>{item?.message}</p>}
                    datetime={dayjs(item?.createdAt).fromNow()}
                  />
                )}
              </List.Item>
            </div>
          )}
        />
      </div>
      <div className='w-100'>
        <Form
          id={id}
          ref={formRef}
          className='w-100 d-flex'
          name='horizontal_login'
          layout='inline'
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className='d-flex w-100'>
            <Form.Item
              className='w-75 p-0 m-0'
              name='message'
              rules={[
                {
                  required: true,
                  message: 'Please input your comment!',
                },
              ]}
            >
              <Input.TextArea
                className='w-100'
                placeholder={`Add a comment...`}
                rows={1}
              />
            </Form.Item>
            <div className='w-25 p-0 m-0 h-100 d-flex flex-grow-1'>
              <Button
                className='w-100 h-auto'
                htmlType='submit'
                type='primary'
                loading={loading}
              >
                Comment
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Card>
  );
};

const mapStateToProps = ({ post: { comments, rated } }) => ({
  comments,
  rated,
});
const mapDispatchToProps = { onRating, comment };
export default connect(mapStateToProps, mapDispatchToProps)(ThePost);
