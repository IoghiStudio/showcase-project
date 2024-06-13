import Link from 'next/link';
import './HomeCandidates.scss';
import { Header } from '@/components/companies/HomePage/Header';

export const HomeCandidates = () => {
  return (
    <div className="chome">
      <div className="chome__top">
        <Header forCandidates/>

        <div className="chome__headline">
          <div className="chome__headline-text chome__candidates">
            candidates
          </div>

          <Link href={'/'} className="chome__headline-text chome__companies">
            companies
          </Link>
        </div>
      </div>
    </div>
  )
}
