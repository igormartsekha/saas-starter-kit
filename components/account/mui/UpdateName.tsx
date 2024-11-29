import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useTranslation } from 'next-i18next';

import type { ApiResponse } from 'types';
import { defaultHeaders } from '@/lib/common';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { updateAccountSchema } from '@/lib/zod';

import { Box, Typography, TextField, Button, Avatar, Divider, Card, CardContent, } from '@mui/material';

const UpdateName = ({ user }: { user: Partial<User> }) => {
  const { t } = useTranslation('common');
  const { update } = useSession();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: user.name,
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

      await update({
        name: values.name,
      });

      router.replace('/settings/account');
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
              {t('name')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              {t('name-appearance')}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              type="text"
              name="name"
              placeholder={t('your-name')}
              value={formik.values.name}
              onChange={formik.handleChange}
              className="w-full max-w-md"
              required
            />
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
          </form>
        </CardContent>
      </Card>
    </Box>
  )
};

export default UpdateName;
