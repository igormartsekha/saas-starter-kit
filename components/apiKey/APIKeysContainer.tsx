import { Error, Loading } from '@/components/shared';
import { TeamTab } from '@/components/team';
import TeamTabMui from '@/components/team/mui/TeamTab';
import useTeam from 'hooks/useTeam';
import { useTranslation } from 'next-i18next';
import APIKeys from './APIKeys';
import APIKeysMui from './mui/APIKeys';
import { TeamFeature } from 'types';
import env from '@/lib/env';

const APIKeysContainer = ({ teamFeatures }: { teamFeatures: TeamFeature }) => {
  const { t } = useTranslation('common');

  const { isLoading, isError, team } = useTeam();

  const APIKeysComponent = env.version === 'mui' ? APIKeysMui : APIKeys;
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
    <>
      <TeamTabComponent activeTab="api-keys" team={team} teamFeatures={teamFeatures} />
      <APIKeysComponent team={team} />
    </>
  );
};

export default APIKeysContainer;
