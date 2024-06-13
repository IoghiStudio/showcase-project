import './page.scss';
import { CLogin } from "@/components/candidates/CLogin";
import { CRegister } from "@/components/candidates/CRegister";
import { hotjarScriptCandidates } from '@/components/utils/utils';
import Head from 'next/head';
import Script from 'next/script';

const Page = () => {
  return (
    <div className="csignin">
      <Head>
        <Script
          id={hotjarScriptCandidates}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: hotjarScriptCandidates }}
        />
      </Head>

      <div className="csignin__register">
        <CRegister />
      </div>

      <div className="csignin__divider"/>

      <div className="csignin__login">
        <CLogin />
      </div>
    </div>
  )
}

export default Page;
