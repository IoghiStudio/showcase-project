'use client';
import './VideoModal.scss';

interface Props {
  videoUrl: string,
  onClose: () => void;
};

export const VideoModal: React.FC<Props> = ({ videoUrl, onClose }) => {
  return (
    <div className="video-modal" onClick={onClose}>
      <video onClick={e => e.stopPropagation()} className='video-modal__video' width="400" controls>
        <source src={(videoUrl)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
