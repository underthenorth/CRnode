import React, { useState } from 'react';
import { TableCell, Badge, Typography, Box, Dialog, DialogContent, DialogTitle, IconButton, Button } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import './Modal.css';
import EngineeringIcon from '@mui/icons-material/Engineering';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LinkIcon from '@mui/icons-material/Link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HttpsIcon from '@mui/icons-material/Https';

const purposeIcons = {
  OM1: <EngineeringIcon />,
  UOFTAMR: <RocketLaunchIcon />
  // Add other purpose choices and their icons here
};


const CalendarCell = ({ day, month, year, events, setSelected }) => {
  const [open, setOpen] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const handleCellClick = () => {
    setSelected(day);
    if (events.length === 0) return;
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentEventIndex(0);
  };

  const handleNextEvent = () => {
    setCurrentEventIndex(prevIndex => Math.min(prevIndex + 1, events.length - 1));
  };

  const handlePrevEvent = () => {
    setCurrentEventIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const badgeStyle = {
    position: 'absolute',
    top: 15,
    right: day > 9 ? 15 : 19.5
    //    opacity: selected === day ? 1 : 0.8
  };

  const cellStyle = {
    cursor: 'pointer',
    position: 'relative',
    height: '20px',
    alignItems: 'center',
    padding: '1rem',
    borderRadius: '50%'
  };

  const article = events[currentEventIndex] || {};

  return (
    <>
      <TableCell style={cellStyle} onClick={handleCellClick}>
        <Box
          sx={{
            display: 'flex',
            backgroundColor:
              day === currentDay && month === currentMonth && year === currentYear ? '#318CE7' : 'transparent',
            borderRadius: '5px',
            p: '3px',
            border: day === currentDay && month === currentMonth && year === currentYear ? '2px ridge black' : 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Badge badgeContent={events.length} color='primary' sx={badgeStyle} />

          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: '700',
              color: day === currentDay && month === currentMonth && year === currentYear ? 'white' : 'inherit'
            }}>
            {day}
          </Typography>
        </Box>
      </TableCell>

      <Dialog open={open} onClose={handleClose}>
          
        <DialogContent className='modal-title'>{article.title}
         
          <Box className='modal-info'>
                  
              <p className='modal-purpose'>
            
                <AccessTimeIcon/>{'\u00A0'}{'\u00A0'}{'\u00A0'}
                    {article.dateString} {'\u00A0'} |{'\u00A0'} {'\u00A0'} 
                 {article.time}
              </p>

            <p className='modal-purpose'>
          {purposeIcons[article.purpose]}  {'\u00A0'}   {'\u00A0'}    {article.purpose || 'None'}   
            </p>
          <p className='modal-purpose'>
  <LinkIcon /> {'\u00A0'} {'\u00A0'} 
  <Button
    variant='contained'
    color='primary'
    onClick={() => window.open(article.event_link, '_blank')}
    size='small'
    sx={{ textTransform: 'none' }}
  >
    Join Meeting
  </Button>
</p>
<p className='modal-purpose'>
  <HttpsIcon /> {'\u00A0'} {'\u00A0'} Meeting ID: {article.meeting_id || 'None'} {'\u00A0'} | {'\u00A0'} {'\u00A0'}
  Passcode: {article.passcode || 'None'}
</p>

        
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton onClick={handlePrevEvent} disabled={currentEventIndex === 0}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNextEvent} disabled={currentEventIndex === events.length - 1}>
              {/* Add a badge to show event number out of the total events */}
              {events.length > 1 && (
                <Typography sx={{ fontSize: '14px', fontWeight: '900', color: 'black' }}>
                  {`${currentEventIndex + 1}/${events.length}`}
                </Typography>
              )}

              <ChevronRight />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarCell;
