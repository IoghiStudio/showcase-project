'use client';
import { Button } from "@/components/utils/Button";
import { ButtonColor } from "@/types/ButtonColor";
import { useEffect } from "react";
import './AddData.scss';
import { useRouter } from "next/navigation";

export enum AddDataPage {
  Experience,
  Education,
  Course,
  Certification,
  Language,
  License,
  Photo,
};

type Props = {
  currentPage: AddDataPage;
  buttonName: string;
  redirectPath: string;
};

export const AddData: React.FC<Props> = ({
  currentPage,
  buttonName,
  redirectPath
}) => {
  const router = useRouter();

  return (
    <div className="add-data">
      <div className="add-data__button">
        <Button
          color={ButtonColor.Green}
          onClick={() => {
            router.push(redirectPath);
          }}
        >
          {buttonName}
        </Button>
      </div>

      <div className="add-data__text">
        {currentPage === AddDataPage.Experience && (
          'Add at least one experience in order to continue to the next step. If you don’t have any, just mark the checkbox and continue.'
        )}

        {currentPage === AddDataPage.Education && (
          'You need to add at least one education in order to continue, or mark the checkbox if you don’t have any.'
        )}

        {currentPage === AddDataPage.Certification && (
          'You need to add at least one certification in order to continue, or mark the checkbox if you don’t have any.'
        )}

        {currentPage === AddDataPage.Course && (
          'You need to add at least one training or course in order to continue, or you can just mark the checkbox if you don’t have any of those.'
        )}

        {currentPage === AddDataPage.Language && (
          'You need to add at least your native language if you don’t know any other foreign languages.'
        )}

        {currentPage === AddDataPage.License && (
          'You need to add at least one driving license in order to continue or mark the checkbox if you don’t have any.'
        )}

        {currentPage === AddDataPage.Photo && (
          'You need to add your profile image in order to continue to the next step.'
        )}
      </div>
    </div>
  )
}
