'use client';
import '../../../candidates/Dashboard/Positions/Positions.scss';
import '../SearchWorkers/SearchWorkers.scss';
import classNames from 'classnames';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { ButtonColor } from '@/types/ButtonColor';
import { useRouter } from 'next/navigation';
import { CandidateHeaderMessageStore, CandidateHeaderMessages } from '@/store/headerStore';
import { AnnounceStatus, AnnouncesActiveStore, AnnouncesStore, IAnnounce } from '@/store/announceStore';
import { getAnnounces } from '@/services/api/job.service';
import { ButtonIcon, ButtonWithIcon } from '@/components/candidates/Dashboard/utils/ButtonWihIcon';
import { AnnBox } from './AnnBox';

enum AnnounceFilter {
  All,
  Active,
  Paused,
};

interface IAnnounceFilter {
  id: number,
  text: string,
  filter: AnnounceFilter,
};

const announceFilters: IAnnounceFilter[] = [
  {
    id: 1,
    text: 'All Announcements',
    filter: AnnounceFilter.All
  },
  {
    id: 2,
    text: 'Active',
    filter: AnnounceFilter.Active
  },
  {
    id: 3,
    text: 'Paused',
    filter: AnnounceFilter.Paused
  },
];

export const Ann = () => {
  const [announcesFiltered, setAnnouncesFiltered] = useState<IAnnounce[] | null>(null);
  const [currentFilter, setCurrentFilter] = useState<AnnounceFilter>(AnnounceFilter.All);
  const router = useRouter();
  const setCandidateHeaderMessage = useSetRecoilState(CandidateHeaderMessageStore);
  const [announces, setAnnounces] = useRecoilState(AnnouncesStore);
  const [activeAnnounces, setActiveAnnounces] = useRecoilState<number>(AnnouncesActiveStore);

  const [perPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [announcesFound, setAnnouncesFound] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([1, 2, 3]);

  const fetchAnnounces = useCallback(async (params: string) => {
    try {
      const resp: AxiosResponse<any, any> = await getAnnounces(params);
      const data: IAnnounce[] = resp.data.data.data;
      const count: number = resp.data.data.count;
      setAnnounces(data);
      setAnnouncesFound(resp.data.data.count);
      setActiveAnnounces(resp.data.data.count);
      setTotalPages(Math.ceil((resp.data.data.count || 0) / perPage));
      setAnnouncesFiltered(data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    modifyPages();
  }, [currentPage]);

  const modifyPages = useCallback(() => {
    if (currentPage > pages[pages.length - 1]) {
      const newPages = pages.map(page => page + 1);
      setPages(newPages);
    }

    if (currentPage < pages[0]) {
      const newPages = pages.map(page => page - 1);
      setPages(newPages);
    }
  }, [currentPage, pages, perPage]);

  useEffect(() => {
    setCandidateHeaderMessage(CandidateHeaderMessages.JobAnnouncements);
    if (!announces) fetchAnnounces(`?page=${1}&pageSize=${perPage}`);
  }, []);

  useEffect(() => {
    if (currentFilter === AnnounceFilter.All) {
      setAnnouncesFiltered(announces);
    }

    if (currentFilter === AnnounceFilter.Active) {
      const newAnnounces = announces?.filter(a => a.status === AnnounceStatus.Open) || [];
      setAnnouncesFiltered(newAnnounces)
    }

    if (currentFilter === AnnounceFilter.Paused) {
      const newAnnounces = announces?.filter(a => a.status === AnnounceStatus.Closed) || [];
      setAnnouncesFiltered(newAnnounces)
    }

    setCurrentPage(1);
    setPages([1, 2, 3]);
  }, [currentFilter, perPage]);

  return (
    <div className="positions">
      <div className="positions__top">
        <div className="positions__top-left">
          {announceFilters.map(f => (
            <div
              key={f.id}
              onClick={() => setCurrentFilter(f.filter)}
              className={classNames("positions__filter", {
                "positions__filter--active": currentFilter === f.filter
              })}
            >
              {f.text}
            </div>
          ))
          }
        </div>

        <div className="positions__top-right">
          <div className="positions__active-info">
            <div className="positions__active-info-count">
              {activeAnnounces}
            </div>

            <div className="positions__active-info-text">
              Active announcements
            </div>
          </div>

          <div
            className="positions__button"
            onClick={() => router.push('/dashboard/announcements/add/')}
          >
            <ButtonWithIcon
              long
              color={ButtonColor.White}
              bgColor={ButtonColor.Green}
              borderColor={ButtonColor.Green}
              icon={ButtonIcon.Plus}
              text='NEW JOB ANNOUNCEMENT'
            />
          </div>
        </div>
      </div>

      <div className="positions__list">
        {announcesFiltered?.map(announce => (
          <div key={announce.job_id} className="positions__item">
            <AnnBox
              announce={announce}
              pageSize={perPage}
              currentPage={currentPage}
            />
          </div>
        ))}
      </div>

      <div className="workers__bottom">
        <div className="pagination">
          <div className="pagination__left">
            <div className="pagination__text pagination__text--bold">{currentPage}</div>
            <div className="pagination__text">-</div>
            <div className="pagination__text pagination__text--bold">{totalPages}</div>
            <div className="pagination__text">of</div>
            <div className="pagination__text pagination__text--bold">{announcesFound}</div>
            <div className="pagination__text">job listings</div>
          </div>

          <div className="pagination__right">
            <div
              onClick={() => {
                if (currentPage === 1) return;
                fetchAnnounces(`?page=${currentPage - 1}&pageSize=${perPage}`);
                setCurrentPage(currPage => currPage - 1);
              }}
              className={classNames("pagination__button pagination__button--step", {
                "pagination__button--disabled": currentPage === 1
              })}
            >
              previous page
            </div>

            <div className="pagination__pages">
              {pages.map(page => (
                <div
                  key={page}
                  onClick={() => {
                    if (page <= totalPages) {
                      setCurrentPage(page);
                      fetchAnnounces(`?page=${page}&pageSize=${perPage}`);
                    }
                  }}
                  className={classNames("pagination__button pagination__button--page", {
                    "pagination__button--active": page === currentPage,
                  })}
                >
                  {page}
                </div>
              ))}
            </div>

            <div
              onClick={() => {
                if (currentPage === totalPages) return;
                fetchAnnounces(`?page=${currentPage + 1}&pageSize=${perPage}`);
                setCurrentPage(currPage => currPage + 1);
              }}
              className={classNames("pagination__button pagination__button--step", {
                "pagination__button--disabled": currentPage === totalPages
              })}
            >
              next page
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
