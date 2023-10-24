import { Button, Grid, LinearProgress, MenuItem, Paper, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userStore from '@/stores/userStore';
import { PURPOSE_CHOICES, YEAR_OF_STUDY_CHOICES } from '@/utils/constants';
import { CheckCircle } from '@mui/icons-material';
import LoadingSpinner from '../../helpers/LoadingSpinner';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { toJS } from 'mobx';

const NewRequest = observer(({ resource }) => {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestSubmittedRequest, setLatestSubmittedRequest] = useState(null);

  const user = userStore.user;
  const allRequests = resource.requests.read();

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    if (userStore.submittedRequests.length === 0) {
      const userRequests = allRequests.filter(request => request.user && request.user._id === user._id);
      userStore.setSubmittedRequests(userRequests);
    }

    if (!userStore.permissions || userStore.permissions.length === 0) {
      fetchPermissions();
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    const latestRequest = userStore.submittedRequests[userStore.submittedRequests.length - 1];
    setLatestSubmittedRequest(latestRequest);
  }, [userStore.submittedRequests]);

  async function fetchPermissions() {
    try {
      const permissionsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/permissions/user/${user._id}`);
      userStore.setPermissions(permissionsResponse.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  }

  const handleFormSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = { purpose, year_of_study: yearOfStudy, message, user: user._id, email: user.email };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/requests/new`, data);
      userStore.setSubmittedRequests([...userStore.submittedRequests, response.data.request]);
      setIsSubmitting(false);
      navigate('/requests/submitted');
    } catch (error) {
      console.error('There was an error creating the request:', error);
    }
  };

  const isPurposeAllowed = purposeKey => {
    if (!user || !userStore.permissions) return false;

    const permission = userStore.permissions.find(p => p.purpose === purposeKey);
    return permission ? permission.canRead : false;
  };

  const isRequestPending = purposeKey => {
    if (!user || !userStore.permissions) return false;

    const request = userStore.submittedRequests.find(r => r.purpose === purposeKey);
    return request && request.status === 'Pending';
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Paper elevation={3} sx={{ width: '40%', margin: '0 auto', mt: 8 }}>
      <Grid item xs={12}>
        <Typography
          variant='h5'
          align='center'
          sx={{
            backgroundColor: '#0066b2',
            color: '#fff',
            borderTopRightRadius: '5px',
            borderTopLeftRadius: '5px',
            padding: '1rem',
            mb: 2
          }}>
          Submit Request
        </Typography>
      </Grid>
      <form onSubmit={handleFormSubmit}>
        {isSubmitting ? (
          <LinearProgress />
        ) : (
          <Grid container spacing={3} sx={{ padding: 4 }}>
            <Grid item xs={8}>
              <TextField
                select
                label='Purpose'
                required
                fullWidth
                value={purpose}
                onChange={e => setPurpose(e.target.value)}>
                {Object.keys(PURPOSE_CHOICES).map((key, index) => (
                  <MenuItem key={index} value={key} disabled={isPurposeAllowed(key) || isRequestPending(key)}>
                    {PURPOSE_CHOICES[key]}
                    {isPurposeAllowed(key) ? (
                      <CheckCircle style={{ color: 'green', marginLeft: '10px' }} />
                    ) : isRequestPending(key) ? (
                      <ErrorOutlineIcon style={{ color: 'goldenrod', marginLeft: '10px' }} />
                    ) : null}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                required
                select
                label='Level'
                variant='outlined'
                value={yearOfStudy}
                onChange={e => setYearOfStudy(e.target.value)}>
                {YEAR_OF_STUDY_CHOICES.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label='Message (optional)'
                variant='outlined'
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Button type='submit' variant='contained' color='primary' style={{ marginBottom: '10px' }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        )}
      </form>
    </Paper>
  );
});

export default NewRequest;
