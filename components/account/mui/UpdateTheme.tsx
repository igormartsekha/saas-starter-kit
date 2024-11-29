import useTheme from 'hooks/useTheme';
import { useTranslation } from 'next-i18next';
import { useColorScheme } from '@mui/material/styles';

import { Box, Typography, Select, MenuItem, FormControl, Card, CardContent } from '@mui/material';

const UpdateTheme = () => {
  const { setTheme, themes, selectedTheme, applyTheme } = useTheme();
  const { mode, systemMode, setMode } = useColorScheme();
  const { t } = useTranslation('common');

  const handleMode = (targetMode) => {
    setMode(targetMode);
  }

  const renderMenuItems = () => {
    return themes.flatMap((theme, index) => [
      <MenuItem
        key={theme.id}
        value={theme.name}
        onClick={() => handleMode(theme.id)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <theme.icon />
          <Box sx={{ mr: 1 }}>{theme.name}</Box>
        </Box>
      </MenuItem>
    ]);
  };

  const handleChange = (event) => {
    const themeId = event.target.value.toLowerCase()
    console.log(themeId)
    // Set native boxyhq
    applyTheme(themeId);
    setTheme(themeId);
    // Set MUI mode
    handleMode(themeId.toString())
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('theme')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            {t('change-theme')}
          </Typography>

          <FormControl fullWidth>
            <Select
              labelId="theme-select-label"
              value={selectedTheme.name}
              onChange={handleChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Theme Selector' }}
            >
              {renderMenuItems()}
            </Select>
          </FormControl></CardContent>
      </Card>
    </Box>
  )
};

export default UpdateTheme;
