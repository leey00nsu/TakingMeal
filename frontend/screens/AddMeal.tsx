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
} from "react-native";
import FontAwesomeIcon5 from "react-native-vector-icons/FontAwesome5";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MeterialIcon from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MyDiet, MyDiets, setMealInfo } from "../redux/reducers/myDietReducer";
import Toast from "@zellosoft.com/react-native-toast-message";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const AddMeal: FunctionComponent<{ jumpTo: any }> = ({ jumpTo }) => {
  const myDiet = useSelector((state: MyDiets) => state.myDiets);
  const user = useSelector((store: Store) => {
    return store.user;
  });
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("mealInfo");
  const [getRatio, setGetRatio] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [count, setCount] = useState(0);

  const addMeal = () => {
    if (count != 0) {
      axios
        .post("http://172.30.1.43:8080/food/register/" + user.userId, {
          mealName: myDiet[filter][0].foodName,
          mealAmount: myDiet[filter][0].amount,
          mealCal: nutrition[0]["value"],
          mealCarbon: nutrition[1]["value"],
          mealProtein: nutrition[2]["value"],
          mealFat: nutrition[3]["value"],
        })
        .then((response) => {
          // console.log(response.data);
          showToast();
          clearMeal();
          setCount(0);
          jumpTo("second");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    if (myDiet[filter][0].foodName != "") {
      setCount(1);
    }
  }, [myDiet]);

  useEffect(() => {
    // 영양소 정리
    // 정리된 영양소를 차트형식에 맞게 바꿈
    let tempMealInfo = myDiet[filter][0];
    let tempNutrition: any = [
      {
        nutrition: "칼로리",
        value: tempMealInfo.cal * count,
        avg: user.avgCal,
      },
      {
        nutrition: "탄수화물",
        value: tempMealInfo.carbohydrate * count,
        avg: user.avgCarbon,
      },
      {
        nutrition: "단백질",
        value: tempMealInfo.protein * count,
        avg: user.avgProtein,
      },
      { nutrition: "지방", value: tempMealInfo.fat * count, avg: user.avgFat },
    ];
    setNutrition(tempNutrition);
    // 비율을 구합니다.
    let tempRatio = tempNutrition.map((nutrition: any) => {
      let color = nutrition.value > nutrition.avg ? "#ffc163" : "#5AC9BC"; // 칼로리가 초과되면 차트를 빨간색으로 표시합니다.
      let bgcolor = nutrition.value > nutrition.avg ? "#ef9a85" : "#dfdfdf"; // 칼로리가 초과되면 차트배경을 주황색으로 표시합니다.
      let value =
        nutrition.value > nutrition.avg ? nutrition.value : nutrition.value;
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
        gapvalue: 100 - ratio,
        maxvalue: 100, // 최대비율 (100%)
        avg: nutrition.avg, // 평균 영양소 값
        color: color, // 값의 차트 색깔
        bgcolor: bgcolor, // 값의 차트 배경 색깔
        status: status,
      };
    });
    setGetRatio(tempRatio);
  }, [count]);

  const clearMeal = () => {
    dispatch(
      setMealInfo({
        foodName: "",
        cal: 0,
        carbohydrate: 0,
        protein: 0,
        fat: 0,
        serving: 0,
        status: 0,
      })
    );
  };

  // 차트를 그린다
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

  // Toast 메세지
  const showToast = () => {
    Toast.show({
      type: "success",
      message: "식단을 추가하였습니다!",
      visibilityTime: 2000,
      autoHide: true,
      showLoadingIcon: true,
      onPress: () => {
        Toast.hide();
      },
    });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <View style={styles.backButton}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setCount(0);
                jumpTo("searchMeal");
              }}
            >
              <FontAwesomeIcon5 name="arrow-left" color="white" size={40} />
            </TouchableOpacity>
          </View>
          <View style={{ width: "60%", alignItems: "center" }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.headerText}
            >
              {myDiet[filter][0].foodName}
            </Text>
          </View>

          <View style={{ width: SCREEN_HEIGHT / 15 }}></View>
        </View>

        <View style={styles.calBox}>
          <View style={styles.upcalBox}>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={styles.countText}>{count} </Text>
              <Text style={styles.servingText}>(인분)</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  if (count > 1) {
                    setCount(count - 1);
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
                  setCount(count + 1);
                }}
              >
                <View style={styles.plusButton}>
                  <AntDesign name="plus" color="white" size={25} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              alignSelf: "center",
              width: SCREEN_WIDTH - 40,
              height: 7,
              backgroundColor: "#F6F6F6",
            }}
          ></View>
          <View style={styles.downcalBox}>
            <View style={styles.calStack}>
              <Text style={styles.downcalText}>1인분 당 영양성분</Text>
              <Text style={styles.downcalSubText}>
                (1인분 {myDiet[filter][0].amount}g)
              </Text>
            </View>

            <View style={styles.calStack}>
              <View style={styles.calGap}>
                <Text style={styles.downcalSubText}>칼로리</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.downcalNumText}>
                    {myDiet[filter][0].cal}
                  </Text>
                  <Text style={styles.downcalSubText}>kcal</Text>
                </View>
              </View>
              <View style={styles.calGap}>
                <Text style={styles.downcalSubText}>탄수화물</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.downcalNumText}>
                    {myDiet[filter][0].carbohydrate}
                  </Text>
                  <Text style={styles.downcalSubText}>g</Text>
                </View>
              </View>
            </View>

            <View style={styles.calStack}>
              <View style={styles.calGap}>
                <Text style={styles.downcalSubText}>단백질</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.downcalNumText}>
                    {myDiet[filter][0].protein}
                  </Text>
                  <Text style={styles.downcalSubText}>g</Text>
                </View>
              </View>
              <View style={styles.calGap}>
                <Text style={styles.downcalSubText}>지방</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.downcalNumText}>
                    {myDiet[filter][0].fat}
                  </Text>
                  <Text style={styles.downcalSubText}>g</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.chartBox}>
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <Text style={styles.chartText}>1일 권장량 대비 </Text>
            <Text style={styles.chartSubText}>음식 영양소</Text>
          </View>
          <View style={styles.borderLine}></View>
          <View style={styles.calChart}>
            {getRatio.length == 0 ? "" : <ShowChart />}
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            addMeal();
          }}
          style={{
            marginTop: "auto",
            marginBottom: SCREEN_HEIGHT / 25,
          }}
        >
          <View style={styles.addBox}>
            <Text style={styles.addText}>등록하기</Text>
          </View>
        </TouchableOpacity>
      </View>
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
    height: SCREEN_HEIGHT,
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
  calBox: {
    width: "100%",
    height: (SCREEN_HEIGHT / 10) * 3.3,
    backgroundColor: "white",
    justifyContent: "space-between",
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    ...shadow,
  },
  upcalBox: {
    width: "100%",
    flexDirection: "row",
    height: "40%",
    alignItems: "center",
    justifyContent: "space-between",
    //backgroundColor: "black",
    //paddingVertical: 0,
  },
  countText: {
    fontSize: 36,
    color: "#2A2A2A",
    fontFamily: "LeferiBaseBold",
  },
  servingText: {
    fontSize: 16,
    color: "#A4A4A4",
    fontFamily: "LeferiBaseRegular",
  },
  downcalBox: {
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "space-evenly",
    //paddingVertical: 0,
    //backgroundColor: "black",
  },
  downcalText: {
    fontSize: 14,
    color: "#2A2A2A",
    fontFamily: "LeferiBaseRegular",
  },
  downcalSubText: {
    fontSize: 12,
    color: "#A4A4A4",
    fontFamily: "LeferiBaseRegular",
  },
  downcalNumText: {
    fontSize: 12,
    color: "#2A2A2A",
    fontFamily: "LeferiBaseRegular",
  },
  calStack: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calGap: {
    width: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartBox: {
    width: "100%",
    height: (SCREEN_HEIGHT / 10) * 3.3,
    backgroundColor: "white",
    justifyContent: "space-between",
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 40,
    ...shadow,
  },
  chartText: {
    fontSize: 16,
    color: "#2A2A2A",
    fontFamily: "LeferiBaseRegular",
  },
  chartSubText: {
    fontSize: 16,
    color: "#A4A4A4",
    fontFamily: "LeferiBaseRegular",
  },
  calChart: {
    height: (SCREEN_HEIGHT / 10) * 2,
    alignItems: "center",
    justifyContent: "space-evenly",
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
  borderLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
    marginVertical: 10,
    alignItems: "center",
  },
  addBox: {
    width: "100%",
    height: (SCREEN_HEIGHT / 10) * 0.7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5AC9BC",
    borderRadius: 15,
    marginVertical: 10,
  },
  addText: {
    fontSize: 16,
    color: "white",
    fontFamily: "LeferiBaseRegular",
  },
  plusButton: {
    width: 40,
    height: 40,
    backgroundColor: "#FFC063",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
});
export default AddMeal;
