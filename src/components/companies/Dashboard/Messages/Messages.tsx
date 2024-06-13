'use client';
import classNames from 'classnames';
import './Messages.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IChatMessages, IChatRoom, IChatRoomMessage, ISendMessage, MessageTypeEntity, getCandidateChatRooms, getCompanyChatRooms, getOneCandidateChat, getOneCompanyChat, sendMessage } from '@/services/api/chat.service';
import { AxiosResponse } from 'axios';
import { formatFullDateTime, formatMediaUrl, formatTimestamp } from '@/components/utils/utils';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import { CircleMenu } from '@/components/candidates/Dashboard/utils/MenuCircle/CircleMenu';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { useSetRecoilState } from 'recoil';

enum InboxType {
  Employers,
  Support,
  Candidates,
};

interface Props {
  forCompany?: boolean;
};

export const Messages: React.FC<Props> = ({ forCompany = false}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentInboxType, setCurrentInboxType] = useState<InboxType>(InboxType.Employers);
  const [chatRoom, setChatRoom] = useState<IChatMessages | null>(null);
  const [chatRooms, setChatRooms] = useState<IChatRoom[] | null>(null);
  const [chatRoomsFiltered, setChatRoomsFiltered] = useState<IChatRoom[] | null>(null);
  const [messageQuery, setMessageQuery] = useState<string>('');
  const [currentChatRef, setCurrentChatRef] = useState<number>(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatRoomId = searchParams.get('chatRoomId');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.Messages);
  }, []);

  useEffect(() => {
    if (!forCompany) {
      setCurrentInboxType(InboxType.Employers);
    } else {
      setCurrentInboxType(InboxType.Candidates);
    }
  }, []);

  useEffect(() => {
    if (!forCompany) {
      if (currentInboxType === InboxType.Employers) {
        setChatRoomsFiltered(chatRooms);
      } else {
        setChatRoomsFiltered([]);
      }
    } else {
      if (currentInboxType === InboxType.Candidates) {
        setChatRoomsFiltered(chatRooms);
      } else {
        setChatRoomsFiltered([]);
      }
    }
  }, [currentInboxType]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentChatRef, chatRoom?.Messages.length]);

  const fetchCandidateChatRooms = useCallback(async (type: InboxType) => {
    try {
      const resp: AxiosResponse<any, any> = await getCandidateChatRooms();
      setChatRooms(resp.data.data.data);

      if (type !== InboxType.Support) {
        setChatRoomsFiltered(resp.data.data.data);
      }
    } catch (error) {}
  }, [currentInboxType]);

  const fetchCompanyChatRooms = useCallback(async (type: InboxType) => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyChatRooms();
      setChatRooms(resp.data.data.data);
      if (type !== InboxType.Support) {
        setChatRoomsFiltered(resp.data.data.data);
      }
    } catch (error) {}
  }, []);

  const fetchOneCandidateChat = useCallback(async (roomId: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getOneCandidateChat(roomId);
      const chatFetched: IChatMessages = resp.data.data.data;
      setChatRoom(chatFetched);

      if (currentChatRef !== chatFetched.chat_room_id) {
        setCurrentChatRef(chatFetched.chat_room_id);
      }

      console.log(chatFetched);
    } catch (error) {}
  }, []);

  const fetchOneCompanyChat = useCallback(async (roomId: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getOneCompanyChat(roomId);
      const chatFetched: IChatMessages = resp.data.data.data;
      setChatRoom(chatFetched);

      if (currentChatRef !== chatFetched.chat_room_id) {
        setCurrentChatRef(chatFetched.chat_room_id);
      }

      console.log(chatFetched);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!forCompany) {
      fetchCandidateChatRooms(currentInboxType);
      if (chatRoomId) fetchOneCandidateChat(Number(chatRoomId));
    } else {
      fetchCompanyChatRooms(currentInboxType);
      if (chatRoomId) fetchOneCompanyChat(Number(chatRoomId));
    }

    const fetchChats = setInterval(() => {
      if (!forCompany) {
        fetchCandidateChatRooms(currentInboxType);
        if (chatRoomId) fetchOneCandidateChat(Number(chatRoomId));
      } else {
        fetchCompanyChatRooms(currentInboxType);
        if (chatRoomId) fetchOneCompanyChat(Number(chatRoomId));
      }
    }, 3000);

    return () => clearInterval(fetchChats);
  }, [chatRoomId, currentInboxType]);

  const handleSendMessage = useCallback(async (message: string, candidate_id: number, company_id: number) => {
    const data: ISendMessage = {
      chat_room_id: Number(chatRoomId),
      candidate_id,
      company_id,
      type: !forCompany ? MessageTypeEntity.Candidate : MessageTypeEntity.Company,
      message,
    };

    const addFakeMessageTillRefresh: IChatRoomMessage = {
      candidate_id,
      chat_room_id: Number(chatRoomId),
      company_id,
      message,
      message_id: Math.round(Math.random() * 1000000000000),
      seen: 0,
      type: !forCompany ? MessageTypeEntity.Candidate : MessageTypeEntity.Company,
      createdAt: String(new Date()),
      updatedAt: String(new Date()),
    };

    try {
      setChatRoom(state => {
        if (!state) {
          return state; // Handle null case if necessary
        }

        return {
          ...state,
          Messages: [...state.Messages, addFakeMessageTillRefresh]
        }
      });

      setChatRooms((state) => {
        if (!state) return null;

        const updatedRooms = state.map((room) =>
          room.chat_room_id === Number(chatRoomId)
            ? { ...room, latestMessage: addFakeMessageTillRefresh }
            : room
        );

        const sortedRooms = [...updatedRooms].sort((a, b) => {
          const dateA = new Date((b.latestMessage.createdAt as any));
          const dateB = new Date((a.latestMessage.createdAt as any));
          return (dateA.getTime() - dateB.getTime()) as number;
        });

        return sortedRooms;
      });

      setMessageQuery('');
      await sendMessage(data);

      if (!forCompany) {
        fetchCandidateChatRooms(currentInboxType);
        fetchOneCandidateChat(Number(chatRoomId));
      } else {
        fetchCompanyChatRooms(currentInboxType);
        fetchOneCompanyChat(Number(chatRoomId));
      }
    } catch (error) {}
  }, [chatRoomId, currentInboxType, chatRooms]);

  useEffect(() => {
    if (Number(chatRoomId) === 0) return;

    {!forCompany ? (
      fetchOneCandidateChat(Number(chatRoomId))
    ) : (
      fetchOneCompanyChat(Number(chatRoomId))
    )}

    const fetchChat = setInterval(() => {
      {!forCompany ? (
        fetchOneCandidateChat(Number(chatRoomId))
      ) : (
        fetchOneCompanyChat(Number(chatRoomId))
      )}
    }, 3000);

    return () => clearInterval(fetchChat);
  }, [chatRoomId]);

  return (
    <div className="container messages">
      <div className="messages__inbox">
        <div className="inbox">
          <div className="inbox__top">
            <div className="inbox__title">
              Inbox
            </div>

            <div className="inbox__menu">
              <div onClick={() => setSettingsOpen(!settingsOpen)} className="inbox__menu-circle">
                <CircleMenu
                  active={settingsOpen}
                />
              </div>

              {settingsOpen && (
                <div className="inbox__menu-settings">
                  {!forCompany ? (
                    <div
                      className="inbox__menu-item"
                      onClick={() => {
                        setCurrentInboxType(InboxType.Employers);
                        setSettingsOpen(false);
                      }}
                      >
                      Employers
                    </div>
                  ) : (
                    <div
                      className="inbox__menu-item"
                      onClick={() => {
                        setCurrentInboxType(InboxType.Candidates)
                        setSettingsOpen(false);
                      }}
                    >
                      Candidates
                    </div>
                  )}
                  {/* <div
                      className="inbox__menu-item"
                    onClick={() => {
                      setCurrentInboxType(InboxType.Support)
                      setSettingsOpen(false);
                    }}
                  >
                    Support
                  </div> */}
                </div>
              )}

              {/* {currentInboxType === InboxType.Candidates && (
                <div className="inbox__type-text">
                  Candidates
                </div>
              )}


              {currentInboxType === InboxType.Employers && (
                <div className="inbox__type-text">
                  Employers
                </div>
              )}

              {currentInboxType === InboxType.Support && (
                <div className="inbox__type-text">
                  Support
                </div>
              )} */}

            </div>

            <div className="inbox__types">
              {!forCompany ? (
                <div
                  onClick={() => setCurrentInboxType(InboxType.Employers)}
                  className={classNames('inbox__type', {
                    'inbox__type--active': currentInboxType === InboxType.Employers,
                  })}
                >
                  Employers
                </div>
              ) : (
                <div
                  onClick={() => setCurrentInboxType(InboxType.Candidates)}
                  className={classNames('inbox__type', {
                    'inbox__type--active': currentInboxType === InboxType.Candidates,
                  })}
                >
                  Candidates
                </div>
              )}

              {/* <div
                onClick={() => setCurrentInboxType(InboxType.Support)}
                className={classNames('inbox__type', {
                'inbox__type--active': currentInboxType === InboxType.Support,
                })}
              >
                Support
              </div> */}
            </div>

            <div className="inbox__title inbox__title--gray">
              RECENT MESAGGES
            </div>
          </div>

          <div className="inbox__chats">
            {chatRoomsFiltered?.map(room => {
              const {
                Applicant,
                JobOffer,
                Candidate,
                Company,
                JobPosition,
                candidate_id,
                chat_room_id,
                company_id,
                intro_message,
                job_position_id,
                latestMessage,
                type,
                unseenMessages,
              } = room;

              return (
                <div
                  key={chat_room_id}
                  onClick={() => {
                    if (!forCompany) {
                      router.push(`/candidates/dashboard/messages?chatRoomId=${chat_room_id}`)
                    } else {
                      router.push(`/dashboard/messages?chatRoomId=${chat_room_id}`)
                    }
                  }}
                  className={classNames("inbox__chat", {
                    "inbox__chat--active": Number(chatRoomId) === chat_room_id
                  })}
                >
                  {!forCompany ? (
                    <img
                      src={Company.company_logo || formatMediaUrl(
                        `flag-icon-${Company?.Country.alpha_2.toLowerCase() || 'globe'}.svg`,
                      )}
                      className='inbox__picture'
                      alt="picture"
                    />
                  ) : (
                    <img
                      className='inbox__picture'
                      src={Candidate.profile_image || ''}
                      alt="picture"
                    />
                  )}

                  <div className="inbox__chat-right">
                    <div className="inbox__name">
                      {!forCompany ? (
                        `${Company.name}`
                      ) : (
                        `${Candidate.firstname} ${Candidate.lastname}`
                      )}

                      <div className={classNames("inbox__date", {
                        "inbox__date--green": unseenMessages > 0,
                      })}>
                        {formatTimestamp(latestMessage.createdAt)}
                      </div>
                    </div>

                    <div className="inbox__message">
                      {latestMessage.message.length > 26 ? (
                        <>
                          {`${latestMessage.message.slice(0, 26)}...`}
                        </>
                      ) : (
                        <>
                          {latestMessage.message}
                        </>
                      )}

                      {unseenMessages > 0 && (
                        <div className="inbox__unseen-messages">
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
      </div>

      <div className="messages__chat">
        {!chatRoom ? (
          <div className="messages__intro">
            <div className="messages__intro-icon"/>

            <div className="messages__intro-title">
              {`Talk with your ${!forCompany ? 'employers' : 'candidates'}`}
            </div>

            <div className="messages__intro-text">
              {`Send and receive messages with your ${!forCompany ? 'employers' : 'candidates'}. Negotiate conditions, salary and benefits, send and receive files, and keep all comunications in one single and secure place. Just you and the ${!forCompany ? 'employer' : 'candidate'} will have access to the information here.`}
            </div>

            <div className="messages__intro-ecrypt">
              <div className="messages__intro-ecrypt-icon"></div>

              <div className="messages__intro-ecrypt-text">
                End-to-end encrypted
              </div>
            </div>
          </div>
        ) : (
          <div className="chat">
            <div className="chat__top">
              <div className={classNames("chat__picture-container", {
                "chat__picture-container--company": !forCompany,
              })}>
                {!forCompany ? (
                  <img
                    src={chatRoom?.Company.company_logo || formatMediaUrl(
                      `flag-icon-${chatRoom?.Company?.Country.alpha_2.toLowerCase() || 'globe'}.svg`,
                    )}
                    className='chat__picture chat__picture--company'
                    alt="picture" />
                  ) : (
                    <img
                      className='chat__picture'
                      src={chatRoom.Candidate.profile_image || ''}
                      alt="picture"
                    />
                  )}
              </div>

              <div className="chat__top-right">
                {!forCompany ? (
                  <div className="chat__name">
                    {chatRoom.Company.name}
                  </div>
                ) : (
                  <div className="chat__name">
                    {`${chatRoom.Candidate.firstname} ${chatRoom.Candidate.lastname}`}
                  </div>
                )}

                <div className="chat__residency">
                  <div className="chat__residency-icon"/>

                    {!forCompany ? (
                      <div className="chat__residency-text">
                        {chatRoom.Company.CompanyResidency?.town ? (
                          `${chatRoom.Company.CompanyResidency?.town}, ${chatRoom.Company.Country.name}`
                          ) : (
                          `${chatRoom.Company.Country.name}`
                        )}
                      </div>
                    ) : (
                      <div className="chat__residency-text">
                        {`${chatRoom.Candidate.Residency.town}, ${chatRoom.Candidate.Residency.Country?.name}`}
                      </div>
                    )}
                  </div>
              </div>
            </div>

            <div ref={containerRef} className="chat__messages">
              {chatRoom.Messages.map(m => {
                const {
                  message_id,
                  message,
                  type,
                  createdAt
                } = m;

                return (
                  <>
                    <div
                      key={message_id}
                      className={classNames("chat__message", {
                        "chat__message--right": (!forCompany && (type === MessageTypeEntity.Candidate))
                          || (forCompany && (type === MessageTypeEntity.Company)),
                      })}
                    >
                      {message}

                      <div
                        className={classNames('chat__message-date', {
                          'chat__message-date--right': (!forCompany && (type === MessageTypeEntity.Candidate))
                            || (forCompany && (type === MessageTypeEntity.Company)),
                        })}
                      >
                        {formatFullDateTime(createdAt)}
                      </div>
                    </div>
                  </>
                )
              })}
            </div>

            <div className="chat__bottom">
              <textarea
                className="chat__query"
                value={messageQuery}
                onChange={(e) => setMessageQuery(e.target.value)}
              />

              <div className="chat__bottom-options">
                <div className="chat__bottom-options-side"></div>

                <div className="chat__bottom-options-side">
                  <div
                    onClick={() => {
                      if (!chatRoom) return;
                      handleSendMessage(messageQuery, chatRoom.candidate_id, chatRoom.company_id);
                    }}
                    className="chat__send-btn"
                  >
                    <div className="chat__send-btn-icon"/>
                    <div className="chat__send-btn-text">SEND</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
};
