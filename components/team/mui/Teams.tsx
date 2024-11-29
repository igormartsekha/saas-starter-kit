import { LetterAvatar } from '@/components/shared';
import { defaultHeaders } from '@/lib/common';
import { Team } from '@prisma/client';
import useTeams from 'hooks/useTeams';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
// import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import { useRouter } from 'next/router';
import ConfirmationDialog from '@/components/shared/mui/ConfirmationDialog';
import { WithLoadingAndError } from '@/components/shared';
import { CreateTeam } from '@/components/team';
import { Table } from '@/components/shared/table/Table';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { green } from 'tailwindcss/colors';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import HeaderTitle from '@/components/shared/mui/HeaderTitle';
import AvatarWithTitle from '@/components/shared/mui/AvatarWithTitle';


import CustomizedDataGrid from '@/components/mui/dashboard/components/CustomizedDataGrid';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { maxLengthPolicies } from '@/lib/common';


const Teams = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [team, setTeam] = useState<Team | null>(null);
  const { isLoading, isError, teams, mutateTeams } = useTeams();
  const [askConfirmation, setAskConfirmation] = useState(false);
  const [createTeamVisible, setCreateTeamVisible] = useState(false);

  const { newTeam } = router.query as { newTeam: string };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (newTeam) {
      setCreateTeamVisible(true);
    }
  }, [newTeam]);

  const leaveTeam = async (team: Team) => {
    const response = await fetch(`/api/teams/${team.slug}/members`, {
      method: 'PUT',
      headers: defaultHeaders,
    });

    const json = (await response.json()) as ApiResponse;

    if (!response.ok) {
      toast.error(json.error.message);
      return;
    }

    toast.success(t('leave-team-success'));
    mutateTeams();
  };



  function renderLeaveTeam(team) {
    return (
      <Button
        variant="outlined"
        color="error"
        onClick={() => {
          setTeam(team);
          setAskConfirmation(true);
        }}
      >
        {t('leave-team')}
      </Button>
    )
  }

  function renderName(team) {
    return (
      <>
        <Link href={`/teams/${team.slug}/members`}>
          <AvatarWithTitle color="text.primary" text={team.name} style={{ textDecoration: 'underline' }} />
        </Link>
      </>
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'col1',
      headerName: t('name').toUpperCase(),
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => renderName(params.value as any)
    },
    {
      field: 'col2',
      headerName: t('members').toUpperCase(),
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'col3',
      headerName: t('created-at').toUpperCase(),
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'col4',
      headerName: t('actions').toUpperCase(),
      flex: 0,
      minWidth: 130,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => renderLeaveTeam(params.value as any),
    },
  ];



  // ... existing code ...
  const rows: GridRowsProp = teams?.map((team, index) => ({
    id: team.id, // Ensure unique id
    col1: team, // Use actual team name
    col2: team._count.members.toString(), // Use actual member count
    col3: new Date(team.createdAt).toDateString(), // Use actual creation date
    col4: team, // Placeholder for actions
  })) || []; // Fallback to empty array if teams is undefined

  const CreateNewTeamDialog = () => {
    const formik = useFormik({
      initialValues: {
        name: '',
      },
      validationSchema: Yup.object().shape({
        name: Yup.string().required().max(maxLengthPolicies.team),
      }),
      onSubmit: async (values) => {
        const response = await fetch('/api/teams/', {
          method: 'POST',
          headers: defaultHeaders,
          body: JSON.stringify(values),
        });

        const json = (await response.json()) as ApiResponse<Team>;

        if (!response.ok) {
          toast.error(json.error.message);
          return;
        }

        formik.resetForm();
        mutateTeams();
        setCreateTeamVisible(false);
        toast.success(t('team-created'));
        router.push(`/teams/${json.data.slug}/settings`);
      },
    });
    return (
      <Dialog
        open={createTeamVisible}
        onClose={() => setCreateTeamVisible(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            formik.handleSubmit(event)
          },
        }}
      >
        <DialogTitle>{t('create-team')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('members-of-a-team')}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label={t('name')}
            placeholder={t('team-name')}
            type="text"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.name}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateTeamVisible(false)}>{t('close')}</Button>
          <Button
            type="submit"
            disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
          >{t('create-team')}</Button>
        </DialogActions>
      </Dialog>
    )
  }

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
                {t('all-teams')}
              </Typography>
              <Typography component="h2" variant="subtitle2" sx={{ mb: 2 }}>
                {t('team-listed')}
              </Typography>
            </Stack>
            <Button variant="contained" color="primary" onClick={() => setCreateTeamVisible(!createTeamVisible)}>
              {t('create-team')}
            </Button>
          </Stack>
        </Grid>
        <Grid size={12}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            disableColumnResize={true}
            pageSizeOptions={[5, 10]}
          />
        </Grid>
      </Grid>
      <ConfirmationDialog
        visible={askConfirmation}
        title={t('leave-team') + " " + team?.name}
        onCancel={() => setAskConfirmation(false)}
        onConfirm={() => {
          if (team) {
            leaveTeam(team);
          }
        }}
        confirmText={t('leave-team')}
      >
        {t('remove-team-confirmation')}
      </ConfirmationDialog>
      <CreateNewTeamDialog />
    </>
  );
};

export default Teams;
