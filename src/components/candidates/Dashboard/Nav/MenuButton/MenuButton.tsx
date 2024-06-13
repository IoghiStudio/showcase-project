"use client";
import { useState } from 'react';
import './MenuButton.scss';
import cn from 'classnames';
import { useRecoilState } from 'recoil';
import { MenuOpenStore } from '@/store/menuOpenStore';

type Props = {

}

export const MenuButton: React.FC<Props> = () => {
  // const [onHover, setOnHover] = useState<boolean>(false);

  const [menuOpened, setMenuOpened] = useRecoilState(MenuOpenStore);

  return (
    <div
      className={cn(
        "menu-button",
      )}
      // onMouseEnter={() => setOnHover(true)}
      // onMouseLeave={() => setOnHover(false)}
      onClick={() => setMenuOpened(!menuOpened)}
    >
      <div className={cn(
        "menu-button__line",
        {
          "menu-button__line--hover": menuOpened,
          "menu-button__line--active-1": menuOpened,
        }
      )}/>

      <div className={cn(
        "menu-button__line",
        "menu-button__line--2",
        {
          "menu-button__line--hover": menuOpened,
          "menu-button__line--active-2": menuOpened,
        }
      )}/>

      <div className={cn(
        "menu-button__line",
        {
          "menu-button__line--hover": menuOpened,
          "menu-button__line--active-3": menuOpened,
        }
      )}/>
    </div>
  )
};
