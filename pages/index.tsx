import Script from 'next/script';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Home } from 'components';

const queryClient = new QueryClient();
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID;

export default () => (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="beforeInteractive"
    />
    <Script id="google-analytics" strategy="beforeInteractive">
      {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', ${GA_MEASUREMENT_ID});
        `}
    </Script>

    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  </>
);
