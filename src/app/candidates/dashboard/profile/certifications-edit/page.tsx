import '../page.scss'
import { AddCertifications } from '@/components/candidates/Flow/Certifications/AddCetifications';

const Page = () => (
  <div className="container profile-data">
    <AddCertifications forEdit fromDashboard/>
  </div>
);

export default Page;
