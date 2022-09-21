import React, { useState, useRef, FunctionComponent, useMemo } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux'
import { setMealInfo } from '../redux/reducers/myDietReducer'
import { TextInput } from 'react-native-gesture-handler'
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const SearchMeal: FunctionComponent<{ jumpTo: any }> = ({ jumpTo }) => {
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [result, setResult] = useState('')
  const resultList = useRef([])

  // 테스트용 음식 반환 리스트입니다.
  const tempList1: any = [
    {
      foodName: '피자1',
      cal: 150,
      carbohydrate: 11,
      protein: 22,
      fat: 33,
      serving: 1,
    },
    {
      foodName: '피자2',
      cal: 150,
      carbohydrate: 44,
      protein: 55,
      fat: 66,
      serving: 2,
    },
    {
      foodName: '피자3',
      cal: 150,
      carbohydrate: 77,
      protein: 88,
      fat: 99,
      serving: 3,
    },
    {
      foodName: '피자4',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '피자5',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '피자6',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '피자7',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '피자8',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '피자9',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '피자10',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
  ]

  const tempList2: any = [
    {
      foodName: '햄버거',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '햄버거2',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '햄버거3',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '햄버거4',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '햄버거5',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '햄버거6',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '햄버거7',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '햄버거8',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '햄버거9',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
    {
      foodName: '햄버거10',
      cal: 150,
      carbohydrate: 999,
      protein: 999,
      fat: 999,
      serving: 1,
    },
  ]

  const tempList3: any = []

  //검색 버튼을 누르면 실행됩니다.
  const onSearch = () => {
    setResult(search)
  }

  const setMeal = (value: any) => {
    dispatch(
      setMealInfo({
        foodName: value['foodName'],
        cal: value['cal'],
        carbohydrate: value['carbohydrate'],
        protein: value['protein'],
        fat: value['fat'],
        serving: value['serving'],
      })
    )
  }

  // 테스트용 검색어 코드입니다.
  if (result == '피자') {
    resultList.current = tempList1
  } else if (result == '햄버거') {
    resultList.current = tempList2
  } else {
    resultList.current = tempList3
  }

  //console.log(resultList.current.length);

  const FoodList = () => {
    return (
      <>
        {resultList['current'].map((value: any, index: number) => (
          <View style={styles.searchList} key={index}>
            <View>
              <Text style={styles.foodName}>{value['foodName']}</Text>
              <Text style={styles.foodServing}>{value['serving']}인분</Text>
            </View>
            <View style={styles.addButton}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  setMeal(value)
                  jumpTo('addMeal')
                }}
              >
                <AntDesign name="plus" color="white" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </>
    )
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <View style={styles.backButton}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                jumpTo('second')
              }}
            >
              <FontAwesomeIcon name="arrow-left" color="white" size={40} />
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
              setSearch(text)
            }}
          />
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              onSearch()
            }}
          >
            <View style={styles.searchButton}>
              <FontAwesomeIcon name="search" color="white" size={30} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.listBox}>
          {resultList.current.length == 0 ? (
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f2f2f2',
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    minHeight: (SCREEN_HEIGHT / 10) * 7.5,
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
  searchBox: {
    width: '100%',
    height: SCREEN_HEIGHT / 15,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    borderColor: '#D9D9D9',
    borderWidth: 0.5,
  },
  searchBar: {
    width: '100%',
    paddingHorizontal: 10,
    fontFamily: 'LeferiBaseRegular',
  },
  searchButton: {
    height: SCREEN_HEIGHT / 15,
    aspectRatio: 1 / 1, // 정사각형
    backgroundColor: '#45c1b0',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -SCREEN_HEIGHT / 15,
  },

  listBox: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 10,
  },

  searchIndex: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  indexText: {
    fontSize: 20,
    color: '#A4A4A4',
    fontFamily: 'LeferiBaseRegular',
  },
  searchList: {
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D6D6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  addButton: {
    width: 30,
    height: 30,
    backgroundColor: '#D6D6D6',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  foodName: {
    fontSize: 16,
    fontFamily: 'LeferiBaseRegular',
    color: '#2A2A2A',
    marginBottom: 5,
  },
  foodServing: {
    fontSize: 12,
    fontFamily: 'LeferiBaseRegular',
    color: '#A4A4A4',
  },
})
export default SearchMeal
