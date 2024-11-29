import { Error, Loading } from '@/components/shared';
import LetterAvatar from '@/components/shared/mui/LetterAvatar';
import { Team, TeamMember } from '@prisma/client';
import useCanAccess from 'hooks/useCanAccess';
import useTeamMembers, { TeamMemberWithUser } from 'hooks/useTeamMembers';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import toast from 'react-hot-toast';

import InviteMember from '@/components/invitation/mui/InviteMember';
import UpdateMemberRole from './UpdateMemberRole';
import { defaultHeaders } from '@/lib/common';
import type { ApiResponse } from 'types';
import ConfirmationDialog from '@/components/shared/mui/ConfirmationDialog';
import { useState } from 'react';
import { Stack, Typography, Button, Avatar } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'
import Grid from '@mui/material/Grid2';
import HeaderTitle from '@/components/shared/mui/HeaderTitle';
import AvatarWithTitle from '@/components/shared/mui/AvatarWithTitle';


const Members = ({ team }: { team: Team }) => {
  const { data: session } = useSession();
  const { t } = useTranslation('common');
  const { canAccess } = useCanAccess();
  const [visible, setVisible] = useState(false);
  const [selectedMember, setSelectedMember] =
    useState<TeamMemberWithUser | null>(null);
  const [confirmationDialogVisible, setConfirmationDialogVisible] =
    useState(false);

  const { isLoading, isError, members, mutateTeamMembers } = useTeamMembers(
    team.slug
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!members) {
    return null;
  }

  const removeTeamMember = async (member: TeamMember | null) => {
    if (!member) {
      return;
    }

    const sp = new URLSearchParams({ memberId: member.userId });

    const response = await fetch(
      `/api/teams/${team.slug}/members?${sp.toString()}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
      }
    );

    const json = (await response.json()) as ApiResponse;

    if (!response.ok) {
      toast.error(json.error.message);
      return;
    }

    mutateTeamMembers();
    toast.success(t('member-deleted'));
  };

  const canUpdateRole = (member: TeamMember) => {
    return (
      session?.user.id != member.userId && canAccess('team_member', ['update'])
    );
  };

  const canRemoveMember = (member: TeamMember, table) => {
    return (
      session?.user.id != member.userId && canAccess('team_member', ['delete'])
    );
  };

  const cols = [t('name'), t('email'), t('role')];
  if (canAccess('team_member', ['delete'])) {
    cols.push(t('actions'));
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('name'),
      flex: 2,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <AvatarWithTitle text={params.row.user.name} color="text.secondary" />
      ),
    },
    {
      field: 'email',
      headerName: t('email'),
      flex: 2,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        (
          <HeaderTitle text={params.row.user.email} />
        )
      ),
    },
    {
      field: 'role',
      headerName: t('role'),
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        canUpdateRole(params.row) ? (
          <UpdateMemberRole team={team} member={params.row} />
        ) : (
          <HeaderTitle text={params.row.role} />
        )
      ),
    },
    {
      field: 'actions',
      headerName: t('actions'),
      flex: 0,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        canRemoveMember(params.row, "grid") ? (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setSelectedMember(params.row);
              setConfirmationDialogVisible(true);
            }}
          >
            {t('remove')}
          </Button>
        ) : (<></>)
      ),
    },
  ];

  const rows: GridRowsProp = members

  return (
    <>
      <>
        <Grid container >
          <Grid size={12}>
            <Stack direction="row" alignItems="center" justifyContent="justify-between" spacing={1}
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                pt: 1.5,
              }}
            >
              <Stack direction="column">
                <Typography component="h2" variant="h6">
                  {t('members')}
                </Typography>
                <Typography component="h2" variant="subtitle2">
                  {t('members-description')}
                </Typography>
              </Stack>
              <Button variant="contained" color="primary" onClick={() => setVisible(!visible)}>
                {t('add-member')}
              </Button>
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
      </>
      <ConfirmationDialog
        visible={confirmationDialogVisible}
        onCancel={() => setConfirmationDialogVisible(false)}
        onConfirm={() => removeTeamMember(selectedMember)}
        title={t('confirm-delete-member')}
      >
        {t('delete-member-warning', {
          name: selectedMember?.user.name,
          email: selectedMember?.user.email,
        })}
      </ConfirmationDialog>
      <InviteMember visible={visible} setVisible={setVisible} team={team} />
    </>
  );
};

export default Members;
