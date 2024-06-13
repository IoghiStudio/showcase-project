import request from "../base.service";

export interface ICourse {
  training_course_id?: number,
  candidate_id?: number,
  course_name: string,
  start_date: string,
  end_date: string,
  institution: string,
  description?: string | null,
  createdAt?: string,
  updatedAt?: string,
};

export const getCourses = async () => await request.get('candidate/flow/training/course');
export const getOneCourse = async (id: number) => await request.get(`candidate/flow/training/course/${id}`);
export const postCourse = async (course: ICourse) => await request.post('candidate/flow/training/course', course);
export const updateCourse = async (id: number, course: ICourse) => await request.put(`candidate/flow/training/course/update/${id}`, course);
export const deleteCourse = async (id: number) => await request.delete(`candidate/flow/training/course/delete/${id}`);
