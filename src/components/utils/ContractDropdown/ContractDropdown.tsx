'use client';
import '../Dropdown.scss';
import classNames from 'classnames';

type Props = {
  isOpen: boolean;
  onSelect: (contract: string) => void;
  forCompany?: boolean;
};

export const contractTypes: string[] = [
  '3 months',
  '6 months',
  '1 year',
  '2 years',
  '3 years',
];

export const contractTypesCompany: string[] = [
  'Days',
  'Weeks',
  'Months',
  'Years',
];

export const ContractDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
  forCompany = false,
}) => (
  <div className={classNames("dropdown", {
    "dropdown--active": isOpen,
    "dropdown--company-contract": forCompany,
  })}>
    {!forCompany ? (
      <div className="dropdown__list">
        {contractTypes.map((contractType) => (
          <div
            key={contractType}
            className="dropdown__item"
            onClick={() => onSelect(contractType)}
          >
            <div className="dropdown__item-name">
              {contractType}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="dropdown__list">
        {contractTypesCompany.map((contractType) => (
          <div
            key={contractType}
            className="dropdown__item"
            onClick={() => onSelect(contractType)}
          >
            <div className="dropdown__item-name">
              {contractType}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)
