'use client';
import { useCallback, useEffect, useState } from 'react';
import './MessagesPreview.scss';
import { IChatRoom, getCandidateChatRooms, getCompanyChatRooms } from '@/services/api/chat.service';
import { AxiosResponse } from 'axios';
import { formatMediaUrl, formatTimestamp } from '@/components/utils/utils';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

interface Props {
  forCompany?: boolean;
};

export const MessagesPreview: React.FC<Props> = ({ forCompany }) => {
  const [chatRooms, setChatRooms] = useState<IChatRoom[] | null>(null);
  const router = useRouter();

  const fetchCandidateChatRooms = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCandidateChatRooms();
      const fetchedRooms: IChatRoom[] = resp.data.data.data;
      setChatRooms(fetchedRooms);
    } catch (error) {}
  }, []);

  const fetchCompanyChatRooms = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyChatRooms();
      const fetchedRooms: IChatRoom[] = resp.data.data.data;
      setChatRooms(fetchedRooms);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!forCompany) {
      fetchCandidateChatRooms();
    } else {
      fetchCompanyChatRooms();
    }

    const refetch = setInterval(() => {
      if (!forCompany) {
        fetchCandidateChatRooms();
      } else {
        fetchCompanyChatRooms();
      }
    }, 3000);

    return () => clearInterval(refetch);
  }, []);

  return (
    <div className="container m-p">
      <div onClick={() => router.push('/candidates/dashboard/messages/')} className="m-p__see-all">
        SEE ALL MESSAGES
      </div>

      <div className="m-p__top">
        <div className="container__title">New messages</div>

        {!forCompany ? (
          <div className="container__text">Direct contact with your employers</div>
        ) : (
          <div className="container__text">Direct contact with your candidates</div>
        )}
      </div>

      <div className="m-p__list">
        {chatRooms?.slice(0, 5).map(chat => {
          const {
            Company,
            Candidate,
            unseenMessages,
            latestMessage,
            chat_room_id,
          } = chat;

          return (
            <div
              key={chat_room_id} className="m-p__chat"
              onClick={() => {
                if (!forCompany) {
                  router.push(`/candidates/dashboard/messages?chatRoomId=${chat_room_id}`)
                } else {
                  router.push(`/dashboard/messages?chatRoomId=${chat_room_id}`)
                }
              }}
            >
              {!forCompany ? (
                <img
                  src={Company.company_logo || formatMediaUrl(
                    `flag-icon-${Company?.Country.alpha_2.toLowerCase() || 'globe'}.svg`,
                  )}
                  className='m-p__picture'
                  alt="picture"
                />
              ) : (
                <img
                  className='m-p__picture'
                  src={Candidate.profile_image || ''}
                  alt="picture"
                />
              )}

              <div className="m-p__chat-right">
                <div className="m-p__name">
                  {!forCompany ? (
                    `${Company.name}`
                  ) : (
                    `${Candidate.firstname} ${Candidate.lastname}`
                  )}

                  <div className={classNames("m-p__date", {
                    "m-p__date--green": unseenMessages > 0,
                  })}>
                    {formatTimestamp(latestMessage.createdAt)}
                  </div>
                </div>

                <div className="m-p__message">
                  {latestMessage.message || ''}

                  {unseenMessages > 0 && (
                    <div className="m-p__unseen-messages">
                      {unseenMessages}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
};
