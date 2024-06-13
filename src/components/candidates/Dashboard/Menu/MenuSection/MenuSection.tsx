'use client';
import './MenuSection.scss';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSetRecoilState } from 'recoil';
import { MenuOpenStore } from '@/store/menuOpenStore';

type Props = {
  route: string;
  matchingPath: string;
  title: string;
  forBurger?: boolean;
  forSettings?: boolean;
};

export const MenuSection: FC<Props> = ({
  route,
  matchingPath,
  title,
  forBurger = false,
  forSettings = false,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const setMenuOpen = useSetRecoilState(MenuOpenStore);
  const pathname: string = usePathname();
  const selectedPaths: string[] = pathname.split('/');
  const selectedPath: string = selectedPaths[selectedPaths.length - 1];

  useEffect(() => {
    if (matchingPath === 'dashboard') {
      setIsActive(Boolean(selectedPath === matchingPath));
      return;
    }

    setIsActive(Boolean(selectedPaths.includes(matchingPath)));
  }, [pathname]);

  return (
    <Link
      onClick={() => setMenuOpen(false)}
      href={route}
      className={cn("menu-section", {
        "menu-section--active": isActive,
        "menu-section--for-settings": forSettings
      })}
    >
      <div className={cn("menu-section__bar", {
        "menu-section__bar--active": isActive && !forBurger,
        "menu-section__bar--disabled": forSettings,
      })}/>

      <div className={cn("menu-section__icon",
        `menu-section__icon--${matchingPath}`,
      {
        [`menu-section__icon--${matchingPath}--active`]: isActive,
        [`menu-section__icon--for-settings`]: forSettings,
      })}/>

      <div className={cn("menu-section__title", {
        "menu-section__title--disabled": forSettings
      })}>
        {title}
      </div>
    </Link>
  )
}
