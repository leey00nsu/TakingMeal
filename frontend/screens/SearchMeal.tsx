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
import Feather from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import { MyDiet, MyDiets, setMealInfo } from "../redux/reducers/myDietReducer";
import { TextInput } from "react-native-gesture-handler";
import axios from "axios";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SearchMeal: FunctionComponent<{ jumpTo: any }> = ({ jumpTo }) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState("");
  const [resultList, setResultList] = useState([]);

  //검색 버튼을 누르면 실행됩니다.
  const onSearch = () => {
    if (search == "") {
      setResultList([]);
    } else {
      axios
        .get("http://10.0.2.2:8080/food/search?foodName=" + search)
        .then((response) => {
          // console.log(response.data[0]);
          let tempList: any = [];
          response.data.map((value: any, index: any) => {
            if (index < 10) {
              tempList.push(value);
            }
          });
          setResultList(tempList);
        })
        .catch((error) => {
          console.log(error);
          setResultList([]);
        });
    }
  };

  const setMeal = (value: any) => {
    //console.log(value["mealCarbon"].toFixed(1));
    dispatch(
      setMealInfo({
        foodName: value["mealName"],
        cal: value["mealCal"].toFixed(1),
        carbohydrate: value["mealCarbon"].toFixed(1),
        protein: value["mealProtein"].toFixed(1),
        fat: value["mealFat"].toFixed(1),
        amount: value["mealAmount"],
        serving: 1,
        status: 1,
      })
    );
  };

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

  //console.log(resultList.current.length);

  const FoodList = () => {
    return (
      <>
        {resultList.map((value: any, index: number) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setMeal(value);
              jumpTo("addMeal");
            }}
            key={index}
          >
            <View style={styles.searchList}>
              <View style={{ width: "60%" }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.foodName}
                >
                  {value["mealName"]}
                </Text>
                <Text style={styles.foodServing}>
                  1인분 ({value["mealAmount"]}g)
                </Text>
              </View>
              <View style={{ width: "10%" }}>
                <View style={styles.addButton}>
                  <AntDesign name="plus" color="white" size={20} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </>
    );
  };

  return (
    <View style={{ backgroundColor: "#f2f2f2" }}>
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <View style={styles.backButton}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                clearMeal();
                jumpTo("second");
              }}
            >
              <FontAwesomeIcon5 name="arrow-left" color="white" size={40} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>음식추가</Text>
          <View style={{ width: SCREEN_HEIGHT / 15 }}></View>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchBar}
            placeholder="오늘 어떤 음식을 드셨나요?"
            value={search}
            onSubmitEditing={() => onSearch()}
            onChangeText={(text) => {
              setSearch(text);
            }}
          />
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              onSearch();
            }}
          >
            <View style={styles.searchButton}>
              <Feather name="search" color="white" size={30} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.listBox}>
          {resultList.length == 0 ? (
            <View style={styles.searchIndex}>
              <FontAwesomeIcon
                name="cutlery"
                color="#DCDCDC"
                size={60}
                style={{ marginBottom: 15 }}
              />
              <Text style={styles.indexText}>먹은 음식을 찾아볼까?</Text>
            </View>
          ) : (
            <FoodList />
          )}
        </View>
      </ScrollView>
    </View>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f2f2f2",
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    minHeight: (SCREEN_HEIGHT / 10) * 7.5,
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
  searchBox: {
    width: "100%",
    height: SCREEN_HEIGHT / 15,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "#D9D9D9",
    borderWidth: 0.5,
  },
  searchBar: {
    width: "100%",
    paddingHorizontal: 10,
    fontFamily: "LeferiBaseRegular",
  },
  searchButton: {
    height: SCREEN_HEIGHT / 15,
    aspectRatio: 1 / 1, // 정사각형
    backgroundColor: "#45c1b0",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -SCREEN_HEIGHT / 15,
  },

  listBox: {
    width: "100%",
    minHeight: (SCREEN_HEIGHT / 10) * 7.5,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 10,
  },

  searchIndex: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  indexText: {
    fontSize: 20,
    color: "#A4A4A4",
    fontFamily: "LeferiBaseRegular",
  },
  searchList: {
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D6D6D6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  addButton: {
    width: 30,
    height: 30,
    backgroundColor: "#D6D6D6",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  foodName: {
    fontSize: 16,
    fontFamily: "LeferiBaseRegular",
    color: "#2A2A2A",
    marginBottom: 5,
  },
  foodServing: {
    fontSize: 12,
    fontFamily: "LeferiBaseRegular",
    color: "#A4A4A4",
  },
});
export default SearchMeal;
