'use client';
import '../Dropdown.scss';
import classNames from 'classnames';
import { useState } from 'react';
import { LanguageApiLevels, ISpokenLanguage, ProficiencyLevel} from '../utils';

type Props = {
  isOpen: boolean;
  onSelect: (level: ProficiencyLevel) => void;
};

export const ProficiencyDropdown: React.FC<Props> = ({
  isOpen,
  onSelect,
}) => {
  const [proficiencyLevels] = useState<ISpokenLanguage[]>(LanguageApiLevels);

  return (
    <div className={classNames("dropdown", {
      "dropdown--active": isOpen
    })}>
      <div className="dropdown__list">
        {proficiencyLevels && proficiencyLevels
          .map((level) => (
            <div
              key={level.id}
              className="dropdown__item"
              onClick={() => onSelect(level.proficiency)}
            >
              <div className="dropdown__item-name">
                {level.proficiency}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
