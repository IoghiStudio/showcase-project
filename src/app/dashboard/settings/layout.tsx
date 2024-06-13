'use client';
import '../../candidates/dashboard/settings/layout.scss';
import { SettingsMenu } from '@/components/candidates/Dashboard/Settings/SettingsMenu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="settings">
      <div className="settings__menu">
        <SettingsMenu forCompany />
      </div>

      <div className="settings__children">
        {children}
      </div>
    </div>
  )
}
