import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  FunctionComponent,
  useMemo,
} from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import FontAwesomeIcon5 from "react-native-vector-icons/FontAwesome5";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MeterialIcon from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import { WithLocalSvg } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import {
  MyDiet,
  MyDiets,
  setMealInfo,
  setMyDiets,
} from "../redux/reducers/myDietReducer";

//핸드폰 크기 가져오기
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const MyPage: FunctionComponent<{ jumpTo: any }> = ({ jumpTo }) => {
  const dispatch = useDispatch();
  const myDiet = useSelector((store: Store) => {
    return store.myDiets;
  });
  const user = useSelector((store: Store) => {
    return store.user;
  });
  const [filter, setFilter] = useState("dietList");
  const [dietList, setDietList] = useState(myDiet[filter]);
  const [dateFilter, setDateFilter] = useState(6);
  const [isExpanded, setExpanded] = useState(false); // 리스트 열려있음 구분
  const [dates, setDates] = useState([]); // 날짜 정보를 가지고 있습니다.
  const [nutrition, setNutrition] = useState([]);
  const [getRatio, setGetRatio] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [cal, setCal] = useState(0);
  //console.log(dietList[6-dateFilter].meals[0]);
  //console.log(dietList[0].meals[0].breakfast);

  // axios
  //   .get("http://10.0.2.2:8080/food/info/yoonsu3/22")
  //   //.get("http://10.0.2.2:8080/food/info/yoonsu/21")
  //   .then((response) => {
  //     console.log(response.data);
  //   });

  // 식단 추가 후 리렌더링 함수
  useEffect(() => {
    //console.log("filter useEffect");
    //console.log(myDiet["mealInfo"][0].foodName);
    if (dateFilter == 7 && myDiet["mealInfo"][0].status == 0) {
      //console.log("setDateFilter");
      setDateFilter(6);
    }
  }, [myDiet]);

  // 영양소를 불러와 차트 포맷에 맞게 업데이트합니다
  // 날짜를 받아옵니다.
  useEffect(() => {
    //console.log("render in");
    if (dateFilter != 7) {
      const now = new Date(); // 현재 날짜 및 시간
      const date = now.getDate() - (6 - dateFilter);
      //console.log(user.userId);
      //console.log(date);
      //console.log("render access");

      axios
        .get("http://10.0.2.2:8080/food/info/" + user.userId + "/" + date)
        //.get("http://10.0.2.2:8080/food/info/yoonsu/21")
        .then((response) => {
          //console.log(response.data);
          dispatch(
            setMyDiets({
              foods: response.data["foods"],
              cal: response.data["cal"],
              carbon: response.data["carbon"],
              protein: response.data["protein"],
              fat: response.data["fat"],
              amount: response.data["amount"],
              dateFilter: dateFilter,
              // serving: response.data["carbon"],
            })
          );
          setFoodList(response.data["foods"]);
          //console.log("setfoodlist");

          let tempNutrition: any = [
            {
              nutrition: "칼로리",
              value: response.data["cal"],
              avg: user.avgCal,
            },
            {
              nutrition: "탄수화물",
              value: response.data["carbon"],
              avg: user.avgCarbon,
            },
            {
              nutrition: "단백질",
              value: response.data["protein"],
              avg: user.avgProtein,
            },
            {
              nutrition: "지방",
              value: response.data["fat"],
              avg: user.avgFat,
            },
          ];
          setNutrition(tempNutrition);
          setCal(response.data["cal"].toFixed(1));

          // 비율을 구합니다.
          let tempRatio = tempNutrition.map((nutrition: any) => {
            let color = nutrition.value > nutrition.avg ? "#ffc163" : "#5AC9BC"; // 칼로리가 초과되면 차트를 빨간색으로 표시합니다.
            let bgcolor =
              nutrition.value > nutrition.avg ? "#ef9a85" : "#dfdfdf"; // 칼로리가 초과되면 차트배경을 주황색으로 표시합니다.
            let value =
              nutrition.value > nutrition.avg
                ? nutrition.value
                : nutrition.value;
            let status = nutrition.value > nutrition.avg ? "over" : "normal";
            let ratio = Math.abs(
              nutrition.value > nutrition.avg
                ? (nutrition.avg / nutrition.value) * 100
                : (nutrition.value / nutrition.avg) * 100
            );
            return {
              nutrition: nutrition.nutrition, // 영양소 이름
              value: value.toFixed(1), // 그래프에 표시될 값
              ratio: ratio, //비율
              maxvalue: 100, // 최대비율 (100%)
              gapvalue: 100 - ratio,
              avg: nutrition.avg, // 평균 영양소 값
              color: color, // 값의 차트 색깔
              bgcolor: bgcolor, // 값의 차트 배경 색깔
              status: status,
            };
          });
          setGetRatio(tempRatio);
        })
        .catch((error) => {
          console.log(error);

          let tempNutrition: any = [
            {
              nutrition: "칼로리",
              value: 0,
              avg: user.avgCal,
            },
            {
              nutrition: "탄수화물",
              value: 0,
              avg: user.avgCarbon,
            },
            {
              nutrition: "단백질",
              value: 0,
              avg: user.avgProtein,
            },
            { nutrition: "지방", value: 0, avg: user.avgFat },
          ];
          setNutrition(tempNutrition);
          setFoodList([]);
          setCal(0);

          // 비율을 구합니다.
          let tempRatio = tempNutrition.map((nutrition: any) => {
            let color = nutrition.value > nutrition.avg ? "#ffc163" : "#5AC9BC"; // 칼로리가 초과되면 차트를 빨간색으로 표시합니다.
            let bgcolor =
              nutrition.value > nutrition.avg ? "#ef9a85" : "#dfdfdf"; // 칼로리가 초과되면 차트배경을 주황색으로 표시합니다.
            let value =
              nutrition.value > nutrition.avg
                ? nutrition.value
                : nutrition.value;
            let status = nutrition.value > nutrition.avg ? "over" : "normal";
            let ratio = Math.abs(
              nutrition.value > nutrition.avg
                ? (nutrition.avg / nutrition.value) * 100
                : (nutrition.value / nutrition.avg) * 100
            );
            return {
              nutrition: nutrition.nutrition, // 영양소 이름
              value: value.toFixed(1), // 그래프에 표시될 값
              ratio: ratio, //비율
              maxvalue: 100, // 최대비율 (100%)
              gapvalue: 100 - ratio,
              avg: nutrition.avg, // 평균 영양소 값
              color: color, // 값의 차트 색깔
              bgcolor: bgcolor, // 값의 차트 배경 색깔
              status: status,
            };
          });
          setGetRatio(tempRatio);
        });
    }

    // 오늘로부터 일주일간의 날짜와 요일을 구합니다.
    let today = new Date();
    let week = new Array("일", "월", "화", "수", "목", "금", "토");
    let tmpDate: any = [];
    for (let i = 0; i < 7; i++) {
      let todaydate = new Date(today.setDate(today.getDate()));
      let showdate = String(todaydate.getDate()).padStart(2, "0");
      let showmonth = String(todaydate.getMonth() + 1).padStart(2, "0");
      let showday = todaydate.getDay();
      tmpDate.push({
        month: showmonth,
        date: showdate,
        day: week[showday],
      });
      today.setDate(today.getDate() - 1);
    }
    // 순서를 역방향으로 바꾼다
    tmpDate.reverse();
    setDates(tmpDate);
  }, [dateFilter, user]);

  //차트를 그립니다.
  const ShowChart = () => {
    return (
      <View
        style={{
          height: "100%",
          justifyContent: "space-evenly",
        }}
      >
        {getRatio.map((value: any, index: number) => (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              marginHorizontal: 5,
              alignItems: "center",
              justifyContent: "space-between",
            }}
            key={index}
          >
            {value["status"] == "normal" ? (
              <View
                style={{
                  position: "absolute",
                  left: "20%",
                  zIndex: 1,
                }}
              >
                <Text style={styles.nutritionValueText}>{value["value"]}</Text>
              </View>
            ) : (
              <View
                style={{
                  position: "absolute",
                  right: "18%",
                  zIndex: 1,
                  alignContent: "flex-end",
                }}
              >
                <Text style={styles.nutritionValueText}>{value["value"]}</Text>
              </View>
            )}

            <View
              style={{
                width: "16%",
                alignItems: "flex-start",
              }}
            >
              <Text
                style={
                  value["nutrition"] == "칼로리"
                    ? styles.nutritionBoldText
                    : styles.nutritionText
                }
              >
                {value["nutrition"]}
              </Text>
            </View>

            <View
              style={{
                width: "70%",
                flexDirection: "row",
                borderRadius: 50,
                backgroundColor: value["color"],
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: value["ratio"] + "%",
                  height: 20,
                  backgroundColor: value["color"],
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              ></View>
              <View
                style={{
                  width: value["gapvalue"] + "%",
                  height: 20,
                  backgroundColor: value["bgcolor"],
                  justifyContent: "center",
                }}
              ></View>
            </View>
            <View
              style={{
                width: "10%",
                alignItems: "flex-start",
                // backgroundColor: "black",
              }}
            >
              <Text style={styles.nutritionAvgText}>{value["avg"]}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // 날짜 목록을 표시합니다.
  const DateList = () => {
    return (
      <View style={styles.dateBox}>
        {dates.map((value: any, index: number) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              //console.log("click!" + index);
              setDateFilter(index);
            }}
            key={index}
          >
            <View
              style={{
                justifyContent: "space-between",
                width: SCREEN_WIDTH / 11,
              }}
            >
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
                  {value["date"]}
                </Text>
                <Text
                  style={
                    dateFilter == index
                      ? styles.checkedDateListDay
                      : styles.dateListDay
                  }
                >
                  {value["day"]}
                </Text>
              </View>
              {dateFilter == index ? (
                <View style={{ alignItems: "center" }}>
                  <View style={styles.checkedDot}></View>
                </View>
              ) : (
                <View style={{ alignItems: "center" }}>
                  <View style={{ height: 6 }}></View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // 음식 목록을 표시합니다.
  const FoodList = () => {
    return (
      <View style={{ width: "90%" }}>
        {foodList.map((value: any, index: number) => (
          <View style={styles.foodListBox} key={index}>
            <View style={styles.foodBoxCircle}></View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.foodNameText}
            >
              {value}
            </Text>
            {/* <Text style={styles.foodServingText}>{value["serving"]}인분</Text> */}
          </View>
        ))}
        {dateFilter == 6 ? (
          foodList.length > 10 ? (
            <View style={styles.disfoodAddBox}>
              <View style={styles.foodAddBoxCircle}></View>
              <Text style={styles.foodAddText}>음식 추가하기</Text>
              <AntDesign name="plus" color="white" size={20} />
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setDateFilter(7);
                setMeal();
                jumpTo("searchMeal");
              }}
            >
              <View style={styles.foodAddBox}>
                <View style={styles.foodAddBoxCircle}></View>
                <Text style={styles.foodAddText}>음식 추가하기</Text>
                <AntDesign name="plus" color="white" size={20} />
              </View>
            </TouchableOpacity>
          )
        ) : (
          ""
        )}
      </View>
    );
  };

  const setMeal = () => {
    dispatch(
      setMealInfo({
        foodName: "",
        cal: 0,
        carbohydrate: 0,
        protein: 0,
        fat: 0,
        serving: 0,
        status: 1,
      })
    );
  };
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerBox}>
          <View style={styles.backButton}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                jumpTo("first");
              }}
            >
              <FontAwesomeIcon5 name="arrow-left" color="white" size={40} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>나의 정보</Text>
          <View style={{ width: SCREEN_HEIGHT / 15 }}></View>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            jumpTo("myInformation");
          }}
          style={styles.userBox}
        >
          <View style={styles.userIcon}>
            {user.userAge == "초등학교" ? (
              <Image
                style={{
                  width: "70%",
                  height: "70%",
                  resizeMode: "contain",
                }}
                source={require("../img/low-user.png")}
              />
            ) : user.userAge == "중학교" ? (
              <Image
                style={{
                  width: "70%",
                  height: "70%",
                  resizeMode: "contain",
                }}
                source={require("../img/mid-user.png")}
              />
            ) : (
              <Image
                style={{
                  width: "70%",
                  height: "70%",
                  resizeMode: "contain",
                }}
                source={require("../img/high-user.png")}
              />
            )}

            {/* <FontAwesomeIcon5 name="user-alt" color="white" size={30} /> */}
            <View style={styles.userBadge}>
              <FontAwesomeIcon5 name="pen-nib" color="white" size={15} />
            </View>
          </View>

          <View
            style={{
              justifyContent: "space-evenly",
              height: SCREEN_HEIGHT / 15,
            }}
          >
            <Text style={styles.userTextName}>{user.userId}님,</Text>
            <Text style={styles.userText}>오늘 먹은 식단을 기록해보세요.</Text>
          </View>
        </TouchableOpacity>

        <View>
          <DateList />
        </View>

        <View style={styles.calBox}>
          <View>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <Text style={styles.dateText}>
                🗓
                {dates.length == 0 || dateFilter == 7
                  ? ""
                  : dates[dateFilter]["month"]}
                월
                {dates.length == 0 || dateFilter == 7
                  ? ""
                  : dates[dateFilter]["date"]}
                일
              </Text>
              <Text style={styles.calSubText}>의 섭취칼로리는</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
              }}
            >
              <Text style={styles.calText}>{cal}</Text>
              <Text style={styles.calSubText}>kcal입니다.</Text>
            </View>
          </View>
          <View style={styles.borderLine}></View>
          <View style={styles.calChart}>
            {getRatio.length == 0 ? "" : <ShowChart />}
          </View>
          {/* 펼쳤을 때 보이는 내용 */}
          {foodList.length > 0 || dateFilter == 6 ? (
            isExpanded ? (
              <View
                style={{
                  alignSelf: "center",
                  width: SCREEN_WIDTH - 40,
                  height: 7,
                  backgroundColor: "#F6F6F6",
                  marginVertical: 20,
                }}
              ></View>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {isExpanded ? (
            <View style={styles.foodBox}>
              {foodList.length > 0 ? (
                <View style={styles.foodBoxLine}>
                  <View style={styles.foodBoxLineLine}></View>
                </View>
              ) : (
                <View></View>
              )}

              <FoodList />
            </View>
          ) : (
            ""
          )}
        </View>

        {/* Expanded 부분 */}
        <View style={{ alignItems: "center" }}>
          <View style={styles.expandButton}>
            <TouchableOpacity
              activeOpacity={0.2}
              onPress={() => {
                setExpanded(!isExpanded);
              }}
            >
              <MeterialIcon
                name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                color="gray"
                size={50}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 5,
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    minHeight: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f2f2f2",
  },
  headerBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: SCREEN_HEIGHT / 10,
  },
  headerText: {
    fontSize: 16,
    color: "black",
    fontFamily: "LeferiBaseRegular",
  },
  backButton: {
    height: SCREEN_HEIGHT / 15,
    aspectRatio: 1 / 1, // 정사각형
    backgroundColor: "#ffc163",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  userBox: {
    width: "100%",
    height: SCREEN_HEIGHT / 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 25,
    marginVertical: 10,
    ...shadow,
  },
  userIcon: {
    height: SCREEN_HEIGHT / 15,
    aspectRatio: 1 / 1, // 정사각형
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D6D6D6",
    marginRight: 20,
    borderRadius: 15,
  },
  userBadge: {
    position: "absolute",
    width: 25,
    height: 25,
    borderRadius: 15,
    bottom: SCREEN_HEIGHT / 15 - 16,
    left: SCREEN_HEIGHT / 15 - 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5AC9BC",
  },
  userTextName: {
    fontSize: 18,
    fontFamily: "LeferiBaseBold",
    color: "#2A2A2A",
  },
  userText: {
    fontSize: 14,
    fontFamily: "LeferiBaseRegular",
    color: "#2A2A2A",
  },
  dateBox: {
    width: "100%",
    height: SCREEN_HEIGHT / 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  dateListBox: {
    width: "100%",
    height: "85%",
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 10,
  },
  checkedDateListBox: {
    width: "100%",
    height: "85%",
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#5AC9BC",
  },
  dateListDate: {
    fontSize: 18,
    fontFamily: "LeferiBaseRegular",
    color: "#2A2A2A",
  },
  checkedDateListDate: {
    fontSize: 18,
    fontFamily: "LeferiBaseRegular",
    color: "white",
  },
  dateListDay: {
    fontSize: 12,
    fontFamily: "LeferiBaseRegular",
    color: "#2A2A2A",
  },
  checkedDateListDay: {
    fontSize: 12,
    fontFamily: "LeferiBaseRegular",
    color: "white",
  },
  checkedDot: {
    width: 6,
    height: 6,
    backgroundColor: "#5AC9BC",
    borderRadius: 8,
  },
  calBox: {
    width: "100%",
    minheight: (SCREEN_HEIGHT / 10) * 4,
    backgroundColor: "white",
    justifyContent: "space-between",
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 30,
    ...shadow,
  },
  borderLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
    marginVertical: 10,
    alignItems: "center",
  },
  calChart: {
    height: (SCREEN_HEIGHT / 10) * 2,
    alignItems: "center",
    justifyContent: "space-evenly",
    //backgroundColor: "gray",
  },
  nutritionText: {
    fontSize: 12,
    fontFamily: "LeferiBaseRegular",
    color: "#2A2A2A",
  },
  nutritionBoldText: {
    fontSize: 12,
    fontFamily: "LeferiBaseBold",
    color: "#2A2A2A",
  },
  nutritionValueText: {
    fontSize: 10,
    fontFamily: "LeferiBaseRegular",
    color: "white",
  },
  nutritionAvgText: {
    fontSize: 10,
    fontFamily: "LeferiBaseRegular",
    color: "#A4A4A4",
  },
  dateText: {
    fontSize: 16,
    fontFamily: "LeferiBaseRegular",
    color: "#2A2A2A",
  },
  calText: {
    fontFamily: "LeferiBaseBold",
    fontSize: 36,
    color: "#5AC9BC",
  },
  calSubText: {
    fontSize: 16,
    fontFamily: "LeferiBaseRegular",
    color: "#A4A4A4",
  },
  expandButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -35,
    ...shadow,
  },
  foodBox: {
    flexDirection: "row",
    width: "100%",
    // backgroundColor: "black",
    borderColor: "black",
    alignItems: "center",
    justifyContent: "space-between",
    // marginVertical: 5,
  },
  foodBoxLine: {
    width: "5%",
    height: "100%",
    paddingVertical: SCREEN_HEIGHT / 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "bl",
  },
  foodBoxLineLine: {
    width: "50%",
    height: "100%",
    borderStyle: "dashed",
    borderRightWidth: 1,
    borderColor: "#5AC9BC",
  },
  foodBoxCircle: {
    position: "absolute",
    left: "-12.5%",
    width: 15,
    height: 15,
    borderRadius: 15,
    borderColor: "#5AC9BC",
    borderWidth: 3,
    backgroundColor: "white",
  },
  foodAddBoxCircle: {
    position: "absolute",
    left: "-12.5%",
    width: 15,
    height: 15,
    borderRadius: 15,
    borderColor: "#A4A4A4",
    borderWidth: 3,
    backgroundColor: "white",
  },
  foodListBox: {
    height: SCREEN_HEIGHT / 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 15,

    borderRadius: 25,
    marginVertical: 5,
  },
  foodNameText: {
    fontSize: 16,
    fontFamily: "LeferiBaseRegular",
    color: "#2A2A2A",
  },
  foodServingText: {
    fontSize: 12,
    fontFamily: "LeferiBaseRegular",
    color: "#A4A4A4",
  },
  foodAddBox: {
    height: SCREEN_HEIGHT / 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5AC9BC",

    paddingHorizontal: 15,
    borderRadius: 25,
    marginVertical: 5,
  },
  disfoodAddBox: {
    height: SCREEN_HEIGHT / 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D6D6D6",
    paddingHorizontal: 15,
    borderRadius: 25,
    marginVertical: 5,
  },
  foodAddText: {
    fontSize: 16,
    fontFamily: "LeferiBaseRegular",
    color: "white",
    marginRight: 5,
  },
});
export default MyPage;
