'use client';
import { LoadingModal } from '@/components/utils/LoadingModal';
import './SaveButtons.scss';
import { Button } from '@/components/utils/Button';
import { ButtonColor } from '@/types/ButtonColor';
import { SaveButtonType } from '@/types/SaveButtonType';
import { useState } from 'react';
import classNames from 'classnames';

type Props = {
  buttonsType: SaveButtonType,
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void | null;
  isSaveLoading?: boolean;
};

export const SaveButtons: React.FC<Props> = ({
  buttonsType,
  onSave,
  onCancel,
  onDelete = () => {},
  isSaveLoading
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  return (
    <div className={classNames("save-buttons", {
      "save-buttons--add": buttonsType === SaveButtonType.Add,
    })}>
      <div className={classNames("save-buttons__button save-buttons__button--add", {
        "save-buttons__button--for-add": buttonsType === SaveButtonType.Add,
      })}>
        <Button
          color={ButtonColor.Green}
          onClick={onSave}
          loading={isSaveLoading}
        >
          Save
        </Button>
      </div>

      <div className="save-buttons__right">
        <div className="save-buttons__button">
          <Button
            color={ButtonColor.White}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>

        {buttonsType === SaveButtonType.Update && (
          <div className="save-buttons__button save-buttons__button--delete">
            <Button
              color={ButtonColor.Red}
              onClick={() => {
                onDelete();
                setIsDeleting(true);
              }}
            >
              {!isDeleting ? 'Delete' : <LoadingModal/>}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
