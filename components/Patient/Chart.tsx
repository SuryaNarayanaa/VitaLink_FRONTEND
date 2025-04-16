import { View, Text, TouchableOpacity, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import React, { useState, useRef } from 'react';
import { BarChart, barDataItem } from 'react-native-gifted-charts';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ChartProps {
  title: string;
  chartData: Record<string, number>;
}

interface PopoverProps {
  value: number;
  label: string;
  position: { x: number; y: number };
  visible: boolean;
}

const Popover: React.FC<PopoverProps> = ({ value, label, position, visible }) => {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: withSpring(visible ? 1 : 0.8) }]
  }));

  return (
    <Animated.View
      style={[{
        position: 'absolute',
        left: position.x - 50,
        top: position.y - 70,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 8,
        borderRadius: 8,
        width: 100,
        alignItems: 'center',
      }, animatedStyle]}
    >
      <Text style={{ color: 'white', fontWeight: '600' }}>{label}</Text>
      <Text style={{ color: 'white' }}>{value.toFixed(1)}</Text>
    </Animated.View>
  );
};

const getChartDesign = (
  initialBarData: barDataItem[],
  onBarPress: (item: barDataItem, index: number) => void
): barDataItem[] => {
  return initialBarData.map((item, index) => ({
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
    onPress: () => onBarPress(item, index),
    topLabelComponent: () => (
      <View style={{ backgroundColor: 'transparent', padding: 4 }}>
        <Text style={{ color: '#1a1a1a', fontSize: 14 }}>{item.value}</Text>
      </View>
    ),
  }));
};

const transformChartData = (data: Record<string, number>): barDataItem[] => {
  return Object.entries(data)
    .sort(([a], [b]) => {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return months.indexOf(a) - months.indexOf(b);
    })
    .map(([label, value]) => ({
      label,
      value: parseFloat(value.toFixed(0)),
    }));
};

const Chart: React.FC<ChartProps> = ({ title, chartData }) => {
  const [selectedBar, setSelectedBar] = useState<PopoverProps | null>(null);
  const [hideData, setHideData] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const initialBarData = hideData ? [] : transformChartData(chartData);

  const chunkedData: barDataItem[][] = [];
  for (let i = 0; i < initialBarData.length; i += 3) {
    chunkedData.push(initialBarData.slice(i, i + 3));
  }

  const handleBarPress = (item: barDataItem, index: number) => {
    setSelectedBar(prev => {
      if (prev?.label === item.label) {
        return null;
      }
      return {
        value: item.value!,
        label: item.label!,
        position: {
          x: (index % 3) * 100 + 80,
          y: 200 - (item.value! * 4),
        },
        visible: true,
      };
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(page);
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <TouchableOpacity
            onPress={() => setHideData(prev => !prev)}
            style={{
              width: 44,
              height: 20,
              borderWidth: 2,
              borderColor: '#17a3d6d5',
              backgroundColor: '#93c5f0',
              marginRight: 8,
              borderRadius: 4,
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {hideData && (
              <View
                style={{
                  position: 'absolute',
                  width: 2,
                  height: 24,
                  backgroundColor: 'red',
                  transform: [{ rotate: '45deg' }]
                }}
              />
            )}
          </TouchableOpacity>
          <Text style={{ fontWeight: '600', fontSize: 16 }}>{title}</Text>
        </View>

        {chunkedData.length === 0 ? (
          <Text style={{ marginTop: 40, color: '#aaa' }}>No data available</Text>
        ) : (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollRef}
            style={{ width, height: 250 }}
          >
            {chunkedData.map((chunk, pageIndex) => (
              <View key={pageIndex} style={{ width, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 1, position: 'relative' }}>
                  <BarChart
                    data={getChartDesign(chunk, handleBarPress)}
                    frontColor="#93c5f0"
                    gradientColor="rgba(0, 188, 212, 0.2)"
                    noOfSections={4}
                    initialSpacing={20}
                    spacing={30}
                    xAxisColor="#ccc"
                    yAxisColor="#ccc"
                    yAxisThickness={1}
                    isAnimated
                    animationDuration={1000}
                    isThreeD={false}
                  />
                  {selectedBar && <Popover {...selectedBar} />}
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {chunkedData.length > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            {chunkedData.map((_, index) => (
              <View
                key={index}
                style={{
                  width: index === currentPage ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: index === currentPage ? '#00bcd4' : '#ccc',
                }}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default Chart;
