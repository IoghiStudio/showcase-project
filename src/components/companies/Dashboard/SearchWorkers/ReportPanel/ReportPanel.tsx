'use client';
import { Label } from '@/components/utils/Label';
import './ReportPanel.scss';
import { FC, useState } from 'react';
import { InputArea } from '@/components/utils/InputArea';

interface Props {
  title: string;
  text: string;
  onSubmit: (description: string) => void;
  onClose: () => void;
};

export const ReportPanel: FC<Props> = ({
  title,
  text,
  onSubmit,
  onClose
}) => {
  const [description, setDescription] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<boolean>(false);

  return (
    <div className="report-panel">
      <div className="container report-panel__content">
        <div className="container__title">
          {title}
        </div>

        <div className="container__text">
          {text}
        </div>

        <div className="container__label">
          <Label title='Reason' secondTitle={`${description.length}/300`}>
            <InputArea
              name={'reason'}
              value={description}
              placeholder='Reason of the report is important for us'
              onChange={(e) => {
                if (e.target.value.length > 300) return;
                if (descriptionError) {
                  setDescriptionError(false);
                }
                setDescription(e.target.value);
              }}
              error={descriptionError}
            />
          </Label>
        </div>

        <div className="report-panel__buttons">
          <div
            className="report-panel__report report-panel__report--cancel"
            onClick={onClose}
          >
            CANCEL
          </div>

          <div
            className="report-panel__report"
            onClick={() => {
              if (!description.length) {
                setDescriptionError(true);
                return;
              }

              onSubmit(description);
            }}
          >
            REPORT
          </div>
        </div>
      </div>
    </div>
  )
}
