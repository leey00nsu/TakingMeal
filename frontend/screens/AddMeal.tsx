import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  FunctionComponent,
  useMemo,
} from 'react'
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from 'react-native'
import FontAwesomeIcon5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MeterialIcon from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux'
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
  VictoryStack,
  VictoryContainer,
} from 'victory-native'
import { MyDiet, MyDiets } from '../redux/reducers/myDietReducer'
import Toast from 'react-native-toast-message'
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const AddMeal: FunctionComponent<{ jumpTo: any }> = ({ jumpTo }) => {
  const myDiet = useSelector((state: MyDiets) => state.myDiets)
  const [filter, setFilter] = useState('mealInfo')
  const [mealInfo, setMealInfo] = useState(myDiet[filter][0])
  const [getRatio, setGetRatio] = useState([])
  const [nutrition, setNutrition] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    setMealInfo(myDiet[filter][0])
  }, [myDiet])
  useEffect(() => {
    if (mealInfo.foodName != '') {
      setCount(1)
    }
  }, [mealInfo])
  useEffect(() => {
    // 영양소 정리
    // 정리된 영양소를 차트형식에 맞게 바꿈
    let tempMealInfo = myDiet[filter][0]
    let tempNutrition: any = [
      { nutrition: '지방', value: tempMealInfo.fat * count, avg: 700 },
      { nutrition: '단백질', value: tempMealInfo.protein * count, avg: 600 },
      {
        nutrition: '탄수화물',
        value: tempMealInfo.carbohydrate * count,
        avg: 500,
      },
      { nutrition: '칼로리', value: tempMealInfo.cal * count, avg: 2000 },
    ]
    setNutrition(tempNutrition)
    // 비율을 구합니다.
    let tempRatio = tempNutrition.map((nutrition: any) => {
      let color = nutrition.value > nutrition.avg ? '#ffc163' : '#5AC9BC' // 칼로리가 초과되면 차트를 빨간색으로 표시합니다.
      let bgcolor = nutrition.value > nutrition.avg ? '#ef9a85' : '#dfdfdf' // 칼로리가 초과되면 차트배경을 주황색으로 표시합니다.
      let value =
        nutrition.value > nutrition.avg ? nutrition.value : nutrition.value
      let status = nutrition.value > nutrition.avg ? 'over' : 'normal'
      let ratio = Math.abs(
        nutrition.value > nutrition.avg
          ? (nutrition.avg / nutrition.value) * 100
          : (nutrition.value / nutrition.avg) * 100
      )
      return {
        nutrition: nutrition.nutrition, // 영양소 이름
        value: value, // 그래프에 표시될 값
        ratio: ratio, //비율
        maxvalue: 100, // 최대비율 (100%)
        avg: nutrition.avg, // 평균 영양소 값
        color: color, // 값의 차트 색깔
        bgcolor: bgcolor, // 값의 차트 배경 색깔
        status: status,
      }
    })
    setGetRatio(tempRatio)

    // 오늘로부터 일주일간의 날짜와 요일을 구합니다.
  }, [count])

  // 해당 Bar의 중간 지점으로 라벨을 그립니다.
  const CenteredLabel = (props: any) => {
    const { datum, scale } = props
    let color = ''
    let centerPos = scale.y(datum._y)
    // 칼로리가 초과했다면
    if (datum.status == 'over') {
      centerPos = scale.y(datum.maxvalue - 10) // 그래프 끝에 그림
      color = 'white'
    } else {
      if (datum.ratio > 10) {
        // 값이 텍스트를 포함할만큼의 크기이면
        centerPos = scale.y(datum._y - 10) // 값의 끝에 그림
        color = 'white'
      } else {
        // 값이 텍스트보다 작으면
        centerPos = scale.y(10) // 그래프 처음에 그림
        color = 'white'
      }
    }
    const style = {
      fill: color,
      textAnchor: 'middle',
      fontFamily: 'LeferiBaseRegular',
      fontSize: 10,
    }
    // note that because your chart is horizontal,
    // the y value that you calculate informsthe x position of the label
    return <VictoryLabel {...props} x={centerPos} style={style} dx={0} />
  }

  // 차트를 그린다 (useMemo 사용했지만 속도향상 X)
  const showChart = useMemo(() => {
    const data = [
      { quarter: 1, earnings: 13000 },
      { quarter: 2, earnings: 16500 },
      { quarter: 3, earnings: 14250 },
      { quarter: 4, earnings: 19000 },
    ]
    return (
      <VictoryChart
        height={180}
        width={300}
        domainPadding={40}
        padding={{ left: 60, right: 10, top: 0, bottom: 0 }}
        horizontal
      >
        <VictoryAxis
          tickValues={['지방', '단백질', '탄수화물', '칼로리']}
          tickFormat={(value) => {
            return value
          }}
          style={{
            axis: { stroke: 'transparent' },

            //ticks: { stroke: "transparent" },
            tickLabels: {
              textAnchor: 'start',
              fontSize: 13,
              padding: 60,
              fontFamily: ({ tick }: any) =>
                tick == '칼로리' ? 'LeferiBaseBold' : 'LeferiBaseRegular',
              fill: '#2A2A2A',
            },
          }}
        />
        <VictoryGroup>
          <VictoryGroup color="#dfdfdf">
            <VictoryBar
              style={{
                data: {
                  fill: ({ datum }) => datum.bgcolor,
                },
                labels: {
                  fontFamily: 'LeferiBaseRegular',
                  fontSize: 10,
                  fill: '#A4A4A4',
                },
              }}
              labels={({ datum }) => `${datum.avg}`}
              cornerRadius={{ top: 10, bottom: 10 }}
              barWidth={20}
              data={getRatio}
              x="nutrition"
              y="maxvalue"
            />
          </VictoryGroup>
        </VictoryGroup>
        <VictoryGroup>
          <VictoryGroup color="#45c1b0">
            <VictoryBar
              barWidth={20}
              labels={({ datum }) => `${datum.value}`}
              style={{
                data: { fill: ({ datum }) => datum.color },
              }}
              labelComponent={<CenteredLabel />}
              //verticalAnchor={"middle"}
              cornerRadius={{
                top: ({ datum }) => (datum.ratio >= 97 ? 0.1 * datum.ratio : 0),
                bottom: 10,
              }}
              data={getRatio}
              x="nutrition"
              y="ratio"
            />
          </VictoryGroup>
        </VictoryGroup>
      </VictoryChart>
    )
  }, [getRatio])
  // 차트 컴포넌트
  const ShowChart = () => {
    return showChart
  }

  // Toast 메세지
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: '식단을 추가하였습니다!',
    })
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <View style={styles.backButton}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setCount(0)
                jumpTo('searchMeal')
              }}
            >
              <FontAwesomeIcon name="arrow-left" color="white" size={40} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>{mealInfo.foodName}</Text>
          <View style={{ width: SCREEN_HEIGHT / 15 }}></View>
        </View>

        <View style={styles.calBox}>
          <View style={styles.upcalBox}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.countText}>{count} </Text>
              <Text style={styles.servingText}>(인분)</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  if (count > 1) {
                    setCount(count - 1)
                  }
                }}
              >
                <View style={styles.plusButton}>
                  <AntDesign name="minus" color="white" size={25} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  setCount(count + 1)
                }}
              >
                <View style={styles.plusButton}>
                  <AntDesign name="plus" color="white" size={25} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.downcalBox}>
            <View style={styles.calStack}>
              <Text style={styles.downcalText}>1인분 당 영양성분</Text>
              <Text style={styles.downcalSubText}>(1인분 150g)</Text>
            </View>

            <View style={styles.calStack}>
              <View style={styles.calGap}>
                <Text style={styles.downcalSubText}>칼로리</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.downcalNumText}>{mealInfo.cal}</Text>
                  <Text style={styles.downcalSubText}>kcal</Text>
                </View>
              </View>
              <View style={styles.calGap}>
                <Text style={styles.downcalSubText}>탄수화물</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.downcalNumText}>
                    {mealInfo.carbohydrate}
                  </Text>
                  <Text style={styles.downcalSubText}>g</Text>
                </View>
              </View>
            </View>

            <View style={styles.calStack}>
              <View style={styles.calGap}>
                <Text style={styles.downcalSubText}>단백질</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.downcalNumText}>{mealInfo.protein}</Text>
                  <Text style={styles.downcalSubText}>g</Text>
                </View>
              </View>
              <View style={styles.calGap}>
                <Text style={styles.downcalSubText}>지방</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.downcalNumText}>{mealInfo.fat}</Text>
                  <Text style={styles.downcalSubText}>g</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.chartBox}>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <Text style={styles.chartText}>1일 권장량 대비 </Text>
            <Text style={styles.chartSubText}>음식 영양소</Text>
          </View>
          <View style={styles.borderLine}></View>
          <View style={styles.calChart}>
            <ShowChart />
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            showToast()
            jumpTo('second')
          }}
        >
          <View style={styles.addBox}>
            <Text style={styles.addText}>등록하기</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
}

const shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 5,
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f2f2f2',
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: SCREEN_HEIGHT / 10,
  },
  headerText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'LeferiBaseRegular',
  },
  backButton: {
    height: SCREEN_HEIGHT / 15,
    aspectRatio: 1 / 1, // 정사각형
    backgroundColor: '#ffc163',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calBox: {
    width: '100%',
    height: (SCREEN_HEIGHT / 10) * 3.3,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    ...shadow,
  },
  upcalBox: {
    width: '100%',
    flexDirection: 'row',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  countText: {
    fontSize: 36,
    color: '#2A2A2A',
    fontFamily: 'LeferiBaseBold',
  },
  servingText: {
    fontSize: 16,
    color: '#A4A4A4',
    fontFamily: 'LeferiBaseRegular',
  },
  downcalBox: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    // backgroundColor: "black",
  },
  downcalText: {
    fontSize: 14,
    color: '#2A2A2A',
    fontFamily: 'LeferiBaseRegular',
  },
  downcalSubText: {
    fontSize: 12,
    color: '#A4A4A4',
    fontFamily: 'LeferiBaseRegular',
  },
  downcalNumText: {
    fontSize: 12,
    color: '#2A2A2A',
    fontFamily: 'LeferiBaseRegular',
  },
  calStack: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calGap: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartBox: {
    width: '100%',
    height: (SCREEN_HEIGHT / 10) * 3.3,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 30,
    ...shadow,
  },
  chartText: {
    fontSize: 16,
    color: '#2A2A2A',
    fontFamily: 'LeferiBaseRegular',
  },
  chartSubText: {
    fontSize: 16,
    color: '#A4A4A4',
    fontFamily: 'LeferiBaseRegular',
  },
  calChart: {
    alignItems: 'center',
  },
  borderLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    alignItems: 'center',
  },
  addBox: {
    width: '100%',
    height: (SCREEN_HEIGHT / 10) * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5AC9BC',
    borderRadius: 15,
    marginVertical: 10,
  },
  addText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'LeferiBaseRegular',
  },
  plusButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFC063',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
})
export default AddMeal
