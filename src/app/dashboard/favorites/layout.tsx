'use client';
import '../../candidates/dashboard/settings/layout.scss';
import { FavoritesMenu } from '@/components/companies/Dashboard/Favorites/FavoritesMenu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="settings">
      <div className="settings__menu">
        <FavoritesMenu forCompany/>
      </div>

      <div className="settings__children">
        {children}
      </div>
    </div>
  )
}
