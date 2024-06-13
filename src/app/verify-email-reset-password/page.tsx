import { ResetInputEmail } from "@/components/candidates/ResetPassword/ResetInputEmail";
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

    <ResetInputEmail forCompany />
  </>
)

export default Page;
