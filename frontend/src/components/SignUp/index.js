import { Button, Card, Form, Input, Typography } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { signup } from '../../redux/actions/user';

const SignUp = ({ signup, loading }) => {
  const onFinish = (values) => {
    console.log('Success:', values);
    signup(values);
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
        // style={{ transform: 'translateX(0%) translateY(30%)' }}
        className='w-75'
        hoverable
      >
        <Typography.Title className='text-center text-uppercase'>
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
            label='First Name'
            name='firstname'
            rules={[
              {
                required: true,
                message: 'Please input your first name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Last Name'
            name='lastname'
            rules={[
              {
                required: true,
                message: 'Please input your last name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
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
            Already have an account!{' '}
            <Typography.Text>
              <Link to='login'>Login</Link>
            </Typography.Text>
            <Button
              className='float-end w-25'
              type='primary'
              htmlType='submit'
              loading={loading}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const mapStateToProps = ({ user: { loading } }) => ({
  loading,
});
const mapDispatchToProps = { signup };
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
