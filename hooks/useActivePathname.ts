import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useActivePathname = (): string | null => {
  const { asPath, isReady } = useRouter();
  const [activePathname, setActivePathname] = useState<null | string>(null);

  useEffect(() => {
    if (isReady && asPath) {
      const activePathname = new URL(asPath, location.href).pathname;
      setActivePathname(activePathname);
    }
  }, [asPath, isReady]);

  return activePathname;
};

export default useActivePathname;