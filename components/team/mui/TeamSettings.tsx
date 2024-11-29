import { defaultHeaders } from '@/lib/common';
import { Team } from '@prisma/client';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';

import { AccessControl } from '@/components/shared/AccessControl';
import { z } from 'zod';
import { updateTeamSchema } from '@/lib/zod';
import useTeams from 'hooks/useTeams';

import { Card, TextField, Button, Box, Typography, CardContent } from '@mui/material';


const TeamSettings = ({ team }: { team: Team }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { mutateTeams } = useTeams();

  const formik = useFormik<z.infer<typeof updateTeamSchema>>({
    initialValues: {
      name: team.name,
      slug: team.slug,
      domain: team.domain || '',
    },
    validateOnBlur: false,
    enableReinitialize: true,
    validate: (values) => {
      try {
        updateTeamSchema.parse(values);
      } catch (error: any) {
        return error.formErrors.fieldErrors;
      }
    },
    onSubmit: async (values) => {
      const response = await fetch(`/api/teams/${team.slug}`, {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(values),
      });

      const json = (await response.json()) as ApiResponse<Team>;

      if (!response.ok) {
        toast.error(json.error.message);
        return;
      }

      toast.success(t('successfully-updated'));
      mutateTeams();
      router.push(`/teams/${json.data.slug}/settings`);
    },
  });

  function isDisabled() {
    return !formik.dirty || !formik.isValid || formik.isSubmitting
  }

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
      <Card>
        <CardContent>
          <Box>
            <Typography variant="h5">{t('team-settings')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('team-settings-config')}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                name="name"
                label={t('team-name')}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.name)}
                helperText={formik.errors.name}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                name="slug"
                label={t('team-slug')}
                value={formik.values.slug}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.slug)}
                helperText={formik.errors.slug}
                variant="outlined"
                margin="normal"
              />
              <TextField
                size="small"
                fullWidth
                name="domain"
                label={t('team-domain')}
                value={formik.values.domain}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.domain)}
                helperText={formik.errors.domain}
                variant="outlined"
                margin="normal"
              />
            </Box>
          </Box>
          <AccessControl resource="team" actions={['update']}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                color="primary"
                variant={isDisabled() ? "outlined" : "contained"}
                disabled={isDisabled()}
              >
                {t('save-changes')}
              </Button>
            </Box>
          </AccessControl>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeamSettings;
