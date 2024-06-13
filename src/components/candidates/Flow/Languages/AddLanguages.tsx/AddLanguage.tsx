'use client';
import '../../Add.scss';
import './Guide.scss';
import { SaveButtonType } from '@/types/SaveButtonType';
import { FlowContainer } from '../../FlowContainer';
import { SaveButtons } from '../../SaveButtons';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Label } from '@/components/utils/Label';
import { ILanguage } from '@/types/Language';
import { Select } from '@/components/utils/Select';
import { LanguageDropdown } from '@/components/utils/LanguageDropdown';
import { ProficiencyLevel } from '@/components/utils/utils';
import { ProficiencyDropdown } from '@/components/utils/ProficiencyDropdown';
import { IUserLanguage, deleteUserLanguage, getOneUserLanguage, postUserLanguage, updateUserLanguage } from '@/services/api/userLanguages.service';
import { UserLanguageIdStore, UserLanguagesStore } from '@/store/flowPagesData/userLanguagesStore';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { AxiosResponse } from 'axios';

interface IProficiencyGuide {
  id: number;
  title: ProficiencyLevel;
  text: string;
};

const guides: IProficiencyGuide[] = [
  {
    id: 1,
    title: 'NATIVE',
    text: 'This level represents a deep and natural understanding of the language. It is your mother tongue, the language you grew up speaking, and the one you are most fluent in. Some individuals may have two or more native languages, known as bilingual or multilingual proficiency. If this is your case, you should add them all.'
  },
  {
    id: 2,
    title: 'BEGINNER (A1)',
    text: 'Can understand and use familiar everyday expressions and very basic phrases aimed at the satisfaction of needs of a concrete type. Can introduce themselves and others and can ask and answer questions about personal details such as where someone lives, people they know and things they have. Can interact in a simple way provided the other person talks slowly and clearly and is prepared to help.'
  },
  {
    id: 3,
    title: 'ELEMENTARY (A2)',
    text: 'Can understand sentences and frequently used expressions related to areas of most immediate relevance (e.g. very basic personal and family information, shopping, local geography, employment). Can communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar and routine matters. Can describe in simple terms aspects of their background, immediate environment and matters in areas of immediate need.'
  },
  {
    id: 4,
    title: 'INTERMEDIATE (B1)',
    text: 'Can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc. Can deal with most situations likely to arise whilst travelling in an area where the language is spoken. Can produce simple connected text on topics, which are familiar, or of personal interest. Can describe experiences and events, dreams, hopes & ambitions and briefly give reasons and explanations for opinions and plans.'
  },
  {
    id: 5,
    title: 'UPPER_INTERMEDIATE (B2)',
    text: 'Can understand the main ideas of complex text on both concrete and abstract topics, including technical discussions in their field of specialisation. Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible without strain for either party. Can produce clear, detailed text on a wide range of subjects and explain a viewpoint on a topical issue giving the advantages and disadvantages of various options.'
  },
  {
    id: 6,
    title: 'ADVANCED (C1)',
    text: 'Can understand a wide range of demanding, longer texts, and recognise implicit meaning. Can express themself fluently and spontaneously without much obvious searching for expressions. Can use language flexibly and effectively for social, academic and professional purposes. Can produce clear, well-structured, detailed text on complex subjects, showing controlled use of organisational patterns, connectors and cohesive devices.'
  },
  {
    id: 7,
    title: 'PROFICIENT (C2)',
    text: 'Can understand with ease virtually everything heard or read. Can summarise information from different spoken and written sources, reconstructing arguments and accounts in a coherent presentation. Can express themself spontaneously, very fluently and precisely, differentiating finer shades of meaning even in more complex situations.'
  },
];

type Props = {
  forEdit?: boolean;
  fromDashboard?: boolean;
};

export const AddLanguages: React.FC<Props> = ({ forEdit = false, fromDashboard = false}) => {
  const [proficiency, setProficiency] = useState<string>('');
  const [language, setLanguage] = useState<ILanguage | null>(null);
  const [languageDropdown, setLanguageDropdown] = useState<boolean>(false);
  const [proficiencyDropdown, setProficiencyDropdown] = useState<boolean>(false);
  const [languageError, setLanguageError] = useState<boolean>(false);
  const [proficiencyError, setProficiencyError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [guideId, setGuideId] = useState<number>(1);

  const userLanguageId = useRecoilValue(UserLanguageIdStore);
  const setUserLanguages = useSetRecoilState(UserLanguagesStore);

  const handleGoBack = useCallback(() => {
    if (fromDashboard) {
      router.push('/candidates/dashboard/profile/')
      return;
    }

    router.push('/candidates/flow/languages/')
  }, []);

  const fetchOneUserLanguage = useCallback(async (id: number) => {
    try {
      const resp: AxiosResponse<any, any> = await getOneUserLanguage(id);
      const languageFetched: IUserLanguage = resp.data.data.data;
      setLanguage(languageFetched.Language || null);
      setProficiency(languageFetched.proficiency);
    } catch (error) {}
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteUserLanguage(id)
      setUserLanguages(null);
      handleGoBack();
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (forEdit) {
      if (!userLanguageId) {
        handleGoBack();
      } else {
        fetchOneUserLanguage(userLanguageId);
      }
    };
  }, []);

  const handleLanguageClick = useCallback((language: ILanguage) => {
    setLanguage(language);
    setLanguageDropdown(false);
    setLanguageError(false);
  }, []);

  const handleProficiencyClick = useCallback((level: ProficiencyLevel) => {
    setProficiency(level);
    setProficiencyDropdown(false);
    setProficiencyError(false);
  }, []);

  const handleAddLanguage = async () => {
    let errorAppeared: boolean = false;
    if(!proficiency) {
      setProficiencyError(true);
      errorAppeared = true;
    }
    if(!language) {
      setLanguageError(true);
      return;
    }
    if(errorAppeared) return;

    const data: IUserLanguage = {
      proficiency: proficiency,
      language_id: language?.language_id
    }

    try {
      setIsLoading(true);
      if (!forEdit) await postUserLanguage(data);
      else if (forEdit && userLanguageId) updateUserLanguage(userLanguageId, data);
      setUserLanguages(null);
      handleGoBack();
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <FlowContainer
      title={forEdit ? 'EDIT LANGUAGE' : 'ADD A NEW LANGUAGE'}
      text={forEdit ? 'Modify the proficiency of this language or remove it' : 'Add languages you know or may have studied. We’ve included a proficiency guide.'}
      forAddEdit
    >
      <div className="add">
        <div className="add__content">
          <div className="add__left">
            <div className="add__form">
              <div className="add__row">
                <div className="add__label add__label--first">
                  <Label title='LANGUAGE'>
                    <div
                      className="add__select"
                      onClick={() => {
                        setLanguageDropdown(!languageDropdown);
                        setProficiencyDropdown(false);
                      }}
                    >
                      <Select
                        value={language?.name || ''}
                        error={languageError}
                      />
                    </div>

                    <LanguageDropdown
                      isOpen={languageDropdown}
                      onSelect={handleLanguageClick}
                    />
                  </Label>
                </div>

                <div className="add__label">
                  <Label title='PROFICIENCY / LEVEL'>
                    <div
                      className="add__select"
                      onClick={() => {
                        setLanguageDropdown(false);
                        setProficiencyDropdown(!proficiencyDropdown);
                      }}
                    >
                      <Select
                        value={proficiency || ''}
                        error={proficiencyError}
                      />
                    </div>

                    <ProficiencyDropdown
                      isOpen={proficiencyDropdown}
                      onSelect={handleProficiencyClick}
                    />
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="add__right">
            <div className="guides">
              {guides.map(guide => (
                <div key={guide.id} className="guides__item">
                  <div onClick={() => setGuideId(guide.id)} className="guides__title">
                    {guide.title}
                  </div>

                  {guide.id === guideId && (
                    <div className="guides__text">
                      {guide.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="add__bottom">
          <SaveButtons
            buttonsType={!forEdit ? SaveButtonType.Add : SaveButtonType.Update}
            onSave={handleAddLanguage}
            onCancel={handleGoBack}
            isSaveLoading={isLoading}
            onDelete={() => {
              if (userLanguageId) handleDelete(userLanguageId);
            }}
          />
        </div>
      </div>
    </FlowContainer>
  )
}
