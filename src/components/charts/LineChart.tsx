import ReactApexChart, { Props as ChartProps } from 'react-apexcharts'

const LineChart = ({
  series,
  categories,
  type,
  height = 200,
  threshold = false
}: {
  series: ChartProps['series']
  categories: any[]
  type?: 'category' | 'datetime' | 'numeric'
  height?: number | string
  threshold?: boolean
}) => {
  return (
    <div className="w-full">
      <ReactApexChart
        series={series}
        type="line"
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
            width: 1
          },
          xaxis: {
            labels: {
              datetimeFormatter: {
                year: 'yyyy년',
                month: 'MM월',
                day: 'dd일',
                hour: 'HH시'
              }
            },
            tickAmount: 30,
            // stepSize: 5,
            categories: categories,
            type: type ? type : 'category'
          },
          yaxis: {
            labels: {
              formatter(val) {
                if (typeof val === 'number' && val >= 1000) {
                  const exponent = Math.floor(Math.log10(val))
                  const base = val / Math.pow(10, exponent)
                  return base.toFixed(1) + 'E' + exponent
                }
                return val.toString()
              }
            }
          },
          annotations: {
            yaxis: threshold
              ? [
                  {
                    y: 0.3,
                    borderWidth: 3,
                    borderColor: '#FF0000',
                    label: {
                      borderColor: '#FF4560',
                      style: {
                        color: '#fff',
                        background: '#FF4560'
                      },
                      text: 'Threshold 1'
                    }
                  },
                  {
                    y: 0.5,
                    borderWidth: 3,
                    borderColor: '#FF0000',
                    label: {
                      borderColor: '#FF4560',
                      style: {
                        color: '#fff',
                        background: '#FF4560'
                      },
                      text: 'Threshold 2'
                    }
                  }
                ]
              : []
          }
        }}
      />
    </div>
  )
}

export default LineChart
