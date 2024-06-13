'use client';
import { MenuSection } from '../../Menu/MenuSection';
import './SettingsMenu.scss';

type Props = {
  forCompany?: boolean;
};

export const SettingsMenu: React.FC<Props> = ({ forCompany = false }) => {
  return (
    <div className="container settings-menu">
      <div className="settings-menu__top">
        <div className="container__title">
          Settings
        </div>

        <div className="container__text">
          Manage your account
        </div>
      </div>

      <div className="settings-menu__sections">
        <div className="settings-menu__section">
          {!forCompany ? (
            <MenuSection
              route={'/candidates/dashboard/settings/account/'}
              matchingPath='account'
              title='Account'
              forSettings
            />
          ) : (
            <MenuSection
              route={'/dashboard/settings/user/'}
              matchingPath='user'
              title='User'
              forSettings
            />
          )}
        </div>

        {forCompany && (
          <div className="settings-menu__section">
            <MenuSection
              route={'/dashboard/settings/company/'}
              matchingPath='company'
              title='Company'
              forSettings
            />
          </div>
        )}

        <div className="settings-menu__section">
          <MenuSection
            route={!forCompany ? '/candidates/dashboard/settings/billing/' : '/dashboard/settings/billing/'}
            matchingPath='billing'
            title='Billing'
            forSettings
          />
        </div>

        {!forCompany && (
          <div className="settings-menu__section">
            <MenuSection
              route={'/candidates/dashboard/settings/affiliate/'}
              matchingPath='affiliate'
              title='Affiliate'
              forSettings
            />
          </div>
        )}

        <div className="settings-menu__section">
          <MenuSection
            route={!forCompany ? '/candidates/dashboard/settings/notification/' : '/dashboard/settings/notification/'}
            matchingPath='notification'
            title='Notification'
            forSettings
          />
        </div>

        {/* {!forCompany && (
          <div className="settings-menu__section">
            <MenuSection
              route={'/candidates/dashboard/settings/connection/'}
              matchingPath='connection'
              title='Connection'
              forSettings
            />
          </div>
        )} */}

        <div className="settings-menu__section">
          <MenuSection
            route={!forCompany ? '/candidates/dashboard/settings/privacy/' : '/dashboard/settings/privacy/'}
            matchingPath='privacy'
            title='Privacy'
            forSettings
          />
        </div>

        <div className="settings-menu__section">
          <MenuSection
            route={!forCompany ? '/candidates/dashboard/settings/security/' : '/dashboard/settings/security/'}
            matchingPath='security'
            title='Security'
            forSettings
          />
        </div>
      </div>
    </div>
  )
}
