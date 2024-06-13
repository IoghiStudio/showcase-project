'use client';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import './News.scss';

const newsList = [
  {
    id: 1,
    month: 'MARCH',
    day: 23,
    year: 2023,
    category: 'JOB ALERT',
    className: 'job',
    title: 'New job opportunities in Europe',
    text: 'Looking cautiously round, to ascertain that they were not overheard, the two hags cowered nearer to the fire, and chuckled heartily.',
    image: '',
    author: 'Jhon Doe Smith',
    job: 'HR Specialist',
  },
  {
    id: 2,
    month: 'MARCH',
    day: 22,
    year: 2023,
    category: 'BLOG NEWS',
    className: 'blog',
    title: 'How much does it cost to get your Visa?',
    text: "This sounded a very good reason, and Alice was quite pleased to know it. 'I never thought of that before!' she said.",
    image: '',
    author: 'Harry Potter',
    job: 'Wizard Specialist',
  },
  {
    id: 3,
    month: 'MARCH',
    day: 22,
    year: 2023,
    category: 'BLOG NEWS',
    className: 'blog',
    title: 'How much does it cost to get your Visa?',
    text: "This sounded a very good reason, and Alice was quite pleased to know it. 'I never thought of that before!' she said.",
    image: '',
    author: 'Harry Potter',
    job: 'Wizard Specialist',
  },
];

interface newsPost {
  id: number;
  month: string;
  day: number;
  year: number;
  category: string;
  className: string;
  title: string;
  text: string;
  image: string;
  author: string;
  job: string;
}

export const News = () => {
  const [windowWidth, setWindowSize] = useState(0);
  const [posts, setPosts] = useState<newsPost[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<newsPost[]>([]);
  const [forDesktop, setForDesktop] = useState(false);
  const [forTablet, setForTablet] = useState(false);

  useEffect(() => {
    setPosts(newsList);
    setVisiblePosts(newsList.slice(0, 2))
  }, [])

  useEffect(() => {
    if (forDesktop) {
      setVisiblePosts(newsList.slice(0, 3))
    }

    if (forTablet) {
      setVisiblePosts(newsList.slice(0, 2));
    }

    if (!forTablet && !forDesktop) {
      setVisiblePosts(newsList.slice(0, 3))
    }
  }, [forTablet, forDesktop])

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };

    if (windowWidth >= 744) {
      setForTablet(true);
    } else {
      setForTablet(false)
    }

    if (windowWidth >= 1000) {
      setForTablet(false);
      setForDesktop(true);
    } else {
      setForDesktop(false);
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  return (
    <div className="news">
      <div className="news__top">
        <h1 className="news__title">
          News Alert
        </h1>

        <p className="news__text">
          She was bouncing away, when a cry from two women, who had turned towards the bed, cause her to look round.
        </p>
      </div>

      <div className="news__posts">
        {visiblePosts.map(post => {
          const {
            id,
            month,
            day,
            year,
            category,
            className,
            title,
            text,
            author,
            job,
          } = post;

          return (
            <div key={id} className="news__post">
              <div className="news__post-top">
                <div className="news__headline">
                  <div className="news__date">
                    {`${month} ${day}, ${year}`}
                  </div>

                  <div className="news__headline-right">
                    <div
                      className={cn(
                        'news__icon',
                        `news__icon--${className}`
                      )}
                    ></div>

                    <div className="news__category">
                      {category}
                    </div>
                  </div>
                </div>

                <h2 className="news__post-title">
                  {title}
                </h2>

                <p className="news__post-text">
                  {text}
                </p>
              </div>

              <div className="news__bottomline">
                <div className="news__bottomline-left">
                  <div className="news__avatar"></div>

                  <div className="news__person-info">
                    <div className="news__author">
                      {author}
                    </div>

                    <div className="news__job">
                      {job}
                    </div>
                  </div>

                </div>

                <div className="news__bottomline-right">
                  Read Now
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="news__button">
        All Articles
      </div>
    </div>
  )
}
