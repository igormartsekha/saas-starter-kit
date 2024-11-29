import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { usePathname } from 'next/navigation'

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {

  const path = usePathname()
  // const pathNames = paths.split('/').filter(path => path).map((path, index) => ({
  //   name: path.charAt(0).toUpperCase() + path.slice(1),
  //   relativeLink: `/${path}`,
  // }));

  // Split the path into segments
  const segments = path.split("/").filter(Boolean); // Remove empty parts caused by leading slash

  // Build the breadcrumbs array
  const breadcrumbs = segments.map((segment, index) => {
    // Construct the path up to the current segment
    const currentPath = `/${segments.slice(0, index + 1).join("/")}`;

    // Create the name and path object
    return {
      name: segment.charAt(0).toUpperCase() + segment.slice(1), // Capitalize the segment
      relativeLink: currentPath,
    };
  });

  
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {
        breadcrumbs.map((link, index) => (
          <Link href={link.relativeLink}>
            <Typography key={index} variant="body1">
              {link.name}
            </Typography>
          </Link>
        ))
      }
    </StyledBreadcrumbs>
  );
}
