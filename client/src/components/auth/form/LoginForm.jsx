import { useState } from 'react';
import InputField from '../fields/InputField';
import GoogleButton from '../buttons/GoogleButton';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/userStore';
import { fetchUserPermissions } from '@/services/permissions';
import { fetchUserFeedbacks } from '@/services/feedbacks';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router';
import { loginUser } from '@/services/users';

const LoginForm = observer(({ fields, setIsSignup, appName }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const initialCredentials = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
  const [credentials, setCredentials] = useState(initialCredentials);
  const [fieldErrors, setFieldErrors] = useState(initialCredentials);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    if (!credentials.username || !credentials.password) {
      toast.error('Invalid or empty fields. Please enter a valid username and password.', {
        autoClose: 3000,
        pauseOnFocusLoss: false
      });
      return;
    }

    const response = await loginUser(credentials.username, credentials.password);
    toast.success('Successfully logged in', { autoClose: 2000, pauseOnFocusLoss: false });
    userStore.setUser(response.user);
    localStorage.setItem('CloudRoundsToken', response.token);

    const feedbacks = await fetchUserFeedbacks(response.user._id);
    userStore.setFeedbacks(feedbacks);

    try {
      await fetchUserPermissions(response.user._id);
    } catch (error) {
      toast.error(`Error fetching permissions: ${error}`, { autoClose: 2000, pauseOnFocusLoss: false });
    }

    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='scrollable-area'>
        <div>
          <GoogleButton isSignup={false} />
        </div>
        <div className='px-8 py-2 w-full mx-auto pt-4'>
          <hr className='divider sign-in' />
          <div style={{ marginTop: '30px', marginBottom: '30px' }}>
            {fields.map((field, index) => (
              <InputField
                key={index}
                field={field}
                value={credentials[field.name]}
                onChange={e => setCredentials({ ...credentials, [field.name]: e.target.value })}
                error={fieldErrors[field.name]}
              />
            ))}
          </div>
          {isLoading && (
            <div className='flex w-full justify-center text-center'>
              <CircularProgress size={24} />
            </div>
          )}
          <div className='pb-4 sm:pb-8 w-full text-center'>
            <div className='flex justify-center mt-8'>
              <button type='submit' className='w-1/2 bg-blue-500 text-white p-2 rounded-full'>
                Login
              </button>
            </div>
            <p className='mt-8 text-center'>
              New to {appName}?{' '}
              <span className='text-blue-500 cursor-pointer hover:underline' onClick={() => setIsSignup(true)}>
                Create account
              </span>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
});

export default LoginForm;
