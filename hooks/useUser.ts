import fetcher from '@/lib/fetcher';
import type { User } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import type { ApiResponse } from 'types';
import { ClientUserData } from 'models/user';

const useUser = () => {

  const { data, error, isLoading } = useSWR<ApiResponse<User>>(
    '/api/users',
    fetcher
  );

  return {
    isLoading,
    isError: error,
    user: data?.data as ClientUserData,
  };
};

export default useUser;
