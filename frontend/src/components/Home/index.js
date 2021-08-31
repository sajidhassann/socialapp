import { Layout } from 'antd';
import NewPost from '../NewPost';
import Posts from '../Posts';
import { FiSettings } from 'react-icons/fi';
import { useState } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/user';
import Settings from '../Settings';
const { Header, Content } = Layout;

const Home = ({ logout }) => {
  const [settings, setSettings] = useState(false);
  const toggle = () => setSettings(!settings);
  return (
    <Layout className='bg-white'>
      <Header
        className='position-fixed w-100 d-flex justify-content-between align-items-center'
        style={{ zIndex: 1000 }}
      >
        <h4 className='text-uppercase text-white'>TribeVibe</h4>
        {/* <Button onClick={}>
          <b>Logout</b>
        </Button> */}
        <FiSettings
          onClick={toggle}
          style={{ cursor: 'pointer' }}
          color='white'
          size={25}
        />
      </Header>
      <Content className='mt-5'>
        <div className='mt-3 p-3 w-100'>
          <NewPost />
          <Posts />
        </div>
        <Settings settings={settings} toggle={toggle} logout={logout} />
      </Content>
    </Layout>
  );
};

const mapStateToProps = ({ post: { comments, rated } }) => ({
  comments,
  rated,
});
const mapDispatchToProps = { logout };
export default connect(mapStateToProps, mapDispatchToProps)(Home);
