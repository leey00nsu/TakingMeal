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
import Modal from "react-native-modal";
import FontAwesomeIcon5 from "react-native-vector-icons/FontAwesome5";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import MeterialIcon from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Foundation from "react-native-vector-icons/Foundation";
import { useDispatch, useSelector } from "react-redux";
import { MyDiet, MyDiets, setMealInfo } from "../redux/reducers/myDietReducer";
import { TextInput } from "react-native-gesture-handler";
import { WithLocalSvg } from "react-native-svg";
import Toast from "@zellosoft.com/react-native-toast-message";
import { setUser } from "../redux/reducers/userReducer";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MyInformation: FunctionComponent<{ jumpTo: any }> = ({ jumpTo }) => {
  const dispatch = useDispatch();
  const user = useSelector((store: Store) => {
    return store.user;
  });
  const [gender, setGender] = useState("남성");
  const [age, setAge] = useState("초등학교");

  // Toast 메세지
  const showToast = () => {
    Toast.show({
      type: "success",
      message: "정보를 수정하였습니다!",
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const setInformation = () => {
    dispatch(
      setUser({ userId: user.userId, userAge: age, userGender: gender })
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <View style={styles.backButton}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                jumpTo("second");
              }}
            >
              <FontAwesomeIcon5 name="arrow-left" color="white" size={40} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>정보수정</Text>
          <View style={{ width: SCREEN_HEIGHT / 15 }}></View>
        </View>

        <View style={styles.ageBox}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setAge("초등학교");
            }}
            style={styles.ageButton}
          >
            <View
              style={
                age == "초등학교"
                  ? [styles.ageImage, { borderColor: "#F67A5A" }]
                  : styles.ageImage
              }
            >
              <View style={styles.ageLow}>
                {age == "초등학교" ? (
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                    source={require("../img/low-icon.png")}
                  />
                ) : (
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                    source={require("../img/dis-low-icon.png")}
                  />
                )}
              </View>
            </View>
            <Text style={styles.ageText}>초등학생</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setAge("중학교");
            }}
            style={styles.ageButton}
          >
            <View
              style={
                age == "중학교"
                  ? [styles.ageImage, { borderColor: "#5AC9BC" }]
                  : styles.ageImage
              }
            >
              <View style={styles.ageMid}>
                {age == "중학교" ? (
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                    source={require("../img/mid-icon.png")}
                  />
                ) : (
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                    source={require("../img/dis-mid-icon.png")}
                  />
                )}
              </View>
            </View>
            <Text style={styles.ageText}>중학생</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setAge("고등학교");
            }}
            style={styles.ageButton}
          >
            <View
              style={
                age == "고등학교"
                  ? [styles.ageImage, { borderColor: "#FF9843" }]
                  : styles.ageImage
              }
            >
              <View style={styles.ageHigh}>
                {age == "고등학교" ? (
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                    source={require("../img/high-icon.png")}
                  />
                ) : (
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                    }}
                    source={require("../img/dis-high-icon.png")}
                  />
                )}
              </View>
            </View>
            <Text style={styles.ageText}>고등학생</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.genderBox}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setGender("남성");
            }}
            style={styles.genderButton}
          >
            <Foundation
              name="male"
              color={gender == "남성" ? "#5AC9BC" : "#A4A4A4"}
              size={40}
            />
            <Text style={styles.genderText}>남자</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setGender("여성");
            }}
            style={styles.genderButton}
          >
            <Foundation
              name="female"
              color={gender == "여성" ? "#FF9843" : "#A4A4A4"}
              size={40}
            />
            <Text style={styles.genderText}>여자</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            setInformation();
            showToast();
            jumpTo("second");
          }}
          style={{
            marginTop: "auto",
            marginBottom: SCREEN_HEIGHT / 25,
          }}
        >
          <View style={styles.changeBox}>
            <Text style={styles.changeText}>등록하기</Text>
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
  ageBox: {
    width: "100%",
    height: (SCREEN_HEIGHT / 10) * 3.5,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 30,
    paddingVertical: 30,
    ...shadow,
  },
  ageButton: {
    width: "30%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ageImage: {
    width: "100%",
    height: "80%",
    borderRadius: 15,
    justifyContent: "flex-end",
    alignItems: "center",

    backgroundColor: "#F2F2F2",
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: "white",
  },
  ageLow: {
    width: "75%",
    height: "50%",
  },
  ageMid: {
    width: "75%",
    height: "75%",
  },
  ageHigh: {
    width: "75%",
    height: "100%",
  },
  ageText: {
    fontSize: 14,
    color: "#2A2A2A",
    fontFamily: "LeferiBaseRegular",
  },
  genderBox: {
    width: "100%",
    height: (SCREEN_HEIGHT / 10) * 1.5,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    ...shadow,
  },
  genderButton: {
    width: "45%",
    height: "100%",
    backgroundColor: "#F2F2F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  genderText: {
    fontSize: 14,
    color: "#2A2A2A",
    fontFamily: "LeferiBaseRegular",
  },
  changeBox: {
    width: "100%",
    height: (SCREEN_HEIGHT / 10) * 0.7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5AC9BC",
    borderRadius: 15,
    marginVertical: 10,
  },
  changeText: {
    fontSize: 16,
    color: "white",
    fontFamily: "LeferiBaseRegular",
  },
});
export default MyInformation;
