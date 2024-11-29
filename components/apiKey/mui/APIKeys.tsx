import { EmptyState, WithLoadingAndError } from '@/components/shared';
import ConfirmationDialog from '@/components/shared/mui/ConfirmationDialog';
import type { ApiKey, Team } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { ApiResponse } from 'types';
import NewAPIKey from './NewAPIKey';
import useAPIKeys from 'hooks/useAPIKeys';
import { Table } from '@/components/shared/table/Table';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Typography, Box, Stack } from '@mui/material';

interface APIKeysProps {
  team: Team;
}

const APIKeys = ({ team }: APIKeysProps) => {
  const { t } = useTranslation('common');
  const { data, isLoading, error, mutate } = useAPIKeys(team.slug);
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [confirmationDialogVisible, setConfirmationDialogVisible] =
    useState(false);

  // Delete API Key
  const deleteApiKey = async (apiKey: ApiKey | null) => {
    if (!apiKey) {
      return;
    }

    const response = await fetch(
      `/api/teams/${team.slug}/api-keys/${apiKey.id}`,
      {
        method: 'DELETE',
      }
    );

    setSelectedApiKey(null);
    setConfirmationDialogVisible(false);

    if (!response.ok) {
      const { error } = (await response.json()) as ApiResponse;
      toast.error(error.message);
      return;
    }

    mutate();
    toast.success(t('api-key-deleted'));
  };

  const apiKeys = data?.data ?? [];

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    { field: 'name', headerName: t('name'), flex: 1, disableColumnMenu: true, sortable: false, },
    { field: 'status', headerName: t('status'), flex: 1, disableColumnMenu: true, sortable: false, },
    { field: 'created', headerName: t('created'), flex: 1, disableColumnMenu: true, sortable: false, },
    {
      field: 'actions',
      headerName: t('actions'),
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Button
          color="error"
          onClick={() => {
            setSelectedApiKey(params.row);
            setConfirmationDialogVisible(true);
          }}
        >
          {t('revoke')}
        </Button>
      ),
    },
  ];

  // Prepare rows for the DataGrid
  const rows = apiKeys.map((apiKey) => ({
    id: apiKey.id,
    name: apiKey.name,
    status: t('active'),
    created: new Date(apiKey.createdAt).toLocaleDateString(),
  }));

  return (
    <WithLoadingAndError isLoading={isLoading} error={error}>
      <Box sx={{ py: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{mb:2}}>
          <Box>
            <Typography variant="h6" component="h2">
              {t('api-keys')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('api-keys-description')}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            {t('create-api-key')}
          </Button>
        </Stack>
        {apiKeys.length === 0 ? (
          <EmptyState
            title={t('no-api-key-title')}
            description={t('api-key-description')}
          />
        ) : (
          <>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10]}
              disableRowSelectionOnClick
              disableColumnMenu
              disableColumnSelector
              disableColumnResize
            />
            <ConfirmationDialog
              title={t('revoke-api-key')}
              visible={confirmationDialogVisible}
              onConfirm={() => deleteApiKey(selectedApiKey)}
              onCancel={() => setConfirmationDialogVisible(false)}
              cancelText={t('cancel')}
              confirmText={t('revoke-api-key')}
            >
              {t('revoke-api-key-confirm')}
            </ConfirmationDialog>
          </>
        )}
        <NewAPIKey
          team={team}
          createModalVisible={createModalVisible}
          setCreateModalVisible={setCreateModalVisible}
        />
      </Box>
    </WithLoadingAndError>
  )

  return (
    <WithLoadingAndError isLoading={isLoading} error={error}>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <h2 className="text-xl font-medium leading-none tracking-tight">
              {t('api-keys')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('api-keys-description')}
            </p>
          </div>
          <Button
            color="primary"
            size="md"
            onClick={() => setCreateModalVisible(true)}
          >
            {t('create-api-key')}
          </Button>
        </div>
        {apiKeys.length === 0 ? (
          <EmptyState
            title={t('no-api-key-title')}
            description={t('api-key-description')}
          />
        ) : (
          <>
            <Table
              cols={[t('name'), t('status'), t('created'), t('actions')]}
              body={apiKeys.map((apiKey) => {
                return {
                  id: apiKey.id,
                  cells: [
                    { wrap: true, text: apiKey.name },
                    {
                      badge: {
                        color: 'success',
                        text: t('active'),
                      },
                    },
                    {
                      wrap: true,
                      text: new Date(apiKey.createdAt).toLocaleDateString(),
                    },
                    {
                      buttons: [
                        {
                          color: 'error',
                          text: t('revoke'),
                          onClick: () => {
                            setSelectedApiKey(apiKey);
                            setConfirmationDialogVisible(true);
                          },
                        },
                      ],
                    },
                  ],
                };
              })}
            ></Table>
            <ConfirmationDialog
              title={t('revoke-api-key')}
              visible={confirmationDialogVisible}
              onConfirm={() => deleteApiKey(selectedApiKey)}
              onCancel={() => setConfirmationDialogVisible(false)}
              cancelText={t('cancel')}
              confirmText={t('revoke-api-key')}
            >
              {t('revoke-api-key-confirm')}
            </ConfirmationDialog>
          </>
        )}
        <NewAPIKey
          team={team}
          createModalVisible={createModalVisible}
          setCreateModalVisible={setCreateModalVisible}
        />
      </div>
    </WithLoadingAndError>
  );
};

export default APIKeys;
