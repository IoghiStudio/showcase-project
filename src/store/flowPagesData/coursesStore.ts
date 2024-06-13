import { ICourse } from '@/services/api/courses.service';
import { atom } from 'recoil';

export const CoursesStore = atom<ICourse[] | null>({
  default: null,
  key: 'courses-store'
});

export const CourseIdStore = atom<number | null>({
  default: null,
  key: 'courseId-store'
});

