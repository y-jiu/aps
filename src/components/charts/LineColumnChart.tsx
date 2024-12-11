import ReactApexChart, { Props as ChartProps } from 'react-apexcharts'

const LineChart = ({
  series,
  categories,
  height = 200,
  // min,
  // max
}: {
  series: ChartProps['series']
  categories: any[]
  height?: number
  // min?: number
  // max?: number
}) => {
  return (
    <div className="w-full">
      <ReactApexChart
        series={series}
        // type="line"
        height={height}
        width={'100%'}
        options={{
          chart: {
            height,
            type: 'line',
            toolbar: {
              show: false
            }
          },
          dataLabels: {
            enabled: false
          },
          // legend: {
          //   show: true,
          //   position: 'bottom',
          //   horizontalAlign: 'right',
          //   offsetY: -5,
          //   floating: true,
          //   markers: {}
          // },
          stroke: {
            curve: 'straight',
            width: 2,
            show : true
          },
          xaxis: {
            // labels: {
            //   style: {
            //     // colors: 'gray',
            //     fontSize: '12px'
            //   }
            // },
            tickAmount: 15,
            // stepSize: 5,
            categories: categories,
            // min,
            // max
          },
          yaxis: [{
            title: {
              text: 'Tooling Series',
            },
            max: 1,
            min: 0,
            tickAmount: 1,
            show: false
          }, {
            opposite: true,
            title: {
              text: 'Limit Series'
            },
            max: 100,
            min: 0,
            tickAmount: 1,
            show: false
          }]
        }}
      />
    </div>
  )
}

export default LineChart
