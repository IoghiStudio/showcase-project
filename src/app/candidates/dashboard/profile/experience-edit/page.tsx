import '../page.scss'
import { AddExperience } from "@/components/candidates/Flow/Experience/AddExperience";

const Page = () => (
  <div className="container profile-data">
    <AddExperience forEdit fromDashboard={true}/>
  </div>
);

export default Page;
