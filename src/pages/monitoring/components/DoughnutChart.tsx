import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ApexCharts from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';

const DoughnutChart = ({ type, title }: { type: string, title: string }) => {
  const { t } = useTranslation();
  const [day, setDay] = useState<Date | null>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    series: number[];
  }>({
    labels: [],
    series: [],
  });
  const [loaded, setLoaded] = useState(false);
  const [totalData, setTotalData] = useState<any[]>([]);
  const [query, setQuery] = useState({
    startDate: '20230101',
    endDate: '20240101',
    company: '',
    product_name: '',
    product_unit: '',
    process_name: '',
    facility_name: '',
  });

  useEffect(() => {
    if (!day) {
      setDay(new Date());
    }
    fetchData();
  }, [day]);

  const fetchData = async () => {
    // Simulate fetching data based on the query
    const data = await fetchDataFromStore(query);
    setTotalData(data);
    makeChartData();
  };

  const fetchDataFromStore = (query: any) => {
    // Simulate data fetching logic (e.g., from Redux or API)
    // This is where you'd get your actual data
    return [
      { company: 'Company A', accomplishment: 10 },
      { company: 'Company B', accomplishment: 20 },
      { company: 'Company C', accomplishment: 15 },
    ];
  };

  const sumProductNameData = (name: string) => {
    const dataList = totalData.filter((data) => data[type] === name);
    let sum = 0;
    dataList.forEach((item) => {
      sum += item.accomplishment;
    });
    chartData.series.push(sum);
    chartData.labels.push(name);
  };

  const makeChartData = () => {
    setLoaded(false);
    const dataList = Array.from(new Set(totalData
      .map((data) => data[type])
      .filter(value => value !== undefined && value !== null)
    ));
    chartData.series = [];
    chartData.labels = dataList.map(item => item?.toString() || 'Unknown');
    setLoaded(true);
  };

  const handleSearch = () => {
    if (!day) {
      alert('Please select a date.');
      return;
    }
    // Handle search functionality and fetch new data based on the selected day
    setQuery({
      ...query,
      startDate: formatDate(day),
      endDate: formatDate(day),
    });
    fetchData();
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const chartOptions = {
    chart: {
      type: 'donut' as const,
    },
    labels: chartData.labels,
    // title: {
    //   text: title,
    //   align: 'center' as const,
    // },
  };

  return (
    <Container>
      <ChartTitle>{title}</ChartTitle>
      <DateContainer>
          <DatePicker
            selected={day}
            onChange={(date) => setDay(date)}
            // dateFormat="yyyy.MM.dd"
            // locale="ko"
          />
          <Button onClick={handleSearch}>{t('monitoring.search')}</Button>
        </DateContainer>

      {loaded && (
        <ChartWrapper>
          <ApexCharts options={chartOptions} series={chartData.series} type="donut" height={320} />
        </ChartWrapper>
      )}
    </Container>
  );
};

export default DoughnutChart;


// Styled components for layout
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 320px;
  margin: 20px auto;
`;

const ChartWrapper = styled.div`
  width: 320px;
  height: 320px;
  margin-top: 16px;
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


const ChartTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 16px;
  border-radius: 8px;
`;

