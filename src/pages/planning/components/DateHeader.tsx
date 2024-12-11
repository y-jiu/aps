import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import { getPlanList, initializeDates, setDayPlanBOM, setFilterQuery, setIsExpanded, setPlanData } from '../../../modules/plan';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IAppState } from '../../../types';
const HeaderWrapper = styled.div`
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin: 0 auto;
  background-color: #f5f5f5;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ExpandButton = styled.button<{ isExpanded: boolean }>`
  position: absolute;
  left: 8px;
  padding: 5px 10px;
  border-radius: 0.25rem;
  font-size: 13px;
  font-weight: 500;
  background-color: ${props => props.isExpanded ? '#fffcce' : '#ffffff'};
  border: 1px solid #ddd;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.isExpanded ? '#fff9b0' : '#f5f5f5'};
  }
`;

const DateLabel = styled.p`
  font-size: 13px;
  font-weight: 500;
  margin: 0 8px;
  margin-bottom: 2px;
`;

// const CustomDatePicker = styled(DatePicker)`
//   background-color: white;
//   border: 1px solid #ddd;
//   padding: 0.25rem 0.5rem;
//   border-radius: 0.25rem;
//   width: 180px;
// `;

const SearchButton = styled.button`
  background-color: #1976d2;
  color: white;
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background-color: #1565c0;
  }
`;

interface DateHeaderProps {}

const DateHeader: React.FC<DateHeaderProps> = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const [startDay, setStartDay] = useState<Date | null>(null);
  const [endDay, setEndDay] = useState<Date | null>(null);
  const [startDayAttributes, setStartDayAttributes] = useState<any[]>([]);
  const [endDayAttributes, setEndDayAttributes] = useState<any[]>([]);

  const isExpanded = useSelector((state: IAppState) => state.plan.isExpanded);
  const bomDay = useSelector((state: IAppState) => state.plan.day);

  useEffect(() => {
    initializeDates();
  }, []);

  const initializeDates = () => {
    if (!bomDay?.startDay) {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      
      setStartDay(today);
      setEndDay(nextMonth);
      
      dispatch(setDayPlanBOM({ startDay: today, endDay: nextMonth }));
    } else {
      if (bomDay.startDay) setStartDay(new Date(bomDay.startDay));
      if (bomDay.endDay) setEndDay(new Date(bomDay.endDay));
    }
  };

  const handleSearch = async () => {
    if (!startDay || !endDay) return;

    dispatch(setPlanData([]));
    dispatch(setFilterQuery({}));

    const start = dayjs(startDay).format('YYYYMMDD');
    const end = dayjs(endDay).format('YYYYMMDD');

    await dispatch(getPlanList({ start, end }) as any);

    dispatch(setDayPlanBOM({ startDay, endDay }));
  };

  const handleExpandCollapse = () => {
    dispatch(setIsExpanded(!isExpanded));
  };

  const monthlyCheckDot = async (year: number, month: number, dateType: 'startDay' | 'endDay') => {
    const yearMonth = `${year}${String(month).padStart(2, '0')}`;
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}plan/calendar/${yearMonth}`
      );
      const data = await response.json();
      
      if (dateType === 'startDay') {
        setStartDayAttributes([{
          dot: true,
          dates: data.date || []
        }]);
      } else {
        setEndDayAttributes([{
          dot: true,
          dates: data.date || []
        }]);
      }
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setStartDay(date);
      monthlyCheckDot(date.getFullYear(), date.getMonth() + 1, 'startDay');
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setEndDay(date);
      monthlyCheckDot(date.getFullYear(), date.getMonth() + 1, 'endDay');
    }
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

        <DateLabel>시작날짜</DateLabel>
        <DatePicker
          selected={startDay}
          onChange={handleStartDateChange}
          dateFormat="yyyy.MM.dd"
          placeholderText="Select start date"
          highlightDates={startDayAttributes[0]?.dates}
        />

        <DateLabel style={{ marginLeft: '1.5rem' }}>종료날짜</DateLabel>
        <DatePicker
          selected={endDay}
          onChange={handleEndDateChange}
          dateFormat="yyyy.MM.dd"
          placeholderText="Select end date"
          highlightDates={endDayAttributes[0]?.dates}
        />

        <SearchButton onClick={handleSearch}>
          검색
        </SearchButton>
      </ContentContainer>
    </HeaderWrapper>
  );
};

export default DateHeader;