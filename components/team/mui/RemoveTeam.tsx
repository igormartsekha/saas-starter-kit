import { Team } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmationDialog from '@/components/shared/mui/ConfirmationDialog';
import { defaultHeaders } from '@/lib/common';
import type { ApiResponse } from 'types';

import { Card, CardContent, Box, Button, Typography } from '@mui/material';


interface RemoveTeamProps {
  team: Team;
  allowDelete: boolean;
}

const RemoveTeam = ({ team, allowDelete }: RemoveTeamProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(false);
  const [askConfirmation, setAskConfirmation] = useState(false);

  const removeTeam = async () => {
    setLoading(true);

    const response = await fetch(`/api/teams/${team.slug}`, {
      method: 'DELETE',
      headers: defaultHeaders,
    });

    setLoading(false);

    if (!response.ok) {
      const json = (await response.json()) as ApiResponse;
      toast.error(json.error.message);
      return;
    }

    toast.success(t('team-removed-successfully'));
    router.push('/teams');
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box>
            <Typography variant="h5">{t('remove-team')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {allowDelete
                ? t('remove-team-warning')
                : t('remove-team-restricted')}
            </Typography>
          </Box>
        
        {allowDelete && (
          <Box sx={{mt:2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              color="error"
              onClick={() => setAskConfirmation(true)}
              disabled={loading}
              variant="contained"
              size="medium"
            >
              {t('remove-team')}
            </Button>
          </Box>
        )}
        </CardContent>
      </Card>
      {allowDelete && (
        <ConfirmationDialog
          visible={askConfirmation}
          title={t('remove-team')}
          onCancel={() => setAskConfirmation(false)}
          onConfirm={removeTeam}
        >
          {t('remove-team-confirmation')}
        </ConfirmationDialog>
      )}
    </>
  );
};

export default RemoveTeam;
