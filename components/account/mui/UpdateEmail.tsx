import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useTranslation } from 'next-i18next';
import { Input } from 'react-daisyui';

import type { ApiResponse } from 'types';
import { defaultHeaders } from '@/lib/common';
import type { User } from '@prisma/client';
import { updateAccountSchema } from '@/lib/zod';

import { Box, Typography, TextField, Button, Avatar, Divider, Card, CardContent } from '@mui/material';


interface UpdateEmailProps {
  user: Partial<User>;
  allowEmailChange: boolean;
}

const UpdateEmail = ({ user, allowEmailChange }: UpdateEmailProps) => {
  const { t } = useTranslation('common');

  const formik = useFormik({
    initialValues: {
      email: user.email,
    },
    validateOnBlur: false,
    enableReinitialize: true,
    validate: (values) => {
      try {
        updateAccountSchema.parse(values);
      } catch (error: any) {
        return error.formErrors.fieldErrors;
      }
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const json = (await response.json()) as ApiResponse;
        toast.error(json.error.message);
        return;
      }

      toast.success(t('successfully-updated'));
    },
  });

  function isDisabled() {
    return !formik.dirty || !formik.isValid || formik.isSubmitting
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6" gutterBottom>
              {t('email-address')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              {t('email-address-description')}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              type="email"
              name="email"
              placeholder={t('your-email')}
              value={formik.values.email}
              onChange={formik.handleChange}
              className="w-full max-w-md"
              required
              disabled={!allowEmailChange} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant={isDisabled() ? "outlined" : "contained"}
                color="primary"
                disabled={isDisabled()}
              >
                {t('save-changes')}
              </Button>
            </Box>
          </form></CardContent>
      </Card>
    </Box>
  )
}

export default UpdateEmail;
