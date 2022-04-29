import Script from 'next/script';
import { Html, Head, Main, NextScript } from 'next/document';

const GA_MEASUREMENT_ID = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID;

export default () => (
  <Html>
    <Head />
    <body>
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
      <Main />
      <NextScript />
    </body>
  </Html>
);
