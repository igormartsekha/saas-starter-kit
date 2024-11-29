import React from 'react';
import Box from '@mui/material/Box';
import env from '@/lib/env';
import { red } from 'tailwindcss/colors';

interface AccountLayoutProps {
    children: React.ReactNode;
}

export default function TeamLayout({ children }: AccountLayoutProps) {
    if(env.version === 'mui') {
        return (
            <Box sx={{
                backgroundColor: red,
                flexGrow: 1,
                width: {
                    sm: '100%', // Full width on extra-small screens
                    lg: '100%',  // Half width on large screens and above
                    xl: '70%'
                },
                margin: '0 auto', // Center the Box if needed
            }}>
                {children}
            </Box>
        );
    } else {
        return <>{children}</>;
    }
}
