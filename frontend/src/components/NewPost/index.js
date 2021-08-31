import { useRef, useState } from 'react';
import { Button, Form, Input, Space } from 'antd';
import axios from 'axios';
import { ImSmile2, ImSad2, ImNeutral2 } from 'react-icons/im';
import { connect } from 'react-redux';
import { getAllPosts } from '../../redux/actions/posts';

const NewPost = ({ getAllPosts }) => {
  const [loading, setLoading] = useState();
  const [mood, setMood] = useState(0);
  const ref = useRef(null);
  const onEmoji = (id) => () => setMood(mood === id ? 0 : id);

  const post = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post('/posts/create', data);
      console.log(res.data);
      await getAllPosts();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log({ err });
    }
  };

  const onFinish = async (values) => {
    console.log('Success:', { values });
    const { message } = values;
    await post({ message, mood });
    setMood(0);
    ref.current?.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', { errorInfo });
  };
  return (
    <Form
      ref={ref}
      // className='position-sticky top-0 bg-white'
      // style={{ zIndex: 1020 }}
      name='basic'
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name='message'
        rules={[
          {
            required: true,
            message: 'Please input your message!',
          },
        ]}
      >
        <Input.TextArea placeholder={`What's on your mind...`} rows={5} />
      </Form.Item>
      <Form.Item>
        <Space>
          Select your mood:
          <Button
            className='border-0'
            type={mood === 1 ? 'primary' : 'default'}
            shape='circle'
            icon={<ImSmile2 size={30} color='#77dd77' />}
            ghost={mood === 1}
            onClick={onEmoji(1)}
          />
          <Button
            className='border-0'
            type={mood === 2 ? 'primary' : 'default'}
            shape='circle'
            icon={<ImNeutral2 size={30} color='#CFCFC4' />}
            ghost={mood === 2}
            onClick={onEmoji(2)}
          />
          <Button
            className='border-0'
            type={mood === 3 ? 'primary' : 'default'}
            shape='circle'
            icon={<ImSad2 size={30} color='#FAA0A0' />}
            ghost={mood === 3}
            onClick={onEmoji(3)}
          />
        </Space>
        <Button
          className='float-end w-25'
          htmlType='submit'
          loading={loading}
          type='primary'
        >
          Post
        </Button>
      </Form.Item>
    </Form>
  );
};

const mapStateToProps = ({}) => ({});
const mapDispatchToProps = { getAllPosts };
export default connect(mapStateToProps, mapDispatchToProps)(NewPost);
