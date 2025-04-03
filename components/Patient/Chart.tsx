import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { BarChart, } from 'react-native-chart-kit';

interface ChartProps {
  title: string;
  chartData: Record<string, number>; 
}

const chartConfig = {
    backgroundGradientFrom: "#a7b9ff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fab7c5",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 1,
    useShadowColorFromDataset: false,
    propsForBackgroundLines: {
      stroke: "rgba(0,0,0,0.2)",
      strokeWidth: 0.5,
      strokeDasharray: "0",
    },
};

const transformChartData = (chartData: Record<string, number>) => {
  return {
    labels: Object.keys(chartData), 
    datasets: [{ data: Object.values(chartData) }], 
  };
};


const Chart:React.FC<ChartProps> = ({title, chartData}) => {
  const chart_data = transformChartData(chartData);
  return (
    <View className='my-2 mx-5 items-center'>
      <View>
        <TouchableOpacity></TouchableOpacity>
        <Text className='text-xl font-semibold text-black tracking-wider'>{title}</Text>
      </View>
      
      <BarChart
        style={styles.chart}
        data={chart_data}
        width={Dimensions.get('window').width * 0.75} height={250}
        yAxisLabel="" yAxisSuffix="" fromZero={true} withInnerLines={true}
        chartConfig={chartConfig}
        />
    </View>
  )
}


const styles = StyleSheet.create({
    chart: {
        marginVertical: 8,
        marginHorizontal: 20,
        borderRadius:6,
        backgroundColor:'transparent'
    }
})
export default Chart