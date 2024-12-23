import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import { getPlanByDate, getPlanByMonth, initializeDates, setDayPlanBOM, setFilterQuery, setIsExpanded, setPlanData } from '../../../modules/plan';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IAppState } from '../../../types';
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
  left: 8px;
  top: ${props => props.isExpanded ? '0px' : '50%'};
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  const [isExpanded, setIsExpanded] = useState(false);
  // const isExpanded = useSelector((state: IAppState) => state.plan.isExpanded);
  const bomDay = useSelector((state: IAppState) => state.plan.day);

  console.log(isExpanded)
  useEffect(() => {
    initializeDate();
  }, []);

  const initializeDate = () => {
    const today = new Date();
    setSelectedDate(today);
    dispatch(setDayPlanBOM({ day: today }));
    monthlyCheckDot(today.getFullYear(), today.getMonth() + 1);
  };

  const handleSearch = async () => {
    if (!selectedDate) return;

    dispatch(setPlanData([]));
    dispatch(setFilterQuery({}));

    const formattedDate = searchType === 'daily' 
      ? dayjs(selectedDate).format('YYYYMMDD')
      : dayjs(selectedDate).format('YYYY/MM');

    // await dispatch(getPlanList({ date: formattedDate, searchType }) as any);
    dispatch(setDayPlanBOM({ day: selectedDate }));
    // console.log(formattedDate)

    if (searchType === 'daily') {
      // dispatch(setDayPlanBOM({ day: selectedDate }));
      dispatch(getPlanByDate(formattedDate));
    } else {
      const year = formattedDate.split('/')[0];
      const month = formattedDate.split('/')[1];
      dispatch(getPlanByMonth(year, month));
      // dispatch(setDayPlanBOM({ day: selectedDate }));
    }
  };

  const monthlyCheckDot = async (year: number, month: number) => {
    const yearMonth = `${year}${String(month).padStart(2, '0')}`;
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}plan/calendar/${yearMonth}`
      );
      const data = await response.json();
      
      setDateAttributes([{
        dot: true,
        dates: data.date || []
      }]);
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      monthlyCheckDot(date.getFullYear(), date.getMonth() + 1);
    }
  };

  const handleExpandCollapse = () => {
    // dispatch(setIsExpanded(!isExpanded));
    setIsExpanded(!isExpanded);
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
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat={searchType === 'daily' ? "yyyy.MM.dd" : "yyyy.MM"}
          showMonthYearPicker={searchType === 'monthly'}
          placeholderText={searchType === 'daily' ? "Select date" : "Select month"}
          highlightDates={dateAttributes[0]?.dates}
        />

        <SearchButton onClick={handleSearch}>
          검색
        </SearchButton>
        </>}
      </ContentContainer>
    </HeaderWrapper>
  );
};

export default DateHeader;