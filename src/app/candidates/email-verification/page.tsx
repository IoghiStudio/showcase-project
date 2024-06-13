import { EmailConfirm } from "@/components/candidates/EmailConfirm";
import { hotjarScriptCandidates } from "@/components/utils/utils";
import Head from "next/head";
import Script from "next/script";

const Page = () => (
  <>
    <Head>
      <Script
        id={hotjarScriptCandidates}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: hotjarScriptCandidates }}
      />
    </Head>

    <EmailConfirm />;
  </>
)

export default Page;
