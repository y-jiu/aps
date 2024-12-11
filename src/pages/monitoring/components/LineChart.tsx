import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const Dashboard = ({ type = '', title = '제목' }) => {
  const { t } = useTranslation();
  const [startDay, setStartDay] = useState<Date | null>(null);
  const [endDay, setEndDay] = useState<Date | null>(null);
  const [keyword, setKeyword] = useState({
    startDate: '',
    endDate: '',
    company: '',
    product_name: '',
    product_unit: '',
    process_name: '',
    facility_name: '',
  });
  const [loaded, setLoaded] = useState(false);
  const [totalData, setTotalData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{
    labels: string[];
    series: number[];
  }>({
    labels: [],
    series: [],
  });
  const lang = {
    days: ['일', '월', '화', '수', '목', '금', '토'],
    months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  };

  // Helper function to format dates
  const formatDate = (date: Date) => format(date, 'yyyy.MM.dd');

  useEffect(() => {
    // Set the initial dates to the current month
    const today = new Date();
    setStartDay(new Date(today.getFullYear(), today.getMonth(), 1));
    setEndDay(new Date(today.getFullYear(), today.getMonth() + 1, 0));
  }, []);

  const search = async () => {
    if (!startDay || !endDay) {
      alert('날짜를 입력해주세요');
      return;
    }

    // Fetch data based on selected start and end date (mockup function)
    try {
      const fetchedData = await getData(keyword);
      setTotalData(fetchedData);
      setLoaded(true);
    } catch {
      alert('데이터를 가져오는 데 실패했습니다');
    }
  };

  const getData = async (keyword: any) => {
    // Mockup function to simulate API call
    return [
      { workdate: '2024-12-01', accomplishment: 100 },
      { workdate: '2024-12-02', accomplishment: 120 },
      // Add more data here
    ];
  };

  const getUniqueDates = () => {
    const dates = totalData.map((data) => data.workdate.slice(0, 10));
    const uniqueDates = Array.from(new Set(dates));
    return uniqueDates.sort();
  };

  const getAccumulateData = (name: string) => {
    const data = getDateData(name);
    const accumulatedData: number[] = [];
    let currentAccumulation = 0;

    getUniqueDates().forEach((date) => {
      const value = data[date] || 0;
      currentAccumulation += value;
      accumulatedData.push(currentAccumulation);
    });

    return {
      name,
      data: accumulatedData,
      borderColor: getRandomColor(),
    };
  };

  const getDateData = (name: string) => {
    const dataList = totalData.filter((data) => data[type] === name);
    const dateWiseData: Record<string, number> = {};
    dataList.forEach((item) => {
      dateWiseData[item.workdate.slice(0, 10)] = item.accomplishment;
    });
    return dateWiseData;
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const chartOptions = {
    chart: {
      type: 'line' as const,
      height: 350,
    },
    xaxis: {
      categories: getUniqueDates(),
    },
    stroke: {
      curve: 'smooth' as const,
    },
  };

  const chartSeries = [
    ...Array.from(new Set(totalData.map((data) => data[type]))).map((name: string) => {
      return {
        name,
        data: getAccumulateData(name).data,
      };
    }),
  ];

  return (
    <Container>
      <ChartTitle>{title}</ChartTitle>
      <Sheet>
        <DateContainer>
          <Label>{t('monitoring.startDate')}</Label>
          <DatePicker
            selected={startDay}
            onChange={(date) => setStartDay(date)}
            // dateFormat="yyyy.MM.dd"
            // locale="ko"
          />
        </DateContainer>
        <DateContainer>
          <Label>{t('monitoring.endDate')}</Label>
          <DatePicker
            selected={endDay}
            onChange={(date) => setEndDay(date)}
            // dateFormat="yyyy.MM.dd"
            // locale="ko"
          />
        </DateContainer>
        <Button onClick={search}>{t('monitoring.search')}</Button>
      </Sheet>

      <ChartContainer>
        {loaded && (
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={320}
          />
        )}
      </ChartContainer>
    </Container>
  );
};

export default Dashboard;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

const Sheet = styled.div`
  margin: 10px 0;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  background-color: #3f51b5;
  color: white;
  border: none;
  padding: 8px 16px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 4px;
`;

const ChartContainer = styled.div`
  width: 640px;
  height: 320px;
  margin: 20px 0;
`;

const ChartTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.label`

  margin-right: 10px;
  font-size: 15px;
  font-weight: 600;
  margin-left: 10px;
`;

