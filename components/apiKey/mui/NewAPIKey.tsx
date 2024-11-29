import { InputWithCopyButton } from '@/components/shared';
import type { Team } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSWRConfig } from 'swr';
import type { ApiResponse } from 'types';
import { defaultHeaders } from '@/lib/common';
import { useFormik } from 'formik';
import { z } from 'zod';
import { createApiKeySchema } from '@/lib/zod';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';


const NewAPIKey = ({
  team,
  createModalVisible,
  setCreateModalVisible,
}: NewAPIKeyProps) => {
  const { mutate } = useSWRConfig();
  const [apiKey, setApiKey] = useState('');

  const onNewAPIKey = (apiKey: string) => {
    setApiKey(apiKey);
    mutate(`/api/teams/${team.slug}/api-keys`);
  };

  const toggleVisible = () => {
    setCreateModalVisible(!createModalVisible);
    setApiKey('');
  };

  return (
    <Dialog open={createModalVisible} onClose={toggleVisible}>
      {apiKey === '' ? (
        <CreateAPIKeyForm
          team={team}
          onNewAPIKey={onNewAPIKey}
          closeModal={toggleVisible}
        />
      ) : (
        <DisplayAPIKey apiKey={apiKey} closeModal={toggleVisible} />
      )}
    </Dialog>
  );
};

const CreateAPIKeyForm = ({
  team,
  onNewAPIKey,
  closeModal,
}: CreateAPIKeyFormProps) => {
  const { t } = useTranslation('common');

  const formik = useFormik<z.infer<typeof createApiKeySchema>>({
    initialValues: {
      name: '',
    },
    validateOnBlur: false,
    validate: (values) => {
      try {
        createApiKeySchema.parse(values);
      } catch (error: any) {
        return error.formErrors.fieldErrors;
      }
    },
    onSubmit: async (values) => {
      const response = await fetch(`/api/teams/${team.slug}/api-keys`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: defaultHeaders,
      });

      const { data, error } = (await response.json()) as ApiResponse<{
        apiKey: string;
      }>;

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.apiKey) {
        onNewAPIKey(data.apiKey);
        toast.success(t('api-key-created'));
      }
    },
  });

  function isDisabled() {
    return !formik.dirty || !formik.isValid
  }

  return (
    <>
      <DialogTitle>{t('new-api-key')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          {t('api-key-description')}
        </Typography>
        <form onSubmit={formik.handleSubmit} method="POST">
          <TextField
            label={t('name')}
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder="My API Key"
            fullWidth
            margin="normal"
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <DialogActions>
            <Button onClick={closeModal} color="primary">
              {t('close')}
            </Button>
            <Button
              color="primary"
              type="submit"
              variant={isDisabled() ? "outlined" : "contained"}
              disabled={isDisabled()}
            >
              {t('create-api-key')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </>
  );
};

const DisplayAPIKey = ({ apiKey, closeModal }: DisplayAPIKeyProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      <DialogTitle>{t('new-api-key')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          {t('new-api-warning')}
        </Typography>
        <InputWithCopyButton
          label={t('api-key')}
          value={apiKey}
          className="text-sm"
          readOnly
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color="primary">
          {t('close')}
        </Button>
      </DialogActions>
    </>
  );
};

interface NewAPIKeyProps {
  team: Team;
  createModalVisible: boolean;
  setCreateModalVisible: (visible: boolean) => void;
}

interface CreateAPIKeyFormProps {
  team: Team;
  onNewAPIKey: (apiKey: string) => void;
  closeModal: () => void;
}

interface DisplayAPIKeyProps {
  apiKey: string;
  closeModal: () => void;
}

export default NewAPIKey;
