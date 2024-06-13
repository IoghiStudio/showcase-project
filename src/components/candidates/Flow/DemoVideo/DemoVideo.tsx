'use client';
import './DemoVideo.scss';
import cn from 'classnames';
import { FlowPageName, FlowPageText } from "@/types/FlowPage";
import { FlowContainer } from "../FlowContainer";
import { NextStep, NextStepInfo } from "../NextStep";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { IPositionVideo, updatePositionVideo } from '@/services/api/jobPosition.service';

export const infoTexts: FlowPageText[] = [
  {
    id: '1',
    text: 'You cannot apply for jobs and be selected by any employer if you don’t have a demo video uploaded.'
  },
  {
    id: '2',
    text: 'Please make sure that your video respects the guidance below, in order to increase your chances to obtain your dream job.'
  },
  {
    id: '3',
    text: 'All the demo videos will be checked by the VideoWorkers team, and if they are not compliant with the guidance the account will be suspended till the video is replaced with a good one.'
  },
];

export const DemoVideo = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false);
      }, 2000);
    }
  }, [showError])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      if ((file.size / 1_000_000) > 200) {
        setShowError(true);
        setVideoFile(null);
        e.target.value = '';
        return;
      }

      setVideoFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleUploadSave = async () => {
    if (!videoFile) {
      return;
    }

    try {
      setIsLoading(true);
      const positionId: string | null = localStorage.getItem('flow_position_id');

      if (!positionId) {
        router.push('/candidates/flow/signin/');
        return;
      }

      const base64string = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve((event.target?.result as string)?.split(',')[1]);
        reader.readAsDataURL(videoFile);
      });

      const data: IPositionVideo = {
        video: base64string,
      };

      await updatePositionVideo(+positionId, data);
      router.push('/candidates/dashboard');
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <FlowContainer
      title={'ADD A VIDEO PRESENTATION'}
      text={'Add a video presentation of your skills relevant to the selected job position.'}
      pageName={FlowPageName.DemoVideo}
      infoTexts={infoTexts}
    >
      <div className="demo-video">
        <div className={"demo-video__content"}>
          {!videoFile ? (
            <div className="demo-video__field">
              <input
                type="file"
                accept="video/*"
                className={cn("demo-video__drag-drop", {
                  "upload__input--drag-drop--disbled": isModelOpen,
                })}
                onChange={handleFileChange}
              />

              <div className="demo-video__field-icon"/>

              <div className="demo-video__field-title">
                Add Demo Video
              </div>

              <div className="demo-video__field-text">
                or drag & drop
              </div>
            </div>
          ) : (
            <video className='demo-video__video' width="400" controls>
              <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <div className="demo-video__bottom">
          {true && (
            <div className="demo-video__error">
              MAXIMUM SIZE 200MB, loading might take some time depending on your connection.
            </div>
          )}

          {videoFile ? (
            <>
              <div className="demo-video__remove">
                <div className="demo-video__remove-left">
                  VIDEO UPLOADED
                </div>

                <div onClick={() => setVideoFile(null)} className="demo-video__remove-cross-container">
                  <div className="demo-video__remove-cross"/>
                </div>
              </div>

              <NextStep
                nextStep={NextStepInfo.Dashboard}
                isLoading={isLoading}
                onClick={handleUploadSave}
              />
            </>
          ) : (
            <div className="demo-video__add">
              <label htmlFor="upload-file" className="demo-video__upload-label">
                <input
                  type="file"
                  accept="video/*"
                  id="upload-file"
                  className="demo-video__upload-input"
                  onChange={handleFileChange}
                  onClick={(event) => {
                    const element = event.target as HTMLInputElement;
                    element.value = "";
                  }}
                />

                <div className="demo-video__add-button">
                  Add Video
                </div>
              </label>

              <div className="demo-video__add-text">
                You need to add your skills video in order to continue to the next step.
              </div>
            </div>
          )}
        </div>
      </div>
    </FlowContainer>
  )
}
