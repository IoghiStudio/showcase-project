import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const request: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "live one test",
});


request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 422) {
        // console.log('test')
      } else if (error.response.status === 401) {
        console.log('error 401', error);
        window.location.href = "/";
      } else if (error.response.status === 403) {
        console.log('error 403', error);
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    } else if (error.request) {
    } else {
    }
    return Promise.reject(error);
  }
);

request.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token: string | null = localStorage?.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
