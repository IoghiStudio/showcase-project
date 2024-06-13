'use client';
import './Nav.scss';
import cn from 'classnames';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MenuButton } from './MenuButton';

type Props = {
  forCompany?: boolean;
};

export const Nav: React.FC<Props> = ({ forCompany = false }) => {
  const [path, setPath] = useState<string | null>(null);
  const pathname: string = usePathname();
  const selectedPaths: string[] = pathname.split('/');
  const selectedPath: string = selectedPaths[selectedPaths.length - 1];

  useEffect(() => {
    setPath(selectedPath);
  });

  return (
    <div className="nav">
      <div className="nav__menu">
        <MenuButton />
      </div>

      {!forCompany ? (
        <Link href={'/candidates/dashboard/positions/'} className={cn("nav__icon nav__icon--positions", {
          "nav__icon--positions--active": path === 'positions'
        })}/>
      ) : (
        <Link href={'/dashboard/announcements/'} className={cn("nav__icon nav__icon--offers", {
          "nav__icon--offers--active": path === 'announcements'
        })}/>
      )}

      {!forCompany ? (
        <Link href={'/candidates/dashboard/offers-received/'} className={cn("nav__icon nav__icon--offers", {
          "nav__icon--offers--active": path === 'offers-received'
        })}/>
      ) : (
        <Link href={'/dashboard/applicants/'} className={cn("nav__icon nav__icon--positions", {
          "nav__icon--positions--active": path === 'applicants'
        })}/>
      )}

      {!forCompany ? (
        <Link href={'/candidates/dashboard/messages/'} className={cn("nav__icon nav__icon--chat", {
          "nav__icon--chat--active": path === 'messages'
        })}/>
      ) : (
        <Link href={'/dashboard/messages/'} className={cn("nav__icon nav__icon--chat", {
          "nav__icon--chat--active": path === 'messages'
        })}/>
      )}
    </div>
  )
}
