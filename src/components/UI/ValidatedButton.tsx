import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const ValidatedButton = styled(Button)({
  backgroundColor: '#7e22ce',
  '&:hover': {
    backgroundColor: '#6a1bb1',
  },
  color: 'white',
});

export default ValidatedButton;