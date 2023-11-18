import { DownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Drawer, Dropdown, Input, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { FcCalendar } from 'react-icons/fc';

const ActionBar = ({
  selectedPurposes,
  setSelectedPurposes,
  toggleNewArticleModal,
  selectedOrganizers,
  organizerFilter,
  setOrganizerFilter,
  userPurposes,
  emptyPurposes
}) => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const [currentTime, setCurrentTime] = useState(formattedTime);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const allowedPurposes = userPurposes.map(purpose => purpose.name);

  const filteredPurposes = allowedPurposes.filter(p => p && p.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePurposeToggle = purpose => {
    let newPurposes = [...selectedPurposes];
    if (newPurposes.includes(purpose)) {
      newPurposes = newPurposes.filter(p => p !== purpose);
    } else {
      newPurposes.push(purpose);
    }
    setSelectedPurposes(newPurposes);
  };

  const handleOrganizerToggle = organizer => {
    let newOrganizers = [...organizerFilter];
    if (newOrganizers.includes(organizer)) {
      newOrganizers = newOrganizers.filter(o => o !== organizer);
    } else {
      newOrganizers.push(organizer);
    }
    setOrganizerFilter(newOrganizers);
  };

  const selectAllPurposes = () => {
    setSelectedPurposes(filteredPurposes);
  };

  const deselectAllPurposes = () => {
    setSelectedPurposes([]);
  };

  const selectAllOrganizers = () => {
    setOrganizerFilter(selectedOrganizers);
  };

  const deselectAllOrganizers = () => {
    setOrganizerFilter([]);
  };

  const dropdownItems = [
    {
      key: '1',
      label: 'All',
      onClick: () => selectAllPurposes()
    },
    {
      key: '2',
      label: 'None',
      onClick: () => deselectAllPurposes()
    },
    ...userPurposes.map((purpose, index) => ({
      key: index + 3,
      label: purpose.name,
      onClick: () => setSelectedPurposes(purpose.name)
    }))
  ];

  return (
    <div className='relative flex w-full' >
      <Button
        onClick={() => setShowSidebar(!showSidebar)}
        icon={showSidebar ? <LeftOutlined /> : <RightOutlined />}
        className='absolute top-3'
      />
      {/* LEFT SIDEBAR: Article Filters */}
      <Drawer
        style={{ backgroundColor: '#c8d3fb' }}
        title='Filters'
        placement='left'
        closable={true}
        onClose={() => setShowSidebar(false)}
        open={showSidebar}
        width={250}
        closeIcon={<RightOutlined />}>
        <Input placeholder='Search...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

        <Divider>Calendars</Divider>
        <div className='flex justify-between'>
          <Dropdown
            menu={{
              items: dropdownItems,
              triggerSubMenuAction: 'click'
            }}
            trigger={['click']}>
            <Typography.Link>
              <Space>
                Options
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        </div>
        <Space direction='vertical' className='w-full mt-4'>
          {filteredPurposes.map(purpose => (
            <Checkbox
              disabled={emptyPurposes.includes(purpose)}
              key={purpose}
              checked={selectedPurposes.includes(purpose)}
              onChange={() => handlePurposeToggle(purpose)}>
              {purpose}
            </Checkbox>
          ))}
        </Space>

        <Divider>Organizers</Divider>
        <div className='flex justify-between'>
          <Button size='small' onClick={selectAllOrganizers}>
            Select All
          </Button>
          <Button size='small' onClick={deselectAllOrganizers}>
            Deselect All
          </Button>
        </div>
        <Space direction='vertical' className='w-full mt-4'>
          {selectedOrganizers.map(organizer => (
            <Checkbox
              key={organizer}
              checked={organizerFilter.includes(organizer)}
              onChange={() => handleOrganizerToggle(organizer)}>
              {organizer}
            </Checkbox>
          ))}
        </Space>
      </Drawer>

      {/* Horizontal Bar below Navbar */}
      {/* Display most recent upcoming event details */}

<<<<<<< Updated upstream
      <Space className='flex justify-end items-center w-full px-4 py-3.5 mb-5 bg-gray-100' style={{ background: '#c7d2fe'}}>
=======
      <Space className='flex justify-end items-center w-full px-4 py-3.5 mb-5 bg-[#c8d3fb]'>
>>>>>>> Stashed changes
        <button className='flex items-center basic-btn purple-light-full' onClick={toggleNewArticleModal}>
          <span style={{ marginRight: '8px' }}>
            <FcCalendar />
          </span>
          <span style={{ fontWeight: 'bold' }}>Create Event</span>{' '}
        </button>
        <p className='text-gray-600 text-sm'>{currentTime}</p>
      </Space>
    </div>
  );
};

export default ActionBar;
