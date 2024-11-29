import { Stack, Typography } from '@mui/material';

const HeaderTitle = ({ text }: { text: String }) => {
  return (<Stack direction="row" alignItems="center" justifyContent="middle" spacing={0}>
    <span style={{ margin: 0 }}>&nbsp;</span>
    <Typography sx={{marginLeft:0}} variant="body2" color="text.secondary">{text}</Typography>
  </Stack>)
}

export default HeaderTitle