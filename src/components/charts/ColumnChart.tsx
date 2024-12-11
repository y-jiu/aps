import ReactApexChart, { Props as ChartProps } from 'react-apexcharts'

const ColumnChart = ({
  series,
  labels,
  height = 150,
  isStacked = false
}: {
  series: ChartProps['series']
  labels: any[]
  height?: number
  isStacked?: boolean
}) => {
  return (
    <div className="w-full">
      <ReactApexChart
        series={series}
        height={height}
        width={'100%'}
        type="bar"
        options={{
          chart: {
            type: 'bar',
            toolbar: {
              show: false
            },
            stacked: isStacked
          },
          plotOptions: {
            bar: {
              columnWidth: '45%',
              distributed: !isStacked
            }
          },
          dataLabels: {
            enabled: true
          },
          legend: {
            show: isStacked,
            position: 'right',
            offsetY: 0
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '12px'
              }
            },
            categories: labels
          }
        }}
      />
    </div>
  )
}

export default ColumnChart
