'use client';
import Link from 'next/link';
import './Handbook.scss';

interface Props {
  forCompany: boolean;
};

export const Handbook: React.FC<Props> = ({ forCompany }) => {
  return (
    <div className="container handbook">
      <div className="handbook__icon"/>

      <div className="handbook__content">
        <div className="handbook__title">
          {!forCompany ? "Candidate's Handbook" : 'Legal Working Dossier'}
        </div>

        <div className="handbook__text">
          {!forCompany ? 'The comprehensive guide for candidates' : 'Find all the informations you need to employ foreigners'}
        </div>

        {!forCompany ? (
          <>
            <div className="handbook__row">
              <div className="handbook__row-item">
                <Link
                  href={'https://videoworkers.com/skills-video/'}
                  className="handbook__row-item-text"
                >
                  Making a lasting impression
                </Link>
              </div>

              <div className="handbook__row-item">
                <Link
                  href={'https://videoworkers.com/demo-video/'}
                  className="handbook__row-item-text"
                >
                  Stand out from the crowd
                </Link>
              </div>
            </div>

            <div className="handbook__row">
              <div className="handbook__row-item">
                <Link
                  href={'https://videoworkers.com/build-your-resume/'}
                  className="handbook__row-item-text"
                >
                  How to build your resume
                </Link>
              </div>

              <div className="handbook__row-item">
                <Link
                  href={'https://videoworkers.com/create-your-resume/'}
                  className="handbook__row-item-text"
                >
                  Unlocking opportunites
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="handbook__row">
              <div className="handbook__row-item">
                <div
                  className="handbook__row-item-text"
                >
                  Legal documents by country
                </div>
              </div>

              <div className="handbook__row-item">
                <div
                  className="handbook__row-item-text"
                >
                  Get help from professionals
                </div>
              </div>
            </div>
          </>
        )}

        <Link
          href={!forCompany ? 'https://videoworkers.com/jobs-abroad/candidates-handbook/' : 'https://videoworkers.com/jobs-abroad/candidates-handbook/'}
          className="handbook__btn"
        >
          View all articles
        </Link>
      </div>
    </div>
  )
}
