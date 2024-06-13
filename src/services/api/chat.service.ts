import { IUserData } from "@/types/UserData";
import request from "../base.service";
import { ICompanyData } from "@/types/CompanyData";
import { IFullPosition } from "./jobPosition.service";
import { IOfferReceived } from "./offers.service";

export enum MessageTypeEntity {
  Candidate = 'CANDIDATE',
  Company = 'COMPANY',
};

interface IChatJobOffer {
  JobOffer: IOfferReceived;
  candidate_id: number;
  chat_room_id: number;
  chat_to_job_offer_id: number;
  company_id: number;
  createdAt: string;
  job_offer_id: number;
  updatedAt: string;
};

interface IChatApplicantInsideApplicant {
  accepted_rejected_on: string;
  applicant_id: number;
  candidate_id: number;
  company_id: number;
  createdAt: string;
  favorite: number;
  job_id: number;
  job_position_id: number;
  reason: null | string;
  status: string;
  updatedAt: string;
  visible: number;
}

interface IChatApplicant {
  Applicant: IChatApplicantInsideApplicant
  applicant_id: number;
  candidate_id: number;
  chat_room_id: number;
  chat_to_applicant_id: number;
  company_id: number;
  createdAt: string;
  updatedAt: string;
};

export interface IChatRoomMessage {
  candidate_id: number;
  chat_room_id: number;
  company_id: number;
  createdAt: string;
  message: string;
  message_id: number;
  seen: number;
  type: MessageTypeEntity;
  updatedAt: string;
};

export interface IChatRoom {
  Applicant: null | IChatApplicant;
  JobOffer: null | IChatJobOffer;
  Candidate: IUserData;
  Company: ICompanyData;
  JobPosition: IFullPosition;
  candidate_id: number;
  chat_room_id: number;
  company_id: number;
  intro_message: string;
  job_position_id: number;
  latestMessage: IChatRoomMessage;
  type: string;
  unseenMessages: number;
};

export interface ISendMessage {
  chat_room_id: number,
  candidate_id: number,
  company_id: number,
  type: MessageTypeEntity,
  message: string;
};

export const getCandidateChatRooms = async () => await request.get('chatroom/candidate');
export const getCompanyChatRooms = async () => await request.get('chatroom/company');
export const getOneCandidateChat = async (chatRoomId: number) => await request.get(`chatroom/candidate/${chatRoomId}`);
export const getOneCompanyChat = async (chatRoomId: number) => await request.get(`chatroom/company/${chatRoomId}`);
export const sendMessage = async (message: ISendMessage) => await request.post('message', message);

export interface IChatMessages {
  Candidate: IUserData;
  ChatToApplicant: null | any;
  ChatToJobOffer: IChatJobOffer;
  Company: ICompanyData;
  JobPosition: IFullPosition;
  Messages: IChatRoomMessage[];
  candidate_id: number;
  chat_room_id: number;
  company_id: number;
  createdAt: string;
  intro_message: string;
  job_position_id: number;
  status: string;
  type: number;
  updatedAt: string;
};


