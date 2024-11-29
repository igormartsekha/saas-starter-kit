import Avatar from '@mui/material/Avatar';
import { green } from 'tailwindcss/colors';

const LetterAvatar = ({ name }: { name: string }) => {
  return (
    <Avatar sx={{ bgcolor: green[900], width: 32, height: 32 }}>{name.charAt(0).toUpperCase()}</Avatar>
  );
};

export default LetterAvatar;