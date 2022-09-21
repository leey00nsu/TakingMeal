import React, { useState, useEffect, FunctionComponent, useMemo } from 'react'
import {
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
import Toast from 'react-native-toast-message'

//핸드폰 크기 가져오기
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const MyPage: FunctionComponent<{ jumpTo: any }> = ({ jumpTo }) => {
  const myDiet = useSelector((store: Store) => {
    return store.myDiets
  })
  const [filter, setFilter] = useState('dietList')
  const [dietList, setDietList] = useState(myDiet[filter])
  const [dateFilter, setDateFileter] = useState(6)
  const [isExpanded, setExpanded] = useState(false) // 리스트 열려있음 구분
  const [dates, setDates] = useState([]) // 날짜 정보를 가지고 있습니다.
  const [nutrition, setNutrition] = useState([])
  const [getRatio, setGetRatio] = useState([])
  const [foodList, setFoodList] = useState([])
  const [cal, setCal] = useState(0)

  //console.log(dietList[6-dateFilter].meals[0]);
  //console.log(dietList[0].meals[0].breakfast);

  useEffect(() => {
    // 영양소 정리
    let temp_cal = 0
    let temp_carbohydrate = 0
    let temp_protein = 0
    let temp_fat = 0
    const tempFoodList: any = []
    // 해당 객체가 존재하면 식단에서 영양을 더합니다. 그리고 음식 리스트를 배열에 추가합니다.
    if (JSON.stringify(dietList[6 - dateFilter].meals[0].breakfast) !== '{}') {
      let breakfast = dietList[6 - dateFilter].meals[0].breakfast
      temp_cal += breakfast.cal * breakfast.serving
      temp_carbohydrate += breakfast.carbohydrate * breakfast.serving
      temp_protein += breakfast.protein * breakfast.serving
      temp_fat += breakfast.fat * breakfast.serving
      tempFoodList.push({
        foodName: breakfast.foodName,
        serving: breakfast.serving,
      })
    }
    if (JSON.stringify(dietList[6 - dateFilter].meals[0].lunch) !== '{}') {
      let lunch = dietList[6 - dateFilter].meals[0].lunch
      temp_cal += lunch.cal * lunch.serving
      temp_carbohydrate += lunch.carbohydrate * lunch.serving
      temp_protein += lunch.protein * lunch.serving
      temp_fat += lunch.fat * lunch.serving
      tempFoodList.push({
        foodName: lunch.foodName,
        serving: lunch.serving,
      })
    }
    if (JSON.stringify(dietList[6 - dateFilter].meals[0].dinner) !== '{}') {
      let dinner = dietList[6 - dateFilter].meals[0].dinner
      temp_cal += dinner.cal * dinner.serving
      temp_carbohydrate += dinner.carbohydrate * dinner.serving
      temp_protein += dinner.protein * dinner.serving
      temp_fat += dinner.fat * dinner.serving
      tempFoodList.push({
        foodName: dinner.foodName,
        serving: dinner.serving,
      })
    }
    setFoodList(tempFoodList)
    // 정리된 영양소를 차트형식에 맞게 바꿈
    let tempNutrition: any = [
      { nutrition: '지방', value: temp_fat, avg: 700 },
      { nutrition: '단백질', value: temp_protein, avg: 600 },
      { nutrition: '탄수화물', value: temp_carbohydrate, avg: 500 },
      { nutrition: '칼로리', value: temp_cal, avg: 2000 },
    ]
    setNutrition(tempNutrition)
    setCal(temp_cal)

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
    let today = new Date()
    let week = new Array('일', '월', '화', '수', '목', '금', '토')
    let tmpDate: any = []
    for (let i = 0; i < 7; i++) {
      let todaydate = new Date(today.setDate(today.getDate()))
      let showdate = String(todaydate.getDate()).padStart(2, '0')
      let showmonth = String(todaydate.getMonth() + 1).padStart(2, '0')
      let showday = todaydate.getDay()
      tmpDate.push({
        month: showmonth,
        date: showdate,
        day: week[showday],
      })
      today.setDate(today.getDate() - 1)
    }
    // 순서를 역방향으로 바꾼다
    tmpDate.reverse()
    setDates(tmpDate)
  }, [dateFilter])

  // 차트를 그린다
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
  const showChart = useMemo(() => {
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
              cornerRadius={{
                top: 10,
                bottom: 10,
              }}
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
  }, [nutrition])
  // 차트 컴포넌트
  const ShowChart = () => {
    return showChart
  }

  // 날짜 목록을 표시합니다.
  const DateList = () => {
    return (
      <View style={styles.dateBox}>
        {dates.map((value: any, index: number) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              console.log('click!' + index)
              setDateFileter(index)
            }}
            key={index}
          >
            <View style={{ justifyContent: 'space-between' }}>
              <View
                style={
                  dateFilter == index
                    ? styles.checkedDateListBox
                    : styles.dateListBox
                }
              >
                <Text
                  style={
                    dateFilter == index
                      ? styles.checkedDateListDate
                      : styles.dateListDate
                  }
                >
                  {value['date']}
                </Text>
                <Text
                  style={
                    dateFilter == index
                      ? styles.checkedDateListDay
                      : styles.dateListDay
                  }
                >
                  {value['day']}
                </Text>
              </View>
              {dateFilter == index ? (
                <View style={{ alignItems: 'center' }}>
                  <View style={styles.checkedDot}></View>
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <View style={{ height: 6 }}></View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  // 음식 목록을 표시합니다.
  const FoodList = () => {
    return (
      <View>
        {foodList.map((value: any, index: number) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              showToast()
            }}
            key={index}
          >
            <View style={styles.foodListBox}>
              <Text style={styles.foodNameText}>{value['foodName']}</Text>
              <Text style={styles.foodServingText}>{value['serving']}인분</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  // Toast 메세지
  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: '식단을 삭제하였습니다.',
    })
  }
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerBox}>
          <View style={styles.backButton}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                jumpTo('first')
              }}
            >
              <FontAwesomeIcon name="arrow-left" color="white" size={40} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>마이페이지</Text>
          <View style={{ width: SCREEN_HEIGHT / 15 }}></View>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            jumpTo('myInformation')
          }}
        >
          <View style={styles.userBox}>
            <View style={styles.userIcon}>
              <FontAwesomeIcon5 name="user-alt" color="white" size={30} />
              <View style={styles.userBadge}>
                <FontAwesomeIcon5 name="pen-nib" color="white" size={15} />
              </View>
            </View>

            <View>
              <Text style={styles.userTextName}>홍길동님,</Text>
              <Text style={styles.userText}>오늘 김밥은 어떠세요?</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View>
          <DateList />
        </View>

        <View style={styles.calBox}>
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Text style={styles.dateText}>
                🗓{dates.length == 0 ? '' : dates[dateFilter]['month']}월
                {dates.length == 0 ? '' : dates[dateFilter]['date']}일
              </Text>
              <Text style={styles.calSubText}>의 섭취칼로리는</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
              }}
            >
              <Text style={styles.calText}>{cal}</Text>
              <Text style={styles.calSubText}>kcal입니다.</Text>
            </View>
          </View>
          <View style={styles.borderLine}></View>
          <View style={styles.calChart}>
            <ShowChart />
          </View>
          {isExpanded ? (
            <View style={styles.foodBox}>
              {/* <Text>펼쳤을때 보일 내용 </Text> */}
              <FoodList />
              {foodList.length == 3 ? (
                <View style={styles.disfoodAddBox}>
                  <Text style={styles.foodAddText}>음식 추가하기</Text>
                  <AntDesign name="plus" color="white" size={20} />
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    jumpTo('searchMeal')
                  }}
                >
                  <View style={styles.foodAddBox}>
                    <Text style={styles.foodAddText}>음식 추가하기</Text>
                    <AntDesign name="plus" color="white" size={20} />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            ''
          )}
        </View>
        {/* Expanded 부분 */}
        <View style={{ alignItems: 'center' }}>
          <View style={styles.expandButton}>
            <TouchableOpacity
              activeOpacity={0.2}
              onPress={() => {
                setExpanded(!isExpanded)
              }}
            >
              <MeterialIcon
                name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                color="gray"
                size={50}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    minHeight: SCREEN_HEIGHT,
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
  userBox: {
    width: '100%',
    height: SCREEN_HEIGHT / 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    marginVertical: 10,
    ...shadow,
  },
  userIcon: {
    height: SCREEN_HEIGHT / 15,
    aspectRatio: 1 / 1, // 정사각형
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D6D6D6',
    marginRight: 20,
    borderRadius: 15,
  },
  userBadge: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 15,
    bottom: SCREEN_HEIGHT / 15 - 16,
    left: SCREEN_HEIGHT / 15 - 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5AC9BC',
  },
  userTextName: {
    fontSize: 20,
    fontFamily: 'LeferiBaseBold',
    color: '#2A2A2A',
  },
  userText: {
    fontSize: 15,
    fontFamily: 'LeferiBaseRegular',
    color: '#2A2A2A',
  },
  dateBox: {
    width: '100%',
    height: SCREEN_HEIGHT / 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  dateListBox: {
    height: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  checkedDateListBox: {
    height: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#5AC9BC',
  },
  dateListDate: {
    fontSize: 24,
    fontFamily: 'LeferiBaseRegular',
    color: '#2A2A2A',
  },
  checkedDateListDate: {
    fontSize: 24,
    fontFamily: 'LeferiBaseRegular',
    color: 'white',
  },
  dateListDay: {
    fontSize: 12,
    fontFamily: 'LeferiBaseRegular',
    color: '#2A2A2A',
  },
  checkedDateListDay: {
    fontSize: 12,
    fontFamily: 'LeferiBaseRegular',
    color: 'white',
  },
  checkedDot: {
    width: 6,
    height: 6,
    backgroundColor: '#5AC9BC',
    borderRadius: 8,
  },
  calBox: {
    width: '100%',
    minheight: (SCREEN_HEIGHT / 10) * 4,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 30,
    ...shadow,
  },
  borderLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    alignItems: 'center',
  },
  calChart: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //backgroundColor: "gray",
  },

  dateText: {
    fontSize: 15,
    fontFamily: 'LeferiBaseRegular',
    color: '#2A2A2A',
  },
  calText: {
    fontFamily: 'LeferiBaseBold',
    fontSize: 40,
    color: '#5AC9BC',
  },
  calSubText: {
    fontSize: 15,
    fontFamily: 'LeferiBaseRegular',
    color: '#A4A4A4',
  },
  expandButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -35,
    ...shadow,
  },
  foodBox: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingBottom: 10,
  },
  foodListBox: {
    width: 300,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,

    borderRadius: 25,
    marginVertical: 5,
  },
  foodNameText: {
    fontSize: 16,
    fontFamily: 'LeferiBaseRegular',
    color: '#2A2A2A',
  },
  foodServingText: {
    fontSize: 12,
    fontFamily: 'LeferiBaseRegular',
    color: '#A4A4A4',
  },
  foodAddBox: {
    width: 300,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5AC9BC',
    paddingHorizontal: 15,
    borderRadius: 25,
    marginVertical: 5,
  },
  disfoodAddBox: {
    width: 300,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DFDFDF',
    paddingHorizontal: 15,
    borderRadius: 25,
    marginVertical: 5,
  },
  foodAddText: {
    fontSize: 20,
    fontFamily: 'LeferiBaseRegular',
    color: 'white',
    marginRight: 5,
  },
})
export default MyPage
