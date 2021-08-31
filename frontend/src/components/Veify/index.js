import { notification } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const Verify = ({ location: { pathname } }) => {
  const verify = async () => {
    try {
      const res = await axios.put('/verifyEmail', {
        id: pathname.split('verify/')[1],
      });
      notification.success({ message: res.data.message });
    } catch (err) {
      console.log({ err });
      notification.error({ message: err.response.data.message });
    }
  };
  useEffect(() => {
    verify();
    return () => {};
  }, []);
  return <Redirect to='/login' />;
};

export default Verify;
