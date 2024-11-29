import React, { ReactElement } from 'react';
import { Error, Loading } from '@/components/shared';
import TeamLayout from '../TeamLayout'

import { PendingInvitations } from '@/components/invitation';
import { Members, TeamTab } from '@/components/team';


import PendingInvitationsMui from '@/components/invitation/mui/PendingInvitations';
import MembersMui from '@/components/team/mui/Members';
import TeamTabMui from '@/components/team/mui/TeamTab';

import env from '@/lib/env';
import useTeam from 'hooks/useTeam';
import { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const TeamMembers = ({ teamFeatures }) => {
  const { t } = useTranslation('common');
  const { isLoading, isError, team } = useTeam();

  const MembersComponent = env.version === 'mui' ? MembersMui : Members;
  const TeamTabComponent = env.version === 'mui' ? TeamTabMui : TeamTab;
  const PendingInvitationsComponent = env.version === 'mui' ? PendingInvitationsMui : PendingInvitations;


  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!team) {
    return <Error message={t('team-not-found')} />;
  }

  return (
    <TeamLayout>
      <TeamTabComponent activeTab="members" team={team} teamFeatures={teamFeatures} />
      <div className="space-y-6">
        <MembersComponent team={team} />
        <PendingInvitationsComponent team={team} />
      </div>
    </TeamLayout>
  );
};

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
      teamFeatures: env.teamFeatures,
    },
  };
}

export default TeamMembers;