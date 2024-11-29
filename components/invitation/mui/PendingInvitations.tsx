import { Error, Loading } from '@/components/shared';
import LetterAvatar from '@/components/shared/mui/LetterAvatar';
import { defaultHeaders } from '@/lib/common';
import { Team } from '@prisma/client';
import useInvitations from 'hooks/useInvitations';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import ConfirmationDialog from '@/components/shared/mui/ConfirmationDialog';
import { TeamInvitation } from 'models/invitation';
import { Table } from '@/components/shared/table/Table';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Stack, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import HeaderTitle from '@/components/shared/mui/HeaderTitle';
import AvatarWithTitle from '@/components/shared/mui/AvatarWithTitle';


const PendingInvitations = ({ team }: { team: Team }) => {
  const [selectedInvitation, setSelectedInvitation] =
    useState<TeamInvitation | null>(null);

  const [confirmationDialogVisible, setConfirmationDialogVisible] =
    useState(false);

  const { isLoading, isError, invitations, mutateInvitation } = useInvitations({
    slug: team.slug,
    sentViaEmail: true,
  });

  const { t } = useTranslation('common');

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  const deleteInvitation = async (invitation: TeamInvitation | null) => {
    if (!invitation) {
      return;
    }

    const sp = new URLSearchParams({ id: invitation.id });

    const response = await fetch(
      `/api/teams/${team.slug}/invitations?${sp.toString()}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
      }
    );

    const json = (await response.json()) as ApiResponse<unknown>;

    if (!response.ok) {
      toast.error(json.error.message);
      return;
    }

    mutateInvitation();
    toast.success(t('invitation-deleted'));
  };

  if (!invitations || !invitations.length) {
    return null;
  }

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: t('email'),
      flex: 2,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <AvatarWithTitle text={params.row.email} />
      ),
    },
    {
      field: 'role',
      headerName: t('role'),
      flex: 1,

      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <HeaderTitle text={params.row.role} />
      ),
    },
    {
      field: 'expiresAt',
      headerName: t('expires-at'),
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <HeaderTitle text={new Date(params.row.expires).toDateString()} />
      ),
    },
    {
      field: 'actions',
      headerName: t('actions'),
      flex: 0,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setSelectedInvitation(params.row);
            setConfirmationDialogVisible(true);
          }}
        >
          {t('remove')}
        </Button>
      ),
    },
  ];

  const rows: GridRowsProp = invitations;

  return (
    <>
      <Grid container>
        <Grid size={12}>
          <Stack direction="row" alignItems="center" justifyContent="justify-between" spacing={1}
            sx={{
              display: { xs: 'none', md: 'flex' },
              width: '100%',
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              pt: 1.5,
            }}
          >
            <Stack direction="column">
              <Typography component="h2" variant="h6">
                {t('pending-invitations')}
              </Typography>
              <Typography component="h2" variant="subtitle2">
                {t('description-invitations')}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        disableColumnResize={true}
        pageSizeOptions={[5, 10]}
      // pagination={false}
      // autoPageSize
      />

      <ConfirmationDialog
        visible={confirmationDialogVisible}
        onCancel={() => setConfirmationDialogVisible(false)}
        onConfirm={() => deleteInvitation(selectedInvitation)}
        title={t('confirm-delete-member-invitation')}
      >
        {t('delete-member-invitation-warning', {
          email: selectedInvitation?.email,
        })}
      </ConfirmationDialog>
    </>
  );
};

export default PendingInvitations;
