'use client';
import { Picture } from '@/components/candidates/Dashboard/Settings/Account/Picture';
import '../../../candidates/Dashboard/Settings/Account/Account.scss';
import { CompanyInfo } from "./CompanyInfo";

export const Company = () => {
  return (
    <div className="account">
      <div className="account__picture">
        <Picture forCompany forCompanyLogo />
      </div>

      <div className="account__right">
        <div className="account__info">
          <CompanyInfo />
        </div>
      </div>
    </div>
  )
}
