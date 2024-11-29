import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

import { defaultHeaders, passwordPolicies } from '@/lib/common';
import { maxLengthPolicies } from '@/lib/common';

import { Box, Typography, TextField, Button, Avatar, Divider, Card, CardContent, Stack } from '@mui/material';


const schema = Yup.object().shape({
  currentPassword: Yup.string().required().max(maxLengthPolicies.password),
  newPassword: Yup.string()
    .required()
    .min(passwordPolicies.minLength)
    .max(maxLengthPolicies.password),
});

const UpdatePassword = () => {
  const { t } = useTranslation('common');

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const response = await fetch('/api/password', {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(values),
      });

      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error.message);
        return;
      }

      toast.success(t('successfully-updated'));
      formik.resetForm();
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
              {t('password')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              {t('change-password-text')}
            </Typography>
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              className="w-full max-w-md"
              required
              type="password"
              name="currentPassword"
              placeholder={t('current-password')}
              value={formik.values.currentPassword}
              error={formik.touched.currentPassword && formik.errors.currentPassword ? true : false}
              helperText={formik.touched.currentPassword && formik.errors.currentPassword ? formik.errors.currentPassword : null}
            />

            <TextField
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              className="w-full max-w-md"
              required
              type="password"
              name="newPassword"
              placeholder={t('new-password')}
              value={formik.values.newPassword}
              error={formik.touched.newPassword && formik.errors.newPassword ? true : false}
              helperText={formik.touched.newPassword && formik.errors.newPassword ? formik.errors.newPassword : null}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant={isDisabled() ? "outlined" : "contained"}
                color="primary"
                disabled={isDisabled()}
              >
                {t('change-password')}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
};

export default UpdatePassword;
