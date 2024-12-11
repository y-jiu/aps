import React from "react";
import styled from "styled-components";
import DoughnutChart from "./DoughnutChart";
import LineChart from "./LineChart";
import { useTranslation } from 'react-i18next';


const PerformanceMonitoring = () => {
  const { t } = useTranslation();
  const labels = [
    { title: t('monitoring.company'), type: "company" },
    { title: t('monitoring.productName'), type: "product_name" },
    { title: t('monitoring.productUnit'), type: "product_unit" },
    { title: t('monitoring.processName'), type: "process_name" },
    { title: t('monitoring.facilityName'), type: "facility_name" },
  ];

  return (
    <DashboardContainer>
      {labels.map((item) => (
        <ChartRow key={item.type}>
          <ChartCard>
            <LineChart
              title={`${item.title} ${t('monitoring.performanceData')}`}
              type={item.type}
            />
          </ChartCard>
          <ChartCard>
            <DoughnutChart
              title={`${item.title} ${t('monitoring.dailyPerformanceData')}`}
              type={item.type}
            />
          </ChartCard>
        </ChartRow>
      ))}
    </DashboardContainer>
  );
};

export default PerformanceMonitoring;


// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChartRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChartCard = styled.div`
  width: 48%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
`;