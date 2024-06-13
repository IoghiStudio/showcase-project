'use client';
import '@/styles/globals.scss';
import '@/components/candidates/Dashboard/CommonStyles.scss';
import './layout.scss';
import cn from 'classnames';
import { Open_Sans, Montserrat } from "next/font/google";
import { RecoilRoot } from 'recoil';

import Hotjar from '@hotjar/browser';
import { useEffect } from 'react';

const opensans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700", "800", ],
});

const monserrat = Montserrat({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-monserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

type Props = {
  children: React.ReactNode;
  gtmId: string;
};

export default function RootLayout({ children, gtmId }: Props) {
  useEffect(() => {
    const stateValue: boolean = window.location.pathname.includes('candidates');
    if (stateValue) {
      Hotjar.init(3806937, 6);
    } else {
      Hotjar.init(3806938, 6);
    }
  });

  return (
    <html
      lang="en"
      className={cn(
        [opensans.variable],
        [monserrat.variable],
        'main-layout'
      )}>
      <head>
        <title>VideoWorkers</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <link
          rel="icon"
          href="/logo-icon.png"
          sizes="<generated>"
        />
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-FY7601NZYL"></script>
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-FY7601NZYL');
            `}
          </script>

          <script>
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1369283763708725');
              fbq('track', 'PageView');
            `}
          </script>

          <noscript><img height="1" width="1" style={{display: 'none'}}
          src="https://www.facebook.com/tr?id=1369283763708725&ev=PageView&noscript=1"
          /></noscript>

          <script>
            {`
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

                ttq.load('CMIFQCJC77UFIL1RAF9G');
                ttq.page();
              }(window, document, 'ttq');
            `}
          </script>
      </head>

      <RecoilRoot>
        <body className='main-layout__content'>
          {children}
        </body>
      </RecoilRoot>
    </html>
  )
}
