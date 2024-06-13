'use client';
import { useRecoilState } from 'recoil';
import './Menu.scss';
import { MenuFooter } from './MenuFooter';
import { MenuSection } from './MenuSection';
import { AnnouncesActiveStore, AnnouncesStore } from '@/store/announceStore';

type Props = {
  forCompany?: boolean;
};

export const Menu: React.FC<Props> = ({ forCompany = false }) => {
  const [announces, setAnnounces] = useRecoilState(AnnouncesStore);
  const [activeAnnounces, setActiveAnnounces] = useRecoilState<number>(AnnouncesActiveStore);

  return (
    <div className="menu">
      <div className="menu__logo"/>

      <div className="menu__sections">
        <div className="menu__section">
          {!forCompany ? (
            <MenuSection
              route={'/candidates/dashboard/'}
              matchingPath='dashboard'
              title='Dashboard'
            />
          ) : (
            <MenuSection
              route={'/dashboard/'}
              matchingPath='dashboard'
              title='Dashboard'
            />
          )}
        </div>

        <div className="menu__section">
          {!forCompany ? (
            <MenuSection
              route={'/candidates/dashboard/profile/'}
              matchingPath='profile'
              title='User profile'
            />
          ) : (
            <MenuSection
              route={'/dashboard/my-company/'}
              matchingPath='my-company'
              title='My company'
            />
          )}
        </div>

        <div className="menu__section">
          {!forCompany ? (
            <MenuSection
              route={'/candidates/dashboard/positions/'}
              matchingPath='positions'
              title='Your job positions'
            />
          ) : (
            <MenuSection
              route={'/dashboard/announcements/'}
              matchingPath='announcements'
              title='Job Announcements'
            />
          )}
        </div>

        <div className="menu__section">
          <MenuSection
            route={!forCompany ? '/candidates/dashboard/promotion/' : '/dashboard/promotion/'}
            matchingPath='promotion'
            title='Promotion'
          />
        </div>

        <div className="menu__section">
          {!forCompany ? (
            <MenuSection
              route={'/candidates/dashboard/offers-received/'}
              matchingPath='offers-received'
              title='Your job offers from the company'
            />
          ) : (
            <MenuSection
              route={'/dashboard/applicants/'}
              matchingPath='applicants'
              title='Applicants'
            />
          )}
        </div>

        <div className="menu__section">
          <MenuSection
            route={!forCompany ? '/candidates/dashboard/messages/' : '/dashboard/messages/'}
            matchingPath='messages'
            title='Messages'
          />
        </div>

        <div className="menu__section">
          {!forCompany ? (
            <MenuSection
              route={'/candidates/dashboard/job-search/'}
              matchingPath='job-search'
              title='Jobs posted by companies'
            />
          ) : (
            <MenuSection
              route={'/dashboard/search-workers/'}
              matchingPath='search-workers'
              title='Search workers'
            />
          )}
        </div>

        <div className="menu__section">
          <MenuSection
            route={!forCompany ? '/candidates/dashboard/settings/account/' : '/dashboard/settings/user/'}
            matchingPath='settings'
            title='Settings'
          />
        </div>

        <div className="menu__section">
          <MenuSection
            route={!forCompany ? '/candidates/dashboard/help/' : '/dashboard/help/'}
            matchingPath='help'
            title='Help desk'
          />
        </div>

        <div
          className="menu__section"
          onClick={() => {
            localStorage.setItem('token', '');
            setAnnounces(null);
            setActiveAnnounces(0);
          }}
        >
          {!forCompany ? (
            <MenuSection
              route={'/candidates/signin/'}
              matchingPath='logout'
              title='Log out'
            />
          ) : (
            <MenuSection
              route={'/signin/'}
              matchingPath='logout'
              title='Log out'
            />
          )}
        </div>
      </div>

      <div className="menu__footer">
        <MenuFooter />
      </div>
    </div>
  )
}
