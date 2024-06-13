'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('https://videoworkers.com/candidates/');
  }, []);

  return null;
};
export default Page;
