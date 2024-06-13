'use client';
import './layout.scss';
import '../../../components/candidates/Flow/CommonBlocks.scss';
import Script from 'next/script';
import Head from 'next/head';
import { hotjarScriptCandidates } from '@/components/utils/utils';

//here will be the middleware to check user data before access
export default function FlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flow-layout">
      <Head>
        <Script
          id={hotjarScriptCandidates}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: hotjarScriptCandidates }}
        />
      </Head>

      {children}
    </div>
  )
}
