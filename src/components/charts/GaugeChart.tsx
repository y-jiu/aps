import ReactApexChart, { Props as ChartProps } from 'react-apexcharts'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.h1`
  text-align: center;
  font-size: 0.75rem; /* equivalent to text-xs */
`

const GaugeChart = ({
  series,
  label
}: {
  series: ChartProps['series']
  label: string
}) => {
  return (
    <Container>
      <ReactApexChart
        options={{
          series: series,
          chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
              enabled: true
            }
          },
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
              track: {
                background: '#e7e7e7',
                strokeWidth: '97%',
                margin: 5, // margin is in pixels
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 0,
                  color: '#999',
                  opacity: 1,
                  blur: 2
                }
              },
              dataLabels: {
                name: {
                  show: false
                },
                value: {
                  offsetY: -2,
                  fontSize: '22px'
                }
              }
            }
          },
          grid: {
            padding: {
              top: -10
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              shadeIntensity: 0.4,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 50, 53, 91]
            }
          },
          title: {
            text: '',
            align: 'center',
            style: {
              fontSize: '0px'
            }
          },
          labels: [label]
        }}
        series={series}
        type="radialBar"
        height={350}
      />
      <div>
        <Label>{label}</Label>
      </div>
    </Container>
  )
}

export default GaugeChart
