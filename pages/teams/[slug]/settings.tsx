import { Error, Loading } from '@/components/shared';
import { AccessControl } from '@/components/shared/AccessControl';
import { RemoveTeam, TeamSettings, TeamTab } from '@/components/team';

import RemoveTeamMui from '@/components/team/mui/RemoveTeam';
import TeamSettingsMui from '@/components/team/mui/TeamSettings';
import TeamTabMui from '@/components/team/mui/TeamTab';

import env from '@/lib/env';
import useTeam from 'hooks/useTeam';
import type { GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { TeamFeature } from 'types';
import TeamLayout from '../TeamLayout'

const Settings = ({ teamFeatures }: { teamFeatures: TeamFeature }) => {
  const { t } = useTranslation('common');
  const { isLoading, isError, team } = useTeam();

  const RemoveTeamComponent = env.version === 'mui' ? RemoveTeamMui : RemoveTeam;
  const TeamSettingsComponent = env.version === 'mui' ? TeamSettingsMui : TeamSettings;
  const TeamTabComponent = env.version === 'mui' ? TeamTabMui : TeamTab;


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
      <TeamTabComponent activeTab="settings" team={team} teamFeatures={teamFeatures} />
      <div className="space-y-6">
        <TeamSettingsComponent team={team} />
        <AccessControl resource="team" actions={['delete']}>
          <RemoveTeamComponent team={team} allowDelete={teamFeatures.deleteTeam} />
        </AccessControl>
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

export default Settings;
