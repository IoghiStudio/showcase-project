'use client';
import './UploadDoc.scss';
import { Button } from '@/components/utils/Button';
import { ButtonColor } from '@/types/ButtonColor';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { CompanyDataStore } from '@/store/companyDataStore';
import { ICompanyData } from '@/types/CompanyData';
import { AxiosResponse } from 'axios';
import { getCompanyData } from '@/services/api/authUser.service';
import { IAcceptedDocuments, IUploadDocuments, getDocumentsAcceptedByCountry, uploadDocuments } from '@/services/api/companyDocs.service';

export const UploadDoc = () => {
  const router = useRouter();
  const [files, setFiles] = useState<File[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [companyData, setCompanyData] = useRecoilState(CompanyDataStore);
  const [docs, setDocs] = useState<IAcceptedDocuments | null>(null);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const fetchCompanyData = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyData();
      const companyDataFecthed: ICompanyData = resp.data.data.data;
      setCompanyData(companyDataFecthed);
      fetchCompanyDocuments(companyDataFecthed)
    } catch (error) {}
  }, []);

  const fetchCompanyDocuments = useCallback(async (compData: ICompanyData) => {
    try {
      const resp: AxiosResponse<any, any> = await getDocumentsAcceptedByCountry();
      const data: IAcceptedDocuments[] = resp.data.data.data;
      const availableDocs: IAcceptedDocuments | null = data.find(m => m.country_code === compData.Country.alpha_2) || null;
      setDocs(availableDocs);
    } catch (error) {}
  }, [companyData]);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false);
      }, 2000);
    }
  }, [showError])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file: File = e.target.files[0];
      if ((file.size / 1_000_000) > 50) {
        setShowError(true);
        e.target.value = '';
        return;
      }

      if (files?.some(f => f.name === file.name)) return;

      setFiles(state => {
        if (!state) {
          return [file];
        } else {
          return [...state, file];
        }
      });

      e.target.value = '';
    }
  };

  const removeDoc = (fileName: string) => {
    if (files) {
      setFiles(files.filter(f => f.name !== fileName))
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve((event.target?.result as string)?.split(',')[1]);
      reader.readAsDataURL(file);
    });
  };

  const handleSendDocuments = useCallback(async () => {
    if (!files) return;

    try {
      const base64Strings: string[] = await Promise.all(
        files.map(async (file) => {
          return await convertFileToBase64(file);
        })
      );

      const data: IUploadDocuments = {
        base64string: base64Strings
      };

      setIsLoading(true);
      await uploadDocuments(data);
      setConfirmModal(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [files]);

  return (
    <div className="upload-doc">
      {confirmModal && (
        <div className="upload-doc__modal">
          <div className="upload-doc__modal-content">
            <div className='upload-doc__modal-text'>
              Your documents will be verified by VideoWorkers team, you'll be notified by email in maximum 72 hours with further details about your registration status.
            </div>

            <div onClick={() => setConfirmModal(false)} className="upload-doc__modal-btn">
              Understood
            </div>
          </div>
        </div>
      )}

      <div className="upload-doc__header">
        <div className="upload-doc__head-title">
          Upload company documents
        </div>
      </div>

      <div className="upload-doc__content">
        <div className="upload-doc__title">
          At least one of the following documents:
        </div>

        <div className="upload-doc__names">
          {docs?.documents.map(doc => (
            <div key={doc} className="upload-doc__name">
              {doc}
            </div>
          ))}
        </div>

        <div className="upload-doc__mid">
          <div className="upload-doc__field">
            <input
              type="file"
              accept=".pdf, .doc, .docx, .txt, .csv, .xlsx, .jpg, .jpeg, .png"
              className="upload-doc__drag-drop"
              onChange={handleFileChange}
            />

            <div className="upload-doc__field-icon"/>

            <div className="upload-doc__field-title">
              Add Document
            </div>

            <div className="upload-doc__field-text">
              or drag & drop
            </div>
          </div>

          <div className="upload-doc__list">
          <div className="upload-doc__title">
            Added documents:
          </div>

            {files?.map(file => (
              <div key={file.name} className="upload-doc__item">
                <div className="upload-doc__item-name">
                  {file.name}
                </div>

                <div onClick={() => removeDoc(file.name)} className="upload-doc__item-remove">
                  REMOVE
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="upload-doc__buttons">
          <div className="upload-doc__button upload-doc__button--first">
            {showError && (
              <div className="upload-doc__error">
                MAXIMUM SIZE 50MB
              </div>
            )}
            <label className="upload-doc__label">
              <input
                type="file"
                accept=".pdf, .doc, .docx, .txt, .csv, .xlsx, .jpg, .jpeg, .png"
                id="upload-file"
                className="upload-doc__input"
                onChange={handleFileChange}
                onClick={(event) => {
                  const element: HTMLInputElement = event.target as HTMLInputElement;
                  element.value = "";
                }}
              />

              <Button
                textSmall
                onClick={() => {}}
              >
                UPLOAD DOCUMENT
              </Button>
            </label>
          </div>

          {files && files.length > 0 && (
            <div className="upload-doc__button">
              <Button
                textSmall
                color={ButtonColor.Green}
                loading={isLoading}
                onClick={handleSendDocuments}
              >
                {files.length > 1 ? 'SEND DOCUMENTS' : 'SEND DOCUMENT'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
