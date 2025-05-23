import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Svg, { G, Line, Rect, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedG = Animated.createAnimatedComponent(G);
const ITEMS_PER_PAGE = 3;

interface ChartProps {
  title: string;
  chartData: Record<string, number>;
  width?: number;
}

interface PopoverProps {
  value: number;
  label: string;
  position: { x: number; y: number };
  visible: boolean;
}

// ---- linear scale replacement ----
function scaleLinear() {
  let domain: [number, number] = [0, 1];
  let range: [number, number] = [0, 1];

  const fn = (value: number) => {
    const [d0, d1] = domain;
    const [r0, r1] = range;
    const t = d1 === d0 ? 0 : (value - d0) / (d1 - d0);
    return r0 + t * (r1 - r0);
  };
  fn.domain = (d: [number, number]) => { domain = d; return fn; };
  fn.range = (r: [number, number]) => { range = r; return fn; };
  fn.ticks = (count: number) => {
    const [d0, d1] = domain;
    if (count < 2) return [d0];
    const step = (d1 - d0) / (count - 1);
    return Array.from({ length: count }, (_, i) => d0 + step * i);
  };
  return fn as any;
}

// ---- band scale replacement ----
function scaleBand<T extends string>() {
  let domain: T[] = [];
  let range: [number, number] = [0, 1];
  let paddingInner = 0;
  let bandSize = 0, step = 0;

  function recalc() {
    const n = domain.length;
    const total = range[1] - range[0];
    if (n > 0) {
      bandSize = total / (n + paddingInner * (n - 1));
      step = bandSize * (1 + paddingInner);
    } else {
      bandSize = step = 0;
    }
  }

  const fn = (value: T) => {
    const idx = domain.indexOf(value);
    if (idx < 0) return undefined;
    return range[0] + idx * step;
  };
  fn.domain = (d: T[]) => { domain = d; recalc(); return fn; };
  fn.range = (r: [number, number]) => { range = r; recalc(); return fn; };
  fn.padding = (p: number) => { paddingInner = p; recalc(); return fn; };
  fn.bandwidth = () => bandSize;
  return fn as any;
}

// simple ticks generator if you want round numbers
const getYTicks = (max: number, count: number): number[] => {
  if (max <= 0) return [0];
  const step = max / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round(step * i));
};

const Popover: React.FC<PopoverProps> = ({ value, label, position, visible }) => {
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
  }, [visible]);

  const animatedProps = useAnimatedProps(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: position.x - 30,
          top: position.y - 30,
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: 8,
          borderRadius: 6,
          width: 100,
          alignItems: 'center',
        },
        // TypeScript workaround
        (animatedProps as any),
      ]}
    >
      <Text style={{ color: 'white', fontWeight: '600' }}>{label}</Text>
      <Text style={{ color: 'white' }}>{value.toFixed(1)}</Text>
    </Animated.View>
  );
};



export default function Chart({
  title,
  chartData,
  width = SCREEN_WIDTH * 0.8,
}: ChartProps) {
  const [hideData, setHideData] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedBar, setSelectedBar] = useState<PopoverProps | null>(null);
  const fade = useSharedValue(0);

  const [ready, setReady] = useState(false)

useEffect(() => {
  setReady(true)
  fade.value = withTiming(1, { duration: 500 })
}, [])



  const animatedProps = useAnimatedProps(() => ({
    opacity: fade.value || 1,
  }));

  

  // 1) sort + array
  const data = Object.entries(chartData)
    .sort(([a], [b]) => {
      const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      return months.indexOf(a) - months.indexOf(b);
    })
    .map(([day, value]) => ({ day, value }));

  // 2) margins + dims
  const M = { top: 10, right: 10, bottom: 30, left: 30 };
  const chartW = width - M.left - M.right;
  const chartH = 200;

  // 3) scales
  const xScale = scaleBand<string>()
    .domain(data.map(d => d.day))
    .range([0, chartW])
    .padding(0.2);

  const rawMax = Math.max(...data.map(d => d.value), 0);
  const maxVal = rawMax === 0 ? 1 : rawMax;
  const yScale = scaleLinear()
    .domain([0, maxVal])
    .range([chartH, 0]);

  // 4) chunk pages
  const pages: typeof data[] = [];
  for (let i = 0; i < data.length; i += ITEMS_PER_PAGE) {
    pages.push(data.slice(i, i + ITEMS_PER_PAGE));
  }

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentPage(page);
    setSelectedBar(null);
  };

  const handleBarPress = (d: { day: string; value: number }, i: number) => {
    const bx = xScale(d.day)! + xScale.bandwidth() / 2 + M.left + currentPage * width;
    const by = yScale(d.value) + M.top;
    setSelectedBar({ label: d.day, value: d.value, position: { x: bx, y: by }, visible: true });
  };


  return (
    <View style={{ width, alignSelf: 'center' }}>
      {/* header */}
      <View style={{ flexDirection:'row', justifyContent:'center', marginBottom:8 }}>
        <TouchableOpacity
          onPress={() => setHideData(h => !h)}
          style={{
            width:44, height:20,
            borderWidth:1, borderColor:'#0286FF',
            backgroundColor:'#93c5f0',
            marginRight:8, borderRadius:4,
            justifyContent:'center', alignItems:'center'
          }}
        >
          {hideData && (
            <View style={{
              position:'absolute', width:2, height:28,
              backgroundColor:'red', transform:[{ rotate:'45deg'}]
            }}/>
          )}
        </TouchableOpacity>
        <Text style={{ fontWeight:'600', fontSize:16 }}>{title}</Text>
      </View>

      {pages.length === 0 || hideData ? (
        <Text style={{ textAlign:'center', color:'#999', marginTop:40 }}>
          No data available
        </Text>
      ) : (
        <>
          <ScrollView
            horizontal pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ width, height: chartH + M.top + M.bottom }}
          >
            {pages.map((chunk, pi) => (
              <View
                key={pi}
                style={{ width, height: chartH + M.top + M.bottom, paddingRight: 10 }}
              >
                <Svg width={width} height={chartH + M.top + M.bottom}>
                  <G x={M.left} y={M.top}>
                    {/* Y‑axis line */}
                    <Line x1={0} y1={0} x2={0} y2={chartH} stroke="#999" strokeWidth={1} />

                    {/* Y‑grid + labels */}
                    {getYTicks(maxVal, 5).map((t, i) => {
                      const y = yScale(t);
                      return (
                        <G key={i}>
                          <Line x1={0} y1={y} x2={chartW} y2={y} stroke="#ddd" strokeWidth={1} />
                          <SvgText
                            x={-8}
                            y={y + 4}
                            fontSize={10}
                            fill="#666"
                            textAnchor="end"
                          >
                            {t}
                          </SvgText>
                        </G>
                      );
                    })}

                    {/* X‑axis line */}
                    <Line x1={0} y1={chartH} x2={chartW} y2={chartH} stroke="#999" strokeWidth={1} />

                    {/* Bars */}
                  {ready && <AnimatedG animatedProps={animatedProps}>
                      {chunk.map((d, i) => {
                        const bx = xScale(d.day)!;
                        const bw = xScale.bandwidth();
                        const by = yScale(d.value);
                        return (
                          <Rect
                            key={i}
                            x={bx}
                            y={by}
                            width={bw}
                            height={chartH - by}
                            fill="#0286FF"
                            onPress={() => handleBarPress(d, i)}  
                          />
                        );
                      })}
                    </AnimatedG>}

                    {/* X‑labels */}
                    {chunk.map((d, i) => {
                      const bx = xScale(d.day)!;
                      const bw = xScale.bandwidth();
                      return (
                        <SvgText
                          key={i}
                          x={bx + bw / 2}
                          y={chartH + 12}
                          fontSize={10}
                          fill="#333"
                          textAnchor="middle"
                        >
                          {d.day}
                        </SvgText>
                      );
                    })}
                  </G>
                </Svg>
              </View>
            ))}
          </ScrollView>

          {/* pagination dots */}
          <View style={{ flexDirection:'row', justifyContent:'center', marginTop:8 }}>
            {pages.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === currentPage ? 12 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === currentPage ? '#0286FF' : '#ccc',
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>

          {/* popover */}
          {selectedBar?.visible && <Popover {...selectedBar} />}
        </>
      )}
    </View>
  );
}
