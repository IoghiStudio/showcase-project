'use client'
import './PictureUploadModal.scss';
import cn from "classnames";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AvatarEditor from 'react-avatar-editor';
import { LoadingModal } from '../LoadingModal';

interface Props {
  isOpen: boolean;
  file: File | undefined | string | null;
  onClose: () => void;
  onSave: (file: File) => void;
  isSaveLoading?: boolean;
  forCompanyLogo?: boolean;
};

export const PictureUploadModal: React.FC<Props> = ({
  isOpen,
  file,
  onClose,
  onSave,
  isSaveLoading = false,
  forCompanyLogo = false
}) => {
  const imageEditorRef = useRef(null);
  const [zoomRange, setZoomRange] = useState<number>(1);
  const [forMobile, setForMobile] = useState(false);
  const [windowWidth, setWindowSize] = useState(1000);

  useLayoutEffect(() => {
    const handleWindowResize = () => {
      const newWindowWidth = window.innerWidth;
      setWindowSize(newWindowWidth);
      setForMobile(newWindowWidth <= 744);
    };

    handleWindowResize(); // Set initial state
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const getImageCrop = async () => {
    const current = imageEditorRef?.current as any;
    const canvas: any = current?.getImage().toDataURL();

    fetch(canvas)
      .then((res) => res.blob())
      .then(async (blob) => {
        const file = new File([blob], "profile.png", { type: "image/png" });
        onSave(file);
      });
  };

  return (
    <div
      className={cn(
        "pum-container",
        {
          "pum-container--disabled": !isOpen,
        }
      )}
    >
      <div className="pum">
        <div className="pum__top">
          <div className="pum__headline">
            <div className="pum__title">
              EDIT PHOTO
            </div>

            <div onClick={onClose} className='pum__cross'/>
          </div>

          <div className="pum__text">
            Adjust your image to fit nicely into the circle
          </div>
        </div>

        <div className="pum__center">
          <AvatarEditor
            scale={zoomRange}
            rotate={0}
            width={forMobile? 200 : 250}
            height={forMobile? 200 : 250}
            border={forMobile? 60 : 100}
            image={file || ""}
            borderRadius={!forCompanyLogo ? 200 : 70}
            ref={imageEditorRef}
            disableHiDPIScaling={true}
          />
        </div>

        <div className="pum__zoom">
          <div
            className="pum__zoom-icon pum__zoom-icon--minus"
            onClick={() => {
              if (zoomRange > 1) {
                setZoomRange(zoomRange - 0.1);
              }
            }}
          />

          <input
            className="pum__zoom-range"
            type="range"
            min={1}
            max={2}
            step={0.1}
            value={zoomRange}
            onChange={(e) => setZoomRange(+e.target.value)}
          />

          <div
            className="pum__zoom-icon pum__zoom-icon--plus"
            onClick={() => {
              if (zoomRange < 2) {
                setZoomRange(zoomRange + 0.1);
              }
            }}
          />
        </div>

        <div
          className="pum__save"
          onClick={getImageCrop}
        >
          {!isSaveLoading ? 'Save' : <LoadingModal />}
        </div>
      </div>
    </div>
  );
}
