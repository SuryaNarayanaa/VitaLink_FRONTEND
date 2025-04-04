import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
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
  const [showChart,setShowShart] = useState<boolean>(true)
  const chart_data = showChart? transformChartData(chartData) : transformChartData({});
  return (
    <View className='my-2 mx-5 items-center'>
      <View className='flex flex-row items-center justify-center gap-x-2'>
        <TouchableOpacity  style={styles.toggleButton}
        onPress={() => setShowShart(prev => !prev)}>
          {!showChart && <View style={styles.crossLine} />}
        </TouchableOpacity>
        <Text className='text-[16px] font-primarySemibold text-black'>{title}</Text>
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
  container: {
    marginVertical: 8,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  toggleButton: {
    width: 40,
    height: 18,
    borderWidth: 2,
    borderColor: '#00AEEF',
    backgroundColor:'light-blue',
    marginRight: 8,
    borderRadius: 3,
    position: 'relative',
  },
  crossLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: '100%',
    height: 2,
    backgroundColor: 'red',
    transform: [{ translateY: -1 }, { rotate: '45deg' }],
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  chart: {
    marginTop: 8,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
});
export default Chart