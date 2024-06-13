'use client';
import { getCandidateNotifications, getCompanyNotifications } from '@/services/api/notifications.service';
import './Notifications.scss';
import { FC, useCallback, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { useRecoilState } from 'recoil';
import { INotification, NotificationsStore } from '@/store/notificationsStore';
import { formatDateShort, formatFullDateTime } from '../utils/utils';

interface Props {
  forCompany?: boolean;
};

export const Notifications: FC<Props> = ({
  forCompany=false
}) => {
  const [notifications, setNotifications] = useRecoilState<INotification[] | null>(NotificationsStore);

  const fetchCandidateNotifications = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCandidateNotifications(`?page=1&pageSize=3`);
      const notificationsFetched = resp.data.data.data;
      console.log(notificationsFetched[0]);

      setNotifications(notificationsFetched);
    } catch (error) {}
  }, []);

  const fetchCompanyNotifications = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getCompanyNotifications(`?page=1&pageSize=3`);
      const notificationsFetched = resp.data.data.data;
      setNotifications(notificationsFetched);
    } catch (error) {}
  }, []);


  useEffect(() => {
    if (!forCompany) {
      fetchCandidateNotifications();
    } else {
      fetchCompanyNotifications();
    }
  }, []);

  return (
    <div className="notifications">
      {notifications?.map(n => (
        <div className="notifications__item">
          <div className="notifications__text">
            {n.description}
            {' '}
            <span className='notifications__date'>
              {formatFullDateTime(n.createdAt)}
            </span>
          </div>
        </div>
      ))}

      <div className="notifications__bottom">
        See All Notifications
      </div>
    </div>
  )
}
