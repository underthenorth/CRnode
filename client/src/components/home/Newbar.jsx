import CloudLogo from '@/assets/images/logo.png';
import userStore from '@/stores/userStore';
import { navlinks as links, sideMenuLinks } from '@/utils/constants';
import { LogoutOutlined, MenuOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Drawer, Dropdown, List, Typography } from 'antd';
import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Newbar.css';

const { Text } = Typography;

const Newbar = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [activeIndex, setActiveIndex] = useState(0);
  const navbarRef = useRef(null);
  const horiSelectorRef = useRef(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [activeIndicatorStyle, setActiveIndicatorStyle] = useState({ width: 0, left: 0 });

  const findActiveIndex = () => {
    return links.findIndex(link => location.pathname === link.endpoint);
  };

  useEffect(() => {
    const currentActiveIndex = findActiveIndex();
    setActiveIndex(currentActiveIndex);
  }, [location]);

  const handleNavCollapse = () => {
    setDrawerVisible(!drawerVisible);
  };

  const handleLogout = () => {
    userStore.setUser(null);
    userStore.setArticles([]);
    userStore.setSubmittedRequests([]);
    userStore.setFeedbacks([]);
    userStore.setPurposes([]);
    userStore.setCanRead([]);
    userStore.setCanWrite([]);
    localStorage.removeItem('CloudRoundsToken');
    localStorage.removeItem('CloudRoundsUser');

    navigate('/login');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  if (!user) {
    return null;
  }

  const getInitials = user => {
    if (user && user.firstName && user.lastName) {
      return user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase();
    }
    return '';
  };

  const isActive = path => location.pathname === path;

  const drawerItems = [
    ...sideMenuLinks.map(link => ({
      key: link.endpoint,
      content: (
        <button
          type='button'
          className={`drawer-item ${isActive(link.endpoint) ? 'active' : ''}`}
          onClick={() => {
            navigate(link.endpoint);
            setDrawerVisible(false);
          }}>
          <link.Icon className='text-lg' />
          <span className='mt-1'>{link.label}</span>
        </button>
      )
    })),
    {
      key: 'logout',
      content: (
        <button type='button' className={`drawer-item`} onClick={handleLogout}>
          <LogoutOutlined className='text-lg' />
          <span className='mt-1'>Log Out</span>
        </button>
      )
    }
  ];

  const drawerItemStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%'
  };

  const items = [
    {
      key: '0',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => handleSettingsClick()
    },
    {
      key: '1',
      label: 'Log Out',
      icon: <LogoutOutlined />,
      onClick: () => handleLogout()
    }
  ];

  const navlinkItems = links.map((link, index) => ({
    key: link.endpoint,
    icon: link.Icon || null,
    onClick: () => {
      setActiveIndex(index);
      navigate(link.endpoint);
    }
  }));

  const avatarMenuItem = {
    key: 'userDropdown',
    label: (
      <div className='flex items-center w-[64px] justify-center'>
        <Dropdown menu={{ items }} overlayStyle={{ top: '52px' }}>
          <Avatar className='cursor-pointer'>{getInitials(user)}</Avatar>
        </Dropdown>
      </div>
    )
  };

  const navbarDesktopItems = [...navlinkItems, avatarMenuItem];

  return (
    <nav ref={navbarRef} className='navbar-mainbg p-0 flex justify-between items-center h-16'>
      <div className={`navbar-logo`}>
        <Link to='/' className='flex items-center space-x-2 text-white text-lg p-3'>
          <img src={CloudLogo} width='40' alt='CloudRounds Logo' />
          <span className='text-white text-lg ml-2'>CloudRounds</span>
        </Link>
      </div>

      <Drawer
        title={
          <div className='flex items-center text-gray-700 justify-center'>
            <Text code className='text-lg'>
              Menu
            </Text>
          </div>
        }
        placement='right'
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={150}>
        <List
          itemLayout='horizontal'
          dataSource={drawerItems}
          renderItem={item => <List.Item style={{ padding: '12px 0', ...drawerItemStyle }}>{item.content}</List.Item>}
        />
      </Drawer>
      <div id='navbar-animmenu'>
        <ul className='show-dropdown main-navbar'>
          {navbarDesktopItems.map((item, index) => (
            <li
              key={item.key}
              className={`relative p-2 pb-[0px] rounded-full ${index === activeIndex ? 'active' : ''}`}
              onClick={item.onClick}>
              {item.label ? (
                item.label
              ) : (
                <Link className='flex items-center justify-center' style={{ height: '36px' }}>
                  <item.icon />
                </Link>
              )}
              <div
                className={`${index === activeIndex ? '' : 'hidden'}`}
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '6px',
                  width: '52px',
                  height: '3px',
                  backgroundColor: '#fff',
                  borderTopLeftRadius: '20px',
                  borderTopRightRadius: '20px'
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      <div id='navbar-mobile'>
        <button className='p-3 text-white' onClick={handleNavCollapse}>
          <MenuOutlined />
        </button>
      </div>
    </nav>
  );
});

export default Newbar;
