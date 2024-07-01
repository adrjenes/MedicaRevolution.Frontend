import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

const ValidatedCheckbox = styled(Checkbox)({
  color: '#7e22ce',
  '&.Mui-checked': {
    color: '#7e22ce',
  },
});

export default ValidatedCheckbox;