import Link from 'next/link';
import { Header } from './Header';
import './HomePage.scss';
import { Counter } from './Counter';
import { Legal } from './Legal';
import { Reviews } from './Reviews/Reviews';
import { News } from './News/News';

export const HomePage = () => {
  return (
    <div className="home">
      <div className="home__top">
        <Header />

        <div className="home__headline">
          <Link href={'/candidates'} className="home__headline-text home__candidates">
            candidates
          </Link>

          <div className="home__headline-text home__companies">
            companies
          </div>
        </div>
      </div>

      <div className="home__counter">
        <Counter />
      </div>

      <div className="home__legal">
        <Legal />
      </div>

      <div className="home__news">
        <News />
      </div>

      <div className="home__reviews">
        <Reviews />
      </div>
    </div>
  )
}
