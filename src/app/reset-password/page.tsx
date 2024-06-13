import { ResetPassword } from '@/components/candidates/ResetPassword';
import { hotjarScriptCompanies } from '@/components/utils/utils';
import Head from 'next/head';
import Script from 'next/script';

const Page = () => (
  <>
    <Head>
      <Script
        id={hotjarScriptCompanies}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: hotjarScriptCompanies }}
      />
    </Head>

    <ResetPassword forCompany />;
  </>
)
export default Page;
