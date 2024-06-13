import { Register } from "@/components/companies/Register"
import { hotjarScriptCompanies } from "@/components/utils/utils";
import Head from "next/head";
import Script from "next/script";

const Page = () => (
  <>
    <Head>
      <Script
        id={hotjarScriptCompanies}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: hotjarScriptCompanies }}
      />
    </Head>

    <Register />;
  </>
)
export default Page;
