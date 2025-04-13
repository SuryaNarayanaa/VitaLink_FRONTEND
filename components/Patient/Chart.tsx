import { View, Text, TouchableOpacity, Animated  } from 'react-native'
import React from 'react'
import { BarChart,barDataItem } from "react-native-gifted-charts";

let initialBarData:barDataItem[] = [
  { value: 8, label: 'MAR' },
  { value: 11, label: 'MAY' },
  { value: 9, label: 'AUG' },
  { value: 10, label: 'JAN' },
];

interface ChartProps {
    title:string,
    chartData:Record<string, number>
}


const getChartDesign = (initialBarData:barDataItem[]):barDataItem[] => {
  return initialBarData.map((item:barDataItem) => {
  return {
    ...item,
  frontColor: '#00bcd4',
  sideColor: '#008c9e', 
  topColor: '#00bcd4',
  showGradient: true,
  gradientColor: 'rgba(0, 188, 212, 0.3)',
  barWidth: 30,
  spacing: 20,
  barBorderTopLeftRadius: 6,
  barBorderTopRightRadius: 6,
  capThickness: 2,
  capColor: '#007BFF',
  capRadius: 2,
  topLabelComponent: () => (
    <View
      style={{
        backgroundColor: 'transparent',
        padding: 4,
      }}
    >
      <Text className='text-slate-800 text-sm'>{item.value}</Text>
    </View>
  ),
  };
})
}

const transformChartData = (data: Record<string, number>): barDataItem[] => {
  return Object.entries(data).map(([label, value]) => ({
    label,
    value,
  }));
};


const Chart:React.FC<ChartProps> = ({title,chartData}) => {
  const initialbardata = transformChartData(chartData)
  const barData = getChartDesign(initialbardata);
  return (
    <View className='items-center'>
      {/* Legend */}
      <View className='flex flex-row items-center mb-2 gap-x-2'>
        <TouchableOpacity className='w-11 h-5 border-2 border-[#17a3d6d5] bg-blue-300 mr-2 rounded-sm relative'/>
        <Text className='font-semibold text-[16px]'>{title}</Text>
      </View>
      <View className='flex flex-row items-center my-2 justify-start w-full'>
      <BarChart
        data={barData}
        frontColor="#93c5f0"
        gradientColor="rgba(0, 188, 212, 0.2)" 
        noOfSections={4}
        initialSpacing={30}
        spacing={20}
        xAxisColor="#ccc"
        yAxisColor={"#ccc"}
        yAxisThickness={1}
        isAnimated
        animationDuration={3000}
        isThreeD={false}
      /></View>
    </View>
  )
}

export default Chart