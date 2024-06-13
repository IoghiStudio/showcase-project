'use client';
import Link from 'next/link';
import './Header.scss';
import cn from 'classnames';

type Props = {
  forCandidates?: boolean;
};

export const Header: React.FC<Props> = ({ forCandidates = false }) => {
  return (
    <div className="h">
      <div className={cn("h__logo", {
        "h__logo--color": forCandidates
      })}/>

      <div className="h__top">
        <div
          className={cn("h__menu", {
            "h__menu--black": forCandidates
          })}
          onClick={() => {}}
        />

        <div className="h__right">
          <Link
            href={!forCandidates ? '/signin/' : '/candidates/signin/'}
            className={cn("h__sign", {
              "h__sign--black": forCandidates
            })}
          >
            Sign In
          </Link>

          <Link
            href={!forCandidates ? '/signup/' : '/candidates/signup/'}
            className={cn("h__sign h__sign--up", {
              'h__sign--blue': forCandidates
            })}
          >
            Sign Up
          </Link>

          <div className={cn("h__language", {
            "h__language--black": forCandidates
          })}>
            <div className="h__language-text">
              English
            </div>

            <div className={cn("h__language-icon", {
              "h__language-icon--black": forCandidates
            })}/>
          </div>
        </div>
      </div>
    </div>
  )
}
