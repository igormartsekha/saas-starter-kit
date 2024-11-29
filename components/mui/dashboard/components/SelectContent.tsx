import * as React from 'react';
import { useEffect, useState } from 'react';
import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Select, { SelectChangeEvent, selectClasses } from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import LayersIcon from '@mui/icons-material/Layers';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FolderIcon from '@mui/icons-material/Folder';

import useActivePathname from 'hooks/useActivePathname';

import { useTranslation } from 'next-i18next';
import useTeams from 'hooks/useTeams';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ClientUserData } from 'models/user';

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectContent({ user }: { user: ClientUserData }) {
  const { t } = useTranslation('common');

  const { teams } = useTeams();
  // const { data } = useSession();
  const router = useRouter();
  const activePathname = useActivePathname();
  const [company, setCompany] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setCompany(event.target.value as string);
  };

  const currentTeam = (teams || []).find(
    (team) => team.slug === router.query.slug
  );

  useEffect(() => {
    if (activePathname !== null) {
      if(currentTeam != null) {
        setCompany(`/teams/${currentTeam.slug}/settings`);
      } else {
        setCompany('/settings/account');
      }
    }
  }, [activePathname, currentTeam]);

  const handleMenuItemClick = (href: string) => {
    router.push(href); // Navigate to the route
  };

  const menus = [
    {
      id: 2,
      name: t('teams'),
      items: (teams || []).map((team) => ({
        id: team.id,
        name: team.name,
        href: `/teams/${team.slug}/settings`,
        icon: <FolderIcon />,
      })),
      addTopDivider: false
    },
    {
      id: 1,
      name: t('profile'),
      items: [
        {
          id: user.id, //data?.user.id,
          name: user.name, //data?.user?.name,
          href: '/settings/account',
          subtitle: user.email,
          icon: (
            <Avatar alt={user.name ?? ""} src={user.image ?? ""}>
              <AccountCircleIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
          )
        },
      ],
    },
    {
      id: 3,
      name: '',
      items: [
        // {
        //   id: 'all-teams',
        //   name: t('all-teams'),
        //   href: '/teams',
        //   icon: <LayersIcon />,
        // },
        {
          id: 'new-team',
          name: t('new-team'),
          href: '/teams?newTeam=true',
          icon: <AddRoundedIcon />,
        },
      ],
      addTopDivider: true
    },
  ];

  const renderMenuItems = () => {
    var counter = 0
    return menus.flatMap((section, index) => [
      <Divider sx={{ mx: -1, display: section.addTopDivider ? 'block' : 'none' }} key={++counter} />,
      <ListSubheader sx={{ pt: 0 }} key={++counter}>{section.name}</ListSubheader>,
      ...section.items.map((item, index) => (
        <MenuItem value={item.href}
          onClick={() => handleMenuItemClick(item.href)}
          key={++counter}
        >
          <ListItemAvatar>
            {item.icon}
          </ListItemAvatar>
          <ListItemText primary={item.name} secondary={item.subtitle ?? ""} secondaryTypographyProps={{ overflow: 'hidden', textOverflow: 'ellipsis' }} />
        </MenuItem>
      )),
    ]);
  };



  return (
    <Select
      labelId="company-select"
      id="company-simple-select"
      // value={currentTeam}
      value={company}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Select company' }}
      fullWidth
      sx={{
        maxHeight: 56,
        width: 215,
        '&.MuiList-root': {
          p: '8px',
        },
        [`& .${selectClasses.select}`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          pl: 1,
        },
      }}
    >
      {renderMenuItems()}
    </Select>
  );
}
