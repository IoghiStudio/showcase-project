'use client';
import './ProfileImage.scss';
import cn from 'classnames';
import { FlowPageName, FlowPageText } from "@/types/FlowPage";
import { FlowContainer } from "../FlowContainer";
import { ChangeEvent, useState } from "react";
import { PictureUploadModal } from '@/components/utils/PictureUploadModal';
import { useRouter } from 'next/navigation';
import { Arrows } from '@/components/utils/Arrows';
import { StepIcon } from '@/components/utils/StepIcon';
import { updateUserImage } from '@/services/api/userFiles.service';
import { useSetRecoilState } from 'recoil';
import { UserImageStore } from '@/store/fileStore';

const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: 'Your profile picture should be one that reflects your attitude at work, like a smiling selfie.'
  },
  {
    id: '2',
    text: 'Employers like to hire persons who are serious about their jobs, so, no pictures from the beach, from parties, weddings, or other similar events.'
  },
  {
    id: '3',
    text: 'Also, no ID pictures, as in those you usually are not allowed to smile, so you might end up looking nervous.'
  },
  {
    id: '4',
    text: 'In your profile picture, you should wear a shirt, in a neutral color, you should be smiling, not laughing, be relaxed, and make sure that the background of your picture is also decent..'
  },
];

export const ProfileImage = () => {
  const [fileImage, setFileImage] = useState<File>();
  const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const setUserImage = useSetRecoilState(UserImageStore);

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
        const resp = await updateUserImage({ base64string });
        setUserImage(resp.data.data.data.profile_image);
        router.push("/candidates/flow/subscription/");
      } catch (error) {
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <FlowContainer
        title={'ADD YOUR PROFILE IMAGE'}
        text={'Add your profile and CV portrait image'}
        pageName={FlowPageName.Picture}
        infoTexts={infoTexts}
      >
        <div className="profile-image">
          <div className={"profile-image__content"}>
            <div className="profile-image__field">
              <input
                type="file"
                accept="image/*"
                className={cn("profile-image__drag-drop", {
                  "upload__input--drag-drop--disbled": isModelOpen,
                })}
                onChange={handleFileChange}
              />

              <div className="profile-image__field-icon"/>

              <div className="profile-image__field-title">
                Add Photo Image
              </div>

              <div className="profile-image__field-text">
                or drag & drop
              </div>
            </div>
          </div>

          <div className="profile-image__bottom">
            <div className="profile-image__add">
              <label htmlFor="upload-file" className="profile-image__upload-label">
                <input
                  type="file"
                  accept="image/*"
                  id="upload-file"
                  className="profile-image__upload-input"
                  onChange={handleFileChange}
                  onClick={(event) => {
                    const element = event.target as HTMLInputElement;
                    element.value = "";
                  }}
                />

                <div className="profile-image__add-button">
                  Add Photo
                </div>
              </label>

              <div className="profile-image__add-text">
                You need to add your profile image in order to continue to the next step.
              </div>
            </div>
          </div>

          <PictureUploadModal
            isOpen={isModelOpen}
            isSaveLoading={isLoading}
            file={fileImage}
            onSave={(file) => handleSaveImage(file)}
            onClose={() => {
              setIsModelOpen(false);
            }}
          />
        </div>
      </FlowContainer>

      <div className="steps steps--mobile">
        <StepIcon
          iconName={"driving"}
          status={"done"}
          title={"Driving"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"picture"}
          status={"current"}
          title={"Picture"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} arrowsCount={3} />
        </div>

        <StepIcon
          iconName={"subscription"}
          status={"undone"}
          title={"Subscription"}
        />
      </div>

      <div className="steps steps--desktop">
        <StepIcon
          iconName={"info"}
          status={"done"}
          title={"Information"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"residency"}
          status={"done"}
          title={"Residency"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"experience"}
          status={"done"}
          title={"Experience"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"education"}
          status={"done"}
          title={"Education"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"certifications"}
          status={"done"}
          title={"Certification"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"courses"}
          status={"done"}
          title={"Courses"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"language"}
          status={"done"}
          title={"Language"}
          />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"driving"}
          status={"done"}
          title={"Driving"}
        />

        <div className="steps-arrows">
          <Arrows toRight={false} />
        </div>

        <StepIcon
          iconName={"picture"}
          status={"current"}
          title={"Picture"}
        />

        <div className="steps-arrows">
          <Arrows toRight={true} />
        </div>

        <StepIcon
          iconName={"subscription"}
          status={"undone"}
          title={"Subscription"}
        />
      </div>
    </>
  )
}
