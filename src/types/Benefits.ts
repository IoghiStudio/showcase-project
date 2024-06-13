export enum BenefitName {
  Relocation = "Relocation procedures by employer",
  Meals = "Free meals or food vouchers",
  Insurrance = "Health care plan / Insurance",
  Training = "Training and development",
  Airplane = "Airplane tickets paid by employer",
  Accommodation = "Accommodation",
  Pension = "Retirement / Pension plans",
  Bonuses = "Bonuses / Awards / Gifts",
};

export interface BenefitItem {
  id: string;
  name: BenefitName;
};
