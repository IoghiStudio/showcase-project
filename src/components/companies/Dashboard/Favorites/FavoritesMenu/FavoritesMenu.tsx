'use client';
import '../../../../candidates/Dashboard/Settings/SettingsMenu/SettingsMenu.scss';
import './FavoritesMenu.scss';
import { MenuSection } from '@/components/candidates/Dashboard/Menu/MenuSection';

type Props = {
  forCompany?: boolean;
};

export const FavoritesMenu: React.FC<Props> = ({forCompany = false}) => {
  return (
    <div className="container settings-menu">
      <div className="settings-menu__top">
        <div className="container__title">
          Your favorites
        </div>

        <div className="container__text">
          Saved by you
        </div>
      </div>

      <div className="settings-menu__sections">
        <div className="settings-menu__section">
          {!forCompany ? (
            <MenuSection
              route={'/candidates/dashboard/favorites/offers-received/'}
              matchingPath='offers-received'
              title='Job Offers'
              forSettings
            />
          ) : (
            <MenuSection
              route={'/dashboard/favorites/applicants/'}
              matchingPath='applicants'
              title='Applicants'
              forSettings
            />
          )}
        </div>

        <div className="settings-menu__section">
          {!forCompany ? (
            <MenuSection
              route={'/candidates/dashboard/favorites/jobs/'}
              matchingPath='jobs'
              title='Job listings'
              forSettings
            />
          ) : (
            <MenuSection
              route={'/dashboard/favorites/workers/'}
              matchingPath='workers'
              title='Workers'
              forSettings
            />
          )}
        </div>
      </div>
    </div>
  )
}
