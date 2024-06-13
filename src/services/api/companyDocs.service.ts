import request from "../base.service";

export interface IUploadDocuments {
  base64string: string[];
};

export interface IAcceptedDocuments {
  company_document_id: number;
  country_code: string;
  createdAtL: string;
  documents: string[]
  updatedAt: string;
};

export const uploadDocuments = async (data: IUploadDocuments) => await request.post('company/upload/files', data);
export const getDocumentsAcceptedByCountry = async () => await request.get('company_documents');
