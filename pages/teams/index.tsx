import { Teams } from '@/components/team';
import TeamsMui from '@/components/team/mui/Teams';
import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPageWithLayout } from 'types';
import env from '@/lib/env';
import TeamLayout from './TeamLayout'

const AllTeams: NextPageWithLayout = () => {
  const TeamComponent = env.version === 'mui' ? TeamsMui : Teams;
  return <TeamLayout><TeamComponent /></TeamLayout>
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export default AllTeams;
