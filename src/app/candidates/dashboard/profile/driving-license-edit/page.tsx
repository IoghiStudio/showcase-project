import { AddDriving } from '@/components/candidates/Flow/Driving/AddDriving';
import '../page.scss'

const Page = () => (
  <div className="container profile-data">
    <AddDriving forEdit fromDashboard/>
  </div>
);

export default Page;
