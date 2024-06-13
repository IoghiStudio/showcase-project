import { AddEducation } from '@/components/candidates/Flow/Education/AddEducation';
import '../page.scss'

const Page = () => (
  <div className="container profile-data">
    <AddEducation forEdit fromDashboard/>
  </div>
);

export default Page;
