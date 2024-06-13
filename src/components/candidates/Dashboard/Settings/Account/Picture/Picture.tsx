'use client';
import './Picture.scss';
import { useRecoilState } from 'recoil';
import cn from 'classnames';
import { IUserData } from '@/types/UserData';
import { UserDataStore } from '@/store/userDataStore';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { getCompanyData, getUserData } from '@/services/api/authUser.service';
import { PictureUploadModal } from '@/components/utils/PictureUploadModal';
import { updateCompanyLogo, updateCompanyUserImage, updateUserImage } from '@/services/api/userFiles.service';
import { ICompanyData } from '@/types/CompanyData';
import { CompanyDataStore } from '@/store/companyDataStore';
import { formatMediaUrl } from '@/components/utils/utils';

type Props = {
  forCompany?: boolean;
  forCompanyLogo?: boolean;
};

export const Picture: React.FC<Props> = ({
  forCompany = false,
  forCompanyLogo = false,
}) => {
  const [companyData, setCompanyData] = useRecoilState(CompanyDataStore);
  const [userData, setUserData] = useRecoilState(UserDataStore);
  const [fileImage, setFileImage] = useState<File>();
  const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUserData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getUserData();
      const userDataFecthed: IUserData = resp.data.data.data;
      setUserData(userDataFecthed);
    } catch (error) {}
  }, []);

  const fetchCompanyData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyData();
      const companyDataFecthed: ICompanyData = resp.data.data.data;
      setCompanyData(companyDataFecthed);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!forCompany) {
      if (!userData) fetchUserData();
    } else {
      if (!companyData) fetchCompanyData();
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length) {
      const selectedFile = e.target.files[0];
      setFileImage(selectedFile);
      setIsModelOpen(true);

      e.target.value = '';
    }
  };

  const handleSaveImage = async (file: File) => {
    if (file) {
      try {
        setIsLoading(true);
        const base64string = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve((event.target?.result as string)?.split(',')[1]);
          reader.readAsDataURL(file);
        });
        if (!forCompany) {
          await updateUserImage({ base64string });
          fetchUserData();
        } else {
          if (forCompanyLogo) {
            await updateCompanyLogo({ base64string });
          } else {
            await updateCompanyUserImage({ base64string });
          }

          fetchCompanyData();
        }
        setIsModelOpen(false);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="container picture">
      <div className="container__title">
        {!forCompany && 'Profile Picture'}
        {forCompany && forCompanyLogo && 'Company Logo'}
        {forCompany && !forCompanyLogo && 'User Picture'}
      </div>

      <div className="container__text">
        {!forCompany || (forCompany && !forCompanyLogo)? 'Edit or change your picture' : 'Edit or change the logo'}
      </div>

      {!forCompany && (
        <img
          className="picture__image"
          src={userData?.profile_image || ''}
          alt='profile picture'
        />
      )}

      {forCompany && forCompanyLogo && (
        <img
          className="picture__image picture__image--logo"
          src={companyData?.company_logo || formatMediaUrl(
            `flag-icon-${companyData?.Country.alpha_2.toLowerCase() || 'globe'}.svg`,
            "flags/"
          )}
          alt='profile picture'
        />
      )}

      {forCompany && !forCompanyLogo && (
        <img
          className="picture__image"
          src={companyData?.profile_image || formatMediaUrl(
            `flag-icon-${companyData?.Country.alpha_2.toLowerCase() || 'globe'}.svg`,
            "flags/"
          )}
          alt='profile picture'
        />
      )}

      <label
        className={cn(
          "picture__button",
        )}
        htmlFor='picture__input'
      >
        <div className='container__change-btn'>
          Change
        </div>
      </label>

      <input
        type="file"
        accept="image/*"
        id='picture__input'
        className="picture__input"
        onClick={(event) => {
          const element = event.target as HTMLInputElement;
          element.value = '';
        }}
        onChange={handleFileChange}
      />

      <PictureUploadModal
        isOpen={isModelOpen}
        isSaveLoading={isLoading}
        file={fileImage}
        onSave={(file) => handleSaveImage(file)}
        onClose={() => {
          setIsModelOpen(false);
        }}
        forCompanyLogo={forCompanyLogo}
      />
    </div>
  )
}
