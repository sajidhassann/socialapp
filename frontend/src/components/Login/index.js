import { Button, Card, Form, Input, Typography } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../../redux/actions/user';

const Login = ({ login, loading }) => {
  const onFinish = (values) => {
    console.log('Success:', values);
    login(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div
      style={{ height: '100vh' }}
      className='d-flex justify-content-center align-items-center'
    >
      {/* <div className='d-flex align-items-center w-100'> */}
      <Card
        // style={{ transform: 'translateX(0%) translateY(60%)' }}
        className='w-75'
        hoverable
      >
        <Typography.Title level={2} className='text-center text-uppercase'>
          TribeVibe
        </Typography.Title>
        <Form
          name='basic'
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label='Email'
            name='email'
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input type='email' />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 20,
            }}
          >
            Don't have an account!{' '}
            <Typography.Text>
              <Link to='signup'>Signup</Link>
            </Typography.Text>
            <Typography.Text className='float-end'>
              <Link to='forgetPassword'>Forget Password</Link>
            </Typography.Text>
          </Form.Item>
          <Button
            className='float-end w-25'
            type='primary'
            htmlType='submit'
            loading={loading}
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

const mapStateToProps = ({ user: { loading } }) => ({
  loading,
});
const mapDispatchToProps = { login };
export default connect(mapStateToProps, mapDispatchToProps)(Login);
