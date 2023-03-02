import React from 'react';

import { Loader, LoaderSize } from '@components/Loader';

export type WithLoaderProps = React.PropsWithChildren<{
  loading: boolean;
  className?: string;
}>;

const WithLoader: React.FC<WithLoaderProps> = ({ loading, children, className }) => {
  return (
    <>
      {children}
      {loading && <Loader className={className} size={LoaderSize.s} />}
    </>
  );
};

export default WithLoader;
