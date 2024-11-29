import * as React from 'react';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import useActivePathname from 'hooks/useActivePathname';


export interface NavigationProps {
  activePathname: string | null;
}

export interface MenuItem {
  name: string;
  href: string;
  icon?: any;
  active?: boolean;
  items?: Omit<MenuItem, 'icon' | 'items'>[];
  className?: string;
}

const MenuNavigation = ({mainMenus, secondaryMenus}) => {
  const NavigationItem = ({ item, index }) => {
    return (
      <ListItem key={index} disablePadding sx={{ display: 'block' }}>
          <Link href={item.href}>
            <ListItemButton selected={item.active}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </Link>
        </ListItem>
    )
  }
  var counter = 1
  return (
    <>
      <List dense>
        {mainMenus?.map((item, index) => (
          <NavigationItem item={item} index={counter+=1} key={counter} />
        ))}
      </List>
      <List dense>
        {secondaryMenus?.map((item, index) => (
           <NavigationItem item={item} index={counter+=1}  key={counter} />
        ))}
      </List>
    </>
  )
};


export default function MenuContent() {
  const { asPath, isReady, query } = useRouter();
  //boxyHQ changes
  const activePathname = useActivePathname();
  

  const { slug } = query as { slug: string };


  // const { asPath, isReady, query } = useRouter();
  // const [activePathname, setActivePathname] = useState<null | string>(null);
  // useEffect(() => {
  //   if (isReady && asPath) {
  //     const activePathname = new URL(asPath, location.href).pathname;
  //     setActivePathname(activePathname);
  //   }
  // }, [asPath, isReady]);
  // const activePathname = useActivePathname();
  //boxyHQ end

  const Navigation = () => {
    const { t } = useTranslation('common');
    if (slug) {
      // Need to show team navigation
        const mainMenus: MenuItem[] = [
        {
          name: t('all-products'),
          href: `/teams/${slug}/products`,
          icon: <HelpRoundedIcon />,
          active: activePathname === `/teams/${slug}/products`,
        },
        {
          name: t('settings'),
          href: `/teams/${slug}/settings`,
          icon: <HelpRoundedIcon />,
          active:
            activePathname?.startsWith(`/teams/${slug}`) &&
            !activePathname.includes('products'),
        },
      ];

      return <MenuNavigation mainMenus={mainMenus} />;
    } else {
      const mainMenus: MenuItem[] = [
        {
          name: t('all-teams'),
          href: '/teams',
          icon: <HomeRoundedIcon />,
          active: activePathname === '/teams',
        },
        {
          name: t('mui'),
          href: '/settings/mui',
          icon: <AssignmentRoundedIcon />,
          active: activePathname === '/settings/mui',
        },
      ];
    
      const secondaryMenus: MenuItem[] = [
        {
          name: t('account'),
          href: '/settings/account',
          icon: <PeopleRoundedIcon />,
          active: activePathname === '/settings/account',
        },
        {
          name: t('security'),
          href: '/settings/security',
          icon: <AnalyticsRoundedIcon />,
          active: activePathname === '/settings/security',
        }
      ];
      // Need to show UserNavigation
      return <MenuNavigation mainMenus={mainMenus} secondaryMenus={secondaryMenus} />;
    }
  };
  

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <Navigation/>
    </Stack>
  );
}


