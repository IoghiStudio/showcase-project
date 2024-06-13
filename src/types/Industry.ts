export interface IIndustry {
  industry_id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export interface IIndustrySubcategory {
  industry_subcategory_id: number,
  industry_id: number,
  name: string,
  createdAt: string,
  updatedAt: string
};
