'use client';
import './Invoices.scss';
import { useCallback, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { InvoiceQueries, getInvoices, getInvoicesCompanies } from '@/services/api/stripe.service';
import { IInvoice, InvoicesStore } from '@/store/invoicesStore';
import { useRecoilState } from 'recoil';
import classNames from 'classnames';
import { CircleMenu } from '../../../utils/MenuCircle/CircleMenu';
import Link from 'next/link';

type Props = {
  forCompany?: boolean;
};

export const Invoices: React.FC<Props> = ({ forCompany = false }) => {
  const [invoices, setInvoices] = useRecoilState(InvoicesStore);

  const fetchInvoices = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getInvoices(InvoiceQueries.LastYear);
      const invoicesFetched: IInvoice[] = resp.data.data.payment;
      setInvoices(invoicesFetched);
    } catch (error) {}
  }, []);

  const fetchInvoicesCompanies = useCallback(async () => {
    try {
      const resp: AxiosResponse<any, any> = await getInvoicesCompanies(InvoiceQueries.LastYear);
      const invoicesFetched: IInvoice[] = resp.data.data.payment;
      setInvoices(invoicesFetched);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!forCompany) {
      fetchInvoices();
    } else {
      fetchInvoicesCompanies();
    }
  }, []);

  return (
    <div className="container invoices">
      <div className="invoices__top">
        <div className="container__title">
          Payment history
        </div>

        <div className="container__text">
          Past payments made by this account
        </div>
      </div>

      <div className="invoices__items">
        {invoices && [...invoices].reverse().map(invoice => {
          const {
            amount,
            createdAt,
            duration,
            invoice_number,
            invoice_url,
            item_name,
            status,
            stripe_id,
          } = invoice;

          return (
            <div key={stripe_id} className="invoices__item">
              <div className="invoices__item-left">
                <div className="invoices__text">
                  {`${item_name} ${duration ? '- ' + duration : ''}`}
                </div>

                {status === 'SUCCESS' && (
                  <div className="invoices__text invoices__text--green">
                    Payment complete
                  </div>
                )}

                {status === 'PENDING' && (
                  <div className="invoices__text invoices__text--red invoices__text--it">
                    Transaction Failed
                  </div>
                )}
              </div>

              <div className="invoices__item-right">
                {invoice_url && (
                  <Link href={invoice_url} className="invoices__download">
                    Download
                  </Link>
                )}

                <div className="invoices__pair">
                  <div className="invoices__text invoices__text--bold">Date</div>
                  <div className="invoices__text">{new Date(createdAt).toLocaleDateString('en-GB').replace(/\//g, ' / ')}</div>
                </div>

                <div className="invoices__pair">
                  <div className="invoices__text invoices__text--bold">Amount</div>

                  <div
                    className={classNames("invoices__text invoices__text--price", {
                      "invoices__text--green": status === 'SUCCESS',
                      "invoices__text--red": status === 'PENDING'
                    })}
                  >
                    {`$${(amount / 100).toFixed(2)}`}
                  </div>
                </div>

                <div className="invoices__pair invoices__pair--invoice">
                  <div className="invoices__text invoices__text--bold">Invoice</div>
                  <div className="invoices__text invoices__text--blue">{invoice_number ? '#' + invoice_number : '-'}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
