import { savePermissions } from '@/services/permissions';
import { Box, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useMutation } from 'react-query';

const EditPermissions = ({ userPermissions, setUser, closeModal }) => {
  const mutation = useMutation(savePermissions, {
    onSuccess: () => {
      console.log('Permissions updated successfully');
      closeModal();
    },
    onError: error => {
      console.error('Error updating permissions:', error);
    }
  });

  const handlePermissionChange = (event, purpose) => {
    const { name, checked } = event.target;
    let updatedPermissions = [...userPermissions.permissions];

    const permissionIndex = updatedPermissions.findIndex(p => p.purpose === purpose);
    if (permissionIndex !== -1) {
      updatedPermissions[permissionIndex][name] = checked;
    }

    setUser({
      ...userPermissions,
      permissions: updatedPermissions
    });
  };

  const handleSavePermissions = () => {
    mutation.mutate(userPermissions);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
      }}>
      <Typography id='modal-title' variant='h6' component='h2'>
        Edit Permissions for {user?.username}
      </Typography>
      <form noValidate autoComplete='off'>
        {userPermissions &&
          userPermissions.permissions.map(permission => (
            <Box key={permission.purpose}>
              <Typography>{permission.purpose}</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={permission.canRead}
                    onChange={e => handlePermissionChange(e, permission.purpose)}
                    name='canRead'
                  />
                }
                label='Read'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={permission.canWrite}
                    onChange={e => handlePermissionChange(e, permission.purpose)}
                    name='canWrite'
                  />
                }
                label='Write'
              />
            </Box>
          ))}
        <Button onClick={handleSavePermissions}>Save</Button>
      </form>
    </Box>
  );
};
export default EditPermissions;
