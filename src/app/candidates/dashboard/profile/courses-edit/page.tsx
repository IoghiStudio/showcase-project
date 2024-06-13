import '../page.scss'
import { AddCourses } from '@/components/candidates/Flow/Courses/AddCourses';

const Page = () => (
  <div className="container profile-data">
    <AddCourses forEdit fromDashboard/>
  </div>
);

export default Page;
