import ReactApexChart, { Props as ChartProps } from 'react-apexcharts'

const TimelineChart = ({
  series,
  height = 200,
  min,
  max
}: {
  series: ChartProps['series'],
  // categories: any[]
  height?: number,
  min?: number,
  max?: number
}) => {

  // const s = series?.map((item) => {
  //   return {
  //     name: item?.name as string,
  //     type: 'rangeBar',
  //     data: item?.data as any[]
  //   }
  // })

  return (
    <div className="w-full">
      <ReactApexChart
        series={series}
        type="rangeBar"
        height={height}
        width={'100%'}
        options={{
          chart: {
            // height: 450,
            type: 'rangeBar',
            // type: 'line',
          },
          plotOptions: {
            bar: {
              horizontal: true,
              // barHeight: '80%'
            }
          },
          xaxis: {
            type: 'datetime',
            min: min,
            max: max,
            // tickAmount: 1000,
          },
          yaxis: [{
            title: {
              text: ''
            }
          },
          // {
          //   opposite: true,
          //   title: {
          //     text: 'Line Series'
          //   }}
          ],
          stroke: {
            width: 1
          },
          fill: {
            type: 'solid',
            opacity: 0.6
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left'
          },

        }}
      />
    </div>
  )
}

export default TimelineChart
