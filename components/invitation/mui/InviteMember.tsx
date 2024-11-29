import React from 'react';
import { useTranslation } from 'next-i18next';

import type { Team } from '@prisma/client';
import InviteViaEmail from './InviteViaEmail';
import InviteViaLink from './InviteViaLink';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider } from '@mui/material';


interface InviteMemberProps {
  team: Team;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const InviteMember = ({ visible, setVisible, team }: InviteMemberProps) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={visible} onClose={() => setVisible(false)}>
      <DialogTitle>{t('invite-new-member')}</DialogTitle>
      <DialogContent>
          <InviteViaEmail setVisible={setVisible} team={team} />
          <Divider/>
          <InviteViaLink team={team} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setVisible(false)} color="primary">
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteMember;
