import { useState } from 'react';
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  List,
  Modal,
  notification,
} from 'antd';
import axios from 'axios';
import { RiLockPasswordLine } from 'react-icons/ri';
import { CgLogOut } from 'react-icons/cg';

const Settings = ({ settings, toggle, logout }) => {
  const [changePassword, setChangePassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const onFinish = async (values) => {
    console.log('Success:', values);
    setPasswordLoading(true);
    try {
      const res = await axios.put('/users/changePassword', values);
      const { success, message } = res.data || {};
      if (success) {
        notification.success({ message });
        setTimeout(toggleModal, 100);
      }
    } catch (err) {
      console.log({ err });
      notification.error({ message: err.response.data.message });
    }
    setPasswordLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const toggleModal = () => setChangePassword(!changePassword);
  return (
    <Drawer title='Settings' visible={settings} onClose={toggle} width='25%'>
      {/* <div
        onClick={toggleModal}
        style={{ cursor: 'pointer' }}
        className='d-flex align-items-center'
      >
        <RiLockPasswordLine size={24} />
        <span className='ant-modal-title fs-5 ml-2'>Change Password</span>
      </div>
      <Divider />
      <div
        style={{ cursor: 'pointer' }}
        onClick={logout}
        className='d-flex align-items-center'
      >
        <CgLogOut size={25} />
        <span className='ant-modal-title fs-5 ml-2'>Logout</span>
      </div> */}
      <List
        size='large'
        // bordered
        dataSource={[
          {
            icon: <RiLockPasswordLine size={24} />,
            name: 'Change Password',
            onClick: toggleModal,
          },
          { icon: <CgLogOut size={25} />, name: 'Logout', onClick: logout },
        ]}
        renderItem={({ icon, name, onClick }) => (
          <List.Item>
            <div
              style={{ cursor: 'pointer' }}
              onClick={onClick}
              className='d-flex align-items-center'
            >
              {icon}
              <span className='ant-modal-title fs-5 ml-2'>{name}</span>
            </div>
          </List.Item>
        )}
      />
      <Modal
        title='Change Password'
        visible={changePassword}
        onOk={toggle}
        confirmLoading={passwordLoading}
        onCancel={toggleModal}
        footer={[
          <Button key='back' onClick={toggleModal}>
            Cancel
          </Button>,
          <Button
            form='changePassword'
            formAction='submit'
            htmlType='submit'
            key='submit'
            type='primary'
            loading={passwordLoading}
          >
            Change Password
          </Button>,
        ]}
      >
        <Form
          id='changePassword'
          name='changePassword'
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label='Old Password'
            name='oldPassword'
            rules={[
              {
                required: true,
                message: 'Please input your old password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label='Password'
            name='newPassword'
            rules={[
              {
                required: true,
                message: 'Please input your new password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Drawer>
  );
};

export default Settings;
