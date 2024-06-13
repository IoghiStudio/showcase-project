import './page.scss';
import { CLogin } from "@/components/candidates/CLogin";
import { CRegister } from "@/components/candidates/CRegister";
import { hotjarScriptCandidates } from '@/components/utils/utils';
import Head from 'next/head';
import Script from 'next/script';

const Page = () => {
  return (
    <div className="csignup">
      <Head>
        <Script
          id={hotjarScriptCandidates}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: hotjarScriptCandidates }}
        />
      </Head>

      <div className="csignup__register">
        <CRegister />
      </div>

      <div className="csignup__divider"/>

      <div className="csignup__login">
        <CLogin />
      </div>
    </div>
  )
}

export default Page;
