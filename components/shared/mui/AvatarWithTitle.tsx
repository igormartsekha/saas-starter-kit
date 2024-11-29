import { Stack, Typography } from '@mui/material';
import LetterAvatar from './LetterAvatar'

const AvatarWithTitle = ({ 
    text, 
    style,
    color
}: { 
    text: string, 
    style?:React.CSSProperties,
    color?: string}) => {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
          <LetterAvatar name={text} />
          <span style={{ margin: 0 }}>&nbsp;</span>
          <Typography variant="body2" color={color} style={style}>
            {text}
          </Typography>
        </Stack>
    )
}

export default AvatarWithTitle