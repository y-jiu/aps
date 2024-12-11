import ReactApexChart, { Props as ChartProps } from 'react-apexcharts'

const RadarChart = ({
  series,
  categories,
  height = 350
}:
{
  series: ChartProps['series']
  categories: any[]
  height?: number
}) => {

  return (
    <div>
      <ReactApexChart options={{
        chart: {
          type: 'radar',
        },
        title: {
          text: '',
        },
        yaxis: {
          show: false,
        },
        xaxis: {
          categories: categories,
        },
        legend: {
          offsetX: -60,
          offsetY: -30,
        },
      }} series={series} type="radar" height={height} />
    </div>
  )
}

export default RadarChart
