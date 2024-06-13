'use client';
import './layout.scss';
import { SettingsMenu } from '@/components/candidates/Dashboard/Settings/SettingsMenu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="settings">
      <div className="settings__menu">
        <SettingsMenu />
      </div>

      <div className="settings__children">
        {children}
      </div>
    </div>
  )
}
