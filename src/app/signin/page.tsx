import { Login } from "@/components/companies/Login";
import './page.scss';
import Head from 'next/head'
import Script from "next/script";
import { hotjarScriptCompanies } from "@/components/utils/utils";

const Page = () => (
  <div className="signin">
    <Head>
      <Script
        id={hotjarScriptCompanies}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: hotjarScriptCompanies }}
      />
    </Head>

    <Login/>
  </div>
);
export default Page;
