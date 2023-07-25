import { Suspense } from 'react';
import Loader from './Loader';

const Loadable = (Component) => ({ loading, ...props }) => (
  <Suspense fallback={loading ? <Loader /> : null}>
    {loading ? null : <Component {...props} />}
  </Suspense>
);

export default Loadable;

