import { QueryClient, QueryClientProvider } from 'react-query';

import { Home } from 'components';

const queryClient = new QueryClient();

export default () => (
  <QueryClientProvider client={queryClient}>
    <Home />
  </QueryClientProvider>
);
