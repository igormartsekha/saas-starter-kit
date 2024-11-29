import React from 'react';
import * as Yup from 'yup';
import { mutate } from 'swr';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { Input } from 'react-daisyui';
import { useTranslation } from 'next-i18next';


import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Box } from '@mui/material';


import type { ApiResponse } from 'types';
import { defaultHeaders, maxLengthPolicies } from '@/lib/common';
import { availableRoles } from '@/lib/permissions';
import type { Team } from '@prisma/client';

interface InviteViaEmailProps {
  team: Team;
  setVisible: (visible: boolean) => void;
}

const InviteViaEmail = ({ setVisible, team }: InviteViaEmailProps) => {
  const { t } = useTranslation('common');

  const FormValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .max(maxLengthPolicies.email)
      .required(t('require-email')),
    role: Yup.string()
      .required(t('required-role'))
      .oneOf(availableRoles.map((r) => r.id)),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      role: availableRoles[0].id,
      sentViaEmail: true,
    },
    validationSchema: FormValidationSchema,
    onSubmit: async (values) => {
      const response = await fetch(`/api/teams/${team.slug}/invitations`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const result = (await response.json()) as ApiResponse;
        toast.error(result.error.message);
        return;
      }

      toast.success(t('invitation-sent'));
      mutate(`/api/teams/${team.slug}/invitations?sentViaEmail=true`);
      setVisible(false);
      formik.resetForm();
    },
  });

  function isDisabled() {
    return !formik.isValid || !formik.dirty
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit} method="POST" className="pb-6">
        <Typography variant="subtitle1">
          {t('invite-via-email')}
        </Typography>
        <Box style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <TextField
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            placeholder="jackson@boxyhq.com"
            required
            fullWidth
            type="email"
            variant="outlined"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            style={{ flexGrow: 1 }} // Allow TextField to take all remaining space
          />
          <FormControl size='small' variant="outlined" style={{ flexShrink: 0 }}> {/* Prevent shrinking */}
            <InputLabel id="role-label">{t('role')}</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              onChange={formik.handleChange}
              value={formik.values.role}
              required
            >
              {availableRoles.map((role) => (
                <MenuItem value={role.id} key={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant={isDisabled() ? 'outlined' : 'contained'}
            color="primary"
            disabled={isDisabled()}
            style={{ flexShrink: 0 }} // Prevent shrinking
          >
            {t('send-invite')}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default InviteViaEmail;
