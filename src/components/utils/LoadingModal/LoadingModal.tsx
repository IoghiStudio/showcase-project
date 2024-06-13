'use client';
import classNames from 'classnames';
import './LoadingModal.scss';

export enum LoadingModalColor {
  Gray = 'gray',
};

interface Props {
  color?: LoadingModalColor;
};

export const LoadingModal: React.FC<Props> = ({
  color
}) => {
  return (
    <div className={classNames("loading-modal", {
      "loading-modal--gray": color === LoadingModalColor.Gray
    })}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
