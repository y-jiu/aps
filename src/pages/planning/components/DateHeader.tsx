import "react-datepicker/dist/react-datepicker.css";

import React, { useEffect, useState } from 'react';
import { getPlanByDate, getPlanByMonth, getPlanCalendar, initializeDates, setDayPlanBOM, setFilterQuery, setIsExpanded, setPlanData } from '../../../modules/plan';
import { useDispatch, useSelector } from 'react-redux';

import { AnyAction } from 'redux';
import DatePicker from 'react-datepicker';
import { IAppState } from '../../../types';
import { ThunkDispatch } from 'redux-thunk';
import dayjs from 'dayjs';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin: 0 auto;
  background-color: #f5f5f5;
  height: 30px;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ExpandButton = styled.button<{ isExpanded: boolean }>`
  position: absolute;
  left: ${props => props.isExpanded ? '0px' : '8px'};
  top: ${props => props.isExpanded ? '0px' : '50%'};
  padding: 5px 10px;
  border-radius: 0.25rem;
  font-size: 13px;
  font-weight: 500;
  background-color: ${props => props.isExpanded ? '#fffcce' : '#ffffff'};
  border: 1px solid #ddd;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.isExpanded ? '#fff9b0' : '#f5f5f5'};
  }
`;

const DateLabel = styled.p`
  font-size: 13px;
  font-weight: 500;
  margin: 0 8px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    z-index: 999;
  }
  .react-datepicker-popper {
    z-index: 999;
  }

  .react-datepicker__day--highlighted {
    position: relative;
    background-color: transparent;
    color: black;
    
    &:hover {
      background-color: #f0f0f0;
    }

    /* Add dot under the date */
    &::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background-color: #00CCC0;
      border-radius: 50%;
    }
  }

`;

const SearchButton = styled.button`
  background-color: #1976d2;
  color: white;
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: #1565c0;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: 3px 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: ${props => props.isActive ? '#1976d2' : '#ffffff'};
  color: ${props => props.isActive ? '#ffffff' : '#000000'};
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.isActive ? '#1565c0' : '#f5f5f5'};
  }
`;

interface DateHeaderProps {}

const DateHeader: React.FC<DateHeaderProps> = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateAttributes, setDateAttributes] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<'daily' | 'monthly'>('daily');
  const isExpanded = useSelector((state: IAppState) => state.plan.isExpanded);
  const planCalendar = useSelector((state: IAppState) => state.plan.planCalendar);

  useEffect(() => {
    initializeDate();
  }, []);

  useEffect(() => {
    if (planCalendar) {
      if (planCalendar.length > 0) {
        const dates = planCalendar.map((date: string) => {
          const year = parseInt(date.substring(0, 4));
          const month = parseInt(date.substring(5, 7)) -1; // Month is 0-based
          const day = parseInt(date.substring(8, 10));
          return new Date(year, month, day);
        });
        setDateAttributes([{
          dot: true,
          dates: dates
        }]);
      }
      else {
        setDateAttributes([]);
      }
    }
  }, [planCalendar]);

  const initializeDate = () => {
    const today = new Date();
    setSelectedDate(today);
    dispatch(setDayPlanBOM({ day: today }));
    dispatch(getPlanCalendar(today.getFullYear().toString(), (today.getMonth() + 1).toString()));
  };

  const handleSearch = async () => {
    if (!selectedDate) return;

    dispatch(setPlanData([]));
    dispatch(setFilterQuery({}));

    const formattedDate = searchType === 'daily' 
      ? dayjs(selectedDate).format('YYYYMMDD')
      : dayjs(selectedDate).format('YYYY/MM');

    dispatch(setDayPlanBOM({ day: selectedDate }));

    if (searchType === 'daily') {
      dispatch(getPlanByDate(formattedDate));
    } else {
      const year = formattedDate.split('/')[0];
      const month = formattedDate.split('/')[1];
      dispatch(getPlanByMonth(year, month));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleExpandCollapse = () => {
    dispatch(setIsExpanded(!isExpanded));
  };

  const handleMonthChange = (date: Date) => {
    dispatch(getPlanCalendar(date.getFullYear().toString(), (date.getMonth() + 1).toString()));
  };

  return (
    <HeaderWrapper>
      <ContentContainer>
        <ExpandButton
          isExpanded={isExpanded}
          onClick={handleExpandCollapse}
        >
          {isExpanded ? "접기 <" : "펼치기 >"}
        </ExpandButton>

        {isExpanded && <>
        <TabContainer>
        <Tab 
          isActive={searchType === 'daily'}
          onClick={() => setSearchType('daily')}
          style={{ marginLeft: '70px' }}
        >
          일별 검색
        </Tab>
        <Tab 
          isActive={searchType === 'monthly'}
          onClick={() => setSearchType('monthly')}
        >
          월별 검색
        </Tab>
      </TabContainer>
        <DateLabel>날짜</DateLabel>
        <DatePickerWrapper>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            onMonthChange={handleMonthChange}
            dateFormat={searchType === 'daily' ? "yyyy.MM.dd" : "yyyy.MM"}
            showMonthYearPicker={searchType === 'monthly'}
            placeholderText={searchType === 'daily' ? "Select date" : "Select month"}
            highlightDates={dateAttributes[0]?.dates}
          />
        </DatePickerWrapper>

        <SearchButton onClick={handleSearch}>
          검색
        </SearchButton>
        </>}
      </ContentContainer>
    </HeaderWrapper>
  );
};

export default DateHeader;