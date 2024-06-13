'use client';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import './Reviews.scss';

const customersList = [
  {
    id: 1,
    text: 'Thanks VideoWorkers for helping us stay on top of a very stressful process! Finally exchanged and looking forward to complete.',
    image: '',
    name: 'Andrew Bradshaw',
    job: 'Desiger',
    country: 'Bangladesh',
  },
  {
    id: 2,
    text: 'Thanks VideoWorkers for helping us stay on top of a very stressful process! Finally exchanged and looking forward to complete.',
    image: '',
    name: 'Brandon Shorter',
    job: 'Auto Mechanic',
    country: 'Georgia',
  },
  {
    id: 3,
    text: 'Thanks VideoWorkers for helping us stay on top of a very stressful process! Finally exchanged and looking forward to complete.',
    image: '',
    name: 'Brooke Gerald',
    job: 'Waiter',
    country: 'Thailand',
  },
];

interface Customer {
  id: number;
  text: string;
  image: string;
  name: string;
  job: string;
  country: string;
}

export const Reviews = () => {
  const [windowWidth, setWindowSize] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [visibleCustomers, setVisibleCustomers] = useState<Customer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(2);
  const [forTablet, setForTablet] = useState(false);
  const [forDesktop, setForDesktop] = useState(false);

  useEffect(() => {
    setCustomers(customersList);
    setVisibleCustomers(customersList.slice(0, 1));
  }, [])

  useEffect(() => {
    if (forDesktop) {
      setVisibleCustomers(customersList.slice(0, 3))
    }

    if (forTablet) {
      setVisibleCustomers(customersList.slice(0, 2));
    }

    if (!forTablet && !forDesktop) {
      setVisibleCustomers(customersList.slice(0, 1))
    }
  }, [forTablet, forDesktop])

  useEffect(() => {
    if (!forTablet) {
      setVisibleCustomers(customersList.slice((currentIndex - 1), currentIndex))
    }
  }, [currentIndex])

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
    <div className="reviews">
      <div className="reviews__headline">
        <h1 className="reviews__title">
          Trusted By
        </h1>

        <p className="reviews__text">
          She was bouncing away, when a cry from two womens, who had turned towards the bed, caused her to look round.
        </p>
      </div>

      <div className="reviews__customers">
        {visibleCustomers.map(customer => {
          const {
            id,
            text,
            image,
            name,
            job,
            country
          } = customer;

          return (
            <div key={id} className="reviews__customer">
              <div className="reviews__customer-icon"></div>

              <div className="reviews__customer-text">
                {text}
              </div>

              <div className="reviews__customer-image-container">
                <div
                  className="reviews__arrow-container"
                  onClick={() => {
                    if (currentIndex > 1) {
                      setCurrentIndex(currentIndex - 1);
                    } else {
                      setCurrentIndex(3);
                    }
                  }}
                >
                  <div className="reviews__arrow"></div>
                </div>

                <div className="reviews__customer-image"></div>

                <div
                  className="reviews__arrow-container"
                  onClick={() => {
                    if (currentIndex < 3) {
                      setCurrentIndex(currentIndex + 1);
                    } else {
                      setCurrentIndex(1)
                    }
                  }}
                >
                  <div className="reviews__arrow reviews__arrow--right"></div>
                </div>
              </div>

              <h4 className="reviews__customer-name">
                {name}
              </h4>

              <div className="reviews__customer-bottomline">
                {`${job}, ${country}`}
              </div>

              <div className="reviews__dots">
                {[1,2,3].map(dot => (
                  <div
                    key={dot}
                    className={cn(
                      "reviews__dot",
                      {
                        "reviews__dot--active": currentIndex === dot,
                      }
                    )}
                  ></div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="reviews__trustpilot">
        <div className="reviews__trustpilot-text">
          Excelent
        </div>

        <div className="reviews__trustpilot-stars"></div>

        <div className="reviews__trustpilot-count">
          250 reviews on
        </div>

        <div className="reviews__trustpilot-icon"></div>

        <div className="reviews__trustpilot-title">
          Trustpilot
        </div>
      </div>
    </div>
  )
}
