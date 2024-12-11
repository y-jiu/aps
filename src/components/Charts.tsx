import styled from 'styled-components'
import ColumnChart from './charts/ColumnChart'
import GaugeChart from './charts/GaugeChart'
import LineChart from './charts/LineChart'
import PieChart from './charts/PieChart'

// Function to generate a list of random integers
const generateRandomList = (
  length: number,
  minVal: number,
  maxVal: number
): number[] => {
  return Array.from(
    { length },
    () => Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
  )
}

const generateSequentialList = (maxVal: number): number[] => {
  return Array.from({ length: maxVal + 1 }, (_, index) => index)
}

const Container = styled.div`
  margin-top: 0.75rem; // mt-3
`

const TopSection = styled.div`
  height: 250px; // h-[250px]
  display: flex;
  align-items: center;
  margin-top: 0.75rem; // mt-3
`

const HalfSection = styled.div`
  height: 100%;
  width: 50%; // w-1/2
  display: flex;
  align-items: center;
`
const HalfHeightSection = styled.div`
  width: 50%; // w-1/2
`

const ThirdColumn = styled.div`
  width: 33.333333%; // w-1/3
`

const HalfHeight = styled.div`
  height: 50%; // h-1/2
  display: flex;
`

const BottomSection = styled.div`
  margin-top: 0.75rem; // mt-3
  width: 100%; // w-full
  align-items: center;
`

const Charts = () => {
  const utilizationSeries = [100]
  const machineOccupancySeries = [35, 83]
  const occupancySeries = [66, 34]

  const availabilityGaugeSeries = [92.8]
  const performanceGaugeSeries = [81.8]
  const qualityGaugeSeries = [96.1]

  const availabilityBarSeries = [{ data: [1407.8, 1408.0] }]
  const performanceBarSeries = [{ data: [161, 161] }]
  const qualityBarSeries = [{ data: [161, 0] }]

  const loadSeries = [
    { name: '전류', data: generateRandomList(165, 0, 10) },
    { name: '부하', data: generateRandomList(165, 0, 10) }
  ]

  const loadCategories = generateSequentialList(164)

  return (
    <Container>
      <TopSection>
        <HalfSection>
          <ThirdColumn>
            <PieChart
              series={utilizationSeries}
              labels={['점유율']}
              title="점유율"
            />
          </ThirdColumn>
          <ThirdColumn>
            <PieChart
              series={machineOccupancySeries}
              labels={['가동', '비가동']}
              title="장비 가동률"
            />
          </ThirdColumn>
          <ThirdColumn>
            <PieChart
              series={occupancySeries}
              labels={['가공 가동', '비가공 가동']}
              title="가공 가동률"
            />
          </ThirdColumn>
        </HalfSection>
        <HalfHeightSection>
          <HalfHeight>
            <ThirdColumn>
              <GaugeChart
                series={availabilityGaugeSeries}
                label="가용성 (Availability)"
              />
            </ThirdColumn>
            <ThirdColumn>
              <GaugeChart
                series={performanceGaugeSeries}
                label="성능 (Performance)"
              />
            </ThirdColumn>
            <ThirdColumn>
              <GaugeChart series={qualityGaugeSeries} label="품질 (Quality)" />
            </ThirdColumn>
          </HalfHeight>
          <HalfHeight>
            <ThirdColumn>
              <ColumnChart
                series={availabilityBarSeries}
                labels={['가공시간', '계획가공시간']}
              />
            </ThirdColumn>
            <ThirdColumn>
              <ColumnChart
                series={performanceBarSeries}
                labels={['생산수량', '계획수량']}
              />
            </ThirdColumn>
            <ThirdColumn>
              <ColumnChart
                series={qualityBarSeries}
                labels={['양품', '불량품']}
              />
            </ThirdColumn>
          </HalfHeight>
        </HalfHeightSection>
      </TopSection>
      <BottomSection>
        <LineChart series={loadSeries} categories={loadCategories} />
      </BottomSection>
    </Container>
  )
}

export default Charts
