import {
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon,
  KeyIcon,
  PaperAirplaneIcon,
  ShieldExclamationIcon,
  UserPlusIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import type { Team } from '@prisma/client';
import classNames from 'classnames';
import useCanAccess from 'hooks/useCanAccess';
import Link from 'next/link';
import { TeamFeature } from 'types';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useEffect } from 'react'; 



interface TeamTabProps {
  activeTab: string;
  team: Team;
  heading?: string;
  teamFeatures: TeamFeature;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TeamTab = ({ activeTab, team, heading, teamFeatures }: TeamTabProps) => {
  const { canAccess } = useCanAccess();
  const router = useRouter();

  const navigations = [
    {
      name: 'Settings',
      href: `/teams/${team.slug}/settings`,
      active: activeTab === 'settings',
      icon: Cog6ToothIcon,
    },
  ];

  if (canAccess('team_member', ['create', 'update', 'read', 'delete'])) {
    navigations.push({
      name: 'Members',
      href: `/teams/${team.slug}/members`,
      active: activeTab === 'members',
      icon: UserPlusIcon,
    });
  }

  if (
    teamFeatures.sso &&
    canAccess('team_sso', ['create', 'update', 'read', 'delete'])
  ) {
    navigations.push({
      name: 'Single Sign-On',
      href: `/teams/${team.slug}/sso`,
      active: activeTab === 'sso',
      icon: ShieldExclamationIcon,
    });
  }

  if (
    teamFeatures.dsync &&
    canAccess('team_dsync', ['create', 'update', 'read', 'delete'])
  ) {
    navigations.push({
      name: 'Directory Sync',
      href: `/teams/${team.slug}/directory-sync`,
      active: activeTab === 'directory-sync',
      icon: UserPlusIcon,
    });
  }

  if (
    teamFeatures.auditLog &&
    canAccess('team_audit_log', ['create', 'update', 'read', 'delete'])
  ) {
    navigations.push({
      name: 'Audit Logs',
      href: `/teams/${team.slug}/audit-logs`,
      active: activeTab === 'audit-logs',
      icon: DocumentMagnifyingGlassIcon,
    });
  }

  if (
    teamFeatures.payments &&
    canAccess('team_payments', ['create', 'update', 'read', 'delete'])
  ) {
    navigations.push({
      name: 'Billing',
      href: `/teams/${team.slug}/billing`,
      active: activeTab === 'payments',
      icon: BanknotesIcon,
    });
  }

  if (
    teamFeatures.webhook &&
    canAccess('team_webhook', ['create', 'update', 'read', 'delete'])
  ) {
    navigations.push({
      name: 'Webhooks',
      href: `/teams/${team.slug}/webhooks`,
      active: activeTab === 'webhooks',
      icon: PaperAirplaneIcon,
    });
  }

  if (
    teamFeatures.apiKey &&
    canAccess('team_api_key', ['create', 'update', 'read', 'delete'])
  ) {
    navigations.push({
      name: 'API Keys',
      href: `/teams/${team.slug}/api-keys`,
      active: activeTab === 'api-keys',
      icon: KeyIcon,
    });
  }


  const [value, setValue] = React.useState(-1);

  useEffect(() => {
    // Find the active tab based on the current route
    const activeNavigation = navigations.findIndex(nav => nav.active);
    if (activeNavigation !== -1) {
      setValue(activeNavigation);
    }
  }, [router.asPath, navigations]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    router.push(navigations[newValue].href);
  };

  return (
    <>
      <Box >
        <Typography variant="h2">{heading ? heading : team.name}</Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value==-1?false:value} 
            onChange={handleChange} 
            aria-label="basic tabs example" 
            // centered
            sx={{
              // display: 'flex',
              // flexWrap: 'wrap', // Enable wrapping
              // justifyContent: 'center', // Center the tabs (optional)
            }}
            TabIndicatorProps={{ 
              // Disable animation from start to selected
              style: {transition: 'none'} 
            }}
            >
            {navigations.map((menu) => {
              return (
                <Tab 
                  key={menu.href} 
                  label={menu.name} {...a11yProps(0)} 
                  sx={{ transition: 'none' }}
                  />
              );
            })}

          </Tabs>
        </Box>
      </Box>
    </>
  )
};

export default TeamTab;
