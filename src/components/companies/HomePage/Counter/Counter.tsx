import './Counter.scss';

interface CounterData {
  id: string;
  number: string;
  title: string;
  text: string;
}

const countersData: CounterData[] = [
  {
    id: '1',
    number: '75%',
    title: 'Skills Shortage',
    text: "75% of companies have reported difficulty recruiting qualified talent. The global talent shortage is at a 16-year high, and it's not slowing down."
  },
  {
    id: '2',
    number: '205m+',
    title: 'Unemployed Individuals',
    text: "5.77% of the total global workforce is sill unemployed. More and more people are willing to leave their homes to search for a job that provide for their families."
  },
  {
    id: '3',
    number: '4/10',
    title: 'Employees want a change',
    text: "4 in 10 employees are thinking of looking for a new job thanks to stress and burnout, seeking better work conditions and better way of life."
  },
]

export const Counter = () => (
  <div className="counter">
    <h1 className="counter__title">Who is VideWorkers for?</h1>

    <div className="counter__cards">
      {countersData.map((data) => {
        const {
          id,
          number,
          title,
          text
        } = data;

        return (
          <div key={id} className="counter__card">
            <div className="counter__number">
              {number}
            </div>

            <div className="counter__card-title">
              {title}
            </div>

            <div className="counter__text">
              {text}
            </div>
          </div>
        );
      })}
    </div>

    <div className="counter__bottom">
      *Based on 2022 data collected from International Labour Organization, the International Monetary Fund, and the World Bank.
    </div>
  </div>
);
