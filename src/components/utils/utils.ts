import { BenefitItem, BenefitName } from "@/types/Benefits";
import { IRecurrency } from "@/types/Currency";
import { MonthName, MonthType } from "@/types/Month";
import { ChangeEvent } from "react";
import { format } from "date-fns";

export type TS3Collections = "files/profile/" | "files/videos/" | "files/EditVideos/" | "files/administration_image/" | "flags/";

// export const formatMediaUrl = (uri: string, collectionName?: TS3Collections): string => {
//   return `${process.env.NEXT_PUBLIC_S3_URI}${collectionName}${uri}`;
// };

export const hotjarScriptCandidates = `(function(h,o,t,j,a,r){
  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  h._hjSettings={hjid:3806937,hjsv:6};
  a=o.getElementsByTagName('head')[0];
  r=o.createElement('script');r.async=1;
  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
  a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;

export const hotjarScriptCompanies = `(function(h,o,t,j,a,r){
  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  h._hjSettings={hjid:3806938,hjsv:6};
  a=o.getElementsByTagName('head')[0];
  r=o.createElement('script');r.async=1;
  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
  a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;

export const formatMediaUrl = (uri: string, collectionName?: TS3Collections): string => {
  return `/flags/${uri}`;
};

// timeUtils.ts
export const formatTimestamp = (timestamp: string) => {
  const now = new Date();
  const messageTime = new Date(timestamp);

  // Ensure both now and messageTime are valid Date objects
  if (isNaN(now.getTime()) || isNaN(messageTime.getTime())) {
    // Handle invalid dates if needed
    return 'Invalid Date';
  }

  const timeDifference = now.getTime() - messageTime.getTime();

  const seconds = Math.floor(timeDifference / 1000);

  if (seconds < 60) {
    return 'Now';
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    if (hours < 24) {
      return hours === 1 ? 'yesterday' : `${hours}h ago`;
    }
  } else if (seconds < 172800) {
    return 'yesterday';
  } else if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `${days}d ago`;
  } else {
    // More than 7 days, show the date in the format 'dd/mm/yyyy'
    const formattedDate =
      ('0' + messageTime.getDate()).slice(-2) +
      '/' +
      ('0' + (messageTime.getMonth() + 1)).slice(-2) +
      '/' +
      messageTime.getFullYear();
    return formattedDate;
  }
};

export function addDaysToDate(originalDateString: string, numberOfDays: number) {
  const originalDate = new Date(originalDateString);
  const resultDate = new Date(originalDate.getTime() + numberOfDays * 24 * 60 * 60 * 1000);
  return resultDate.toISOString().split('T')[0];
}

export function removeDuplicates(array: any[], key: string) {
  const seen = new Set<number>();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const calculatePercentageLeft = (dueDate: string, totalDays: number): number => {
  const currentDate = new Date();
  const parsedDueDate = new Date(dueDate);

  const timeRemaining = parsedDueDate.getTime() - currentDate.getTime();

  const totalDuration = totalDays * 24 * 60 * 60 * 1000; // Total duration in milliseconds
  return Math.max(0, Math.min((timeRemaining / totalDuration) * 100, 100));
};

export const formatDateShort = (dateString: string) => {
  let inputDate = new Date(dateString);

  if (!dateString) {
    inputDate = new Date();
  }
  const day = inputDate.getDate();

  let daySuffix = 'th';
  if (day === 1 || day === 21 || day === 31) daySuffix = 'st';
  else if (day === 2 || day === 22) daySuffix = 'nd';
  else if (day === 3 || day === 23) daySuffix = 'rd';

  const formattedMonth = format(inputDate, 'MMM');
  const year = inputDate.getFullYear();

  return `${formattedMonth} ${day}${daySuffix}, ${year}`;
};

export const formatFullDateTime = (dateString: string): string => {
  let inputDate = new Date(dateString);

  if (isNaN(inputDate.getTime())) {
    // Handle invalid dates if needed
    return 'Invalid Date';
  }

  const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(inputDate);

  const formattedShortDate = formatDateShort(dateString);

  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: false };
  const formattedTime = format(inputDate, 'HH:mm');

  return `${dayOfWeek}, ${formattedShortDate}, ${formattedTime}`;
};

export const degrees: string[] = [
  "Professional Certificate",
  "High School Diploma / GED",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctoral Degree",
];

export const jobTypeData: string[] = [
  "Full-time",
  "Part-time",
  "Internship / Volunteering",
  "Project / Seasonal",
];

export const workPlaceTypes: string[] = [
  "On Site",
  "Remote",
  "Hybrid",
];

export type ProficiencyLevel =
  | "NATIVE"
  | "BEGINNER (A1)"
  | "ELEMENTARY (A2)"
  | "INTERMEDIATE (B1)"
  | "UPPER_INTERMEDIATE (B2)"
  | "ADVANCED (C1)"
  | "PROFICIENT (C2)";

export interface ISpokenLanguage {
  id: number;
  proficiency: ProficiencyLevel;
}

export const LanguageApiLevels: ISpokenLanguage[] = [
  {
    id: 1,
    proficiency: "NATIVE"
  },
  {
    id: 2,
    proficiency: "BEGINNER (A1)"
  },
  {
    id: 3,
    proficiency: "ELEMENTARY (A2)"
  },
  {
    id: 4,
    proficiency: "INTERMEDIATE (B1)"
  },
  {
    id: 5,
    proficiency: "UPPER_INTERMEDIATE (B2)",
  },
  {
    id: 6,
    proficiency: "ADVANCED (C1)",
  },
  {
    id: 7,
    proficiency: "PROFICIENT (C2)",
  },
];

export const handleDates = (
  startYear: string,
  endYear: string,
  startMonth: MonthType | null | undefined,
  endMonth: MonthType | null | undefined,
  setEndYear: (year: string) => void,
  setEndMonth: (month: MonthType) => void,
  setEndMonthsArray: (monthsArray: MonthType[]) => void,
) => {
  if (endYear < startYear) {
    setEndYear(startYear);
  }

  if (startYear.length > 0) {
    if (endYear === startYear) {
      if (startMonth) {
        if (!endMonth || +endMonth.id < +startMonth.id) {
          setEndMonth(startMonth);
        }

        const newMonths = getMonthsArray().filter(month => +month.id >= +startMonth.id);
        setEndMonthsArray(newMonths);
      }
    } else if (endYear > startYear) {
      setEndMonthsArray(getMonthsArray())
    }
  }
};

export const recurrenciesList: IRecurrency[] = [
  {
    name: "Hourly",
  },
  {
    name: "Daily",
  },
  {
    name: "Weekly",
  },
  {
    name: "Monthly",
  },

  {
    name: "Yearly",
  },
];

export const BenefitList: BenefitItem[] = [
  {
    id: '1',
    name: BenefitName.Relocation
  },
  {
    id: '2',
    name: BenefitName.Meals
  },
  {
    id: '3',
    name: BenefitName.Insurrance
  },
  {
    id: '4',
    name: BenefitName.Training
  },
  {
    id: '5',
    name: BenefitName.Airplane
  },
  {
    id: '6',
    name: BenefitName.Accommodation
  },
  {
    id: '7',
    name: BenefitName.Pension
  },
  {
    id: '8',
    name: BenefitName.Bonuses
  },
];

type Event = ChangeEvent<HTMLInputElement>;

export const customNumberValidator = (
  e: Event ,
  setHandler: (input: string) => void,
  forPhoneNumber?: boolean
) => {
  const nums = '1234567890';
  let value = e.target.value;

  if (!forPhoneNumber) {
    if (value[0] === '0') {
      return;
    }
  }

  let shouldAdd = true;

  for (let ch of value) {
    if (!nums.includes(ch)) {
      shouldAdd = false;
      return;
    }
  }

  if (shouldAdd) {
    setHandler(value);
  }
};

export const getMonthsArray = (): MonthType[] => ([
  { id: "0", name: MonthName.January },
  { id: "1", name: MonthName.February },
  { id: "2", name: MonthName.March },
  { id: "3", name: MonthName.April },
  { id: "4", name: MonthName.May },
  { id: "5", name: MonthName.June },
  { id: "6", name: MonthName.July },
  { id: "7", name: MonthName.August },
  { id: "8", name: MonthName.September },
  { id: "9", name: MonthName.October },
  { id: "10", name: MonthName.November },
  { id: "11", name: MonthName.December },
]);

export const monthsArray = getMonthsArray();

export const createYearsArray = (
  from: number,
  to: number
): string[] => {
  const output: string[] = [];

  for (let i = from; i >= to; i--) {
    output.push(String(i));
  }

  return output;
};

export const isEmailCorrect = (email: string) => email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);
