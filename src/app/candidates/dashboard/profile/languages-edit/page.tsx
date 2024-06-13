import { AddLanguages } from "@/components/candidates/Flow/Languages/AddLanguages.tsx";
import '../page.scss'

const Page = () => (
  <div className="container profile-data">
    <AddLanguages forEdit fromDashboard/>
  </div>
);

export default Page;
