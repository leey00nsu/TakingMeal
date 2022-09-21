import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MyDiet {
  isToday: boolean
  weekDay: string
  meals: any
}

interface MealInfo {
  foodName: string
}

interface MyDiets {
  dietList: MyDiet[]
  mealInfo: MealInfo[]
  [props: string]: any
}

const initialState: any = {
  dietList: [
    {
      isToday: false,
      weekDay: '월',
      meals: [
        {
          breakfast: {
            foodName: '피자',
            cal: 1960,
            carbohydrate: 111,
            protein: 111,
            fat: 111,
            serving: 1,
          },
          lunch: {
            foodName: '동파육',
            cal: 0,
            carbohydrate: 222,
            protein: 222,
            fat: 222,
            serving: 2,
          },
          dinner: {
            foodName: '치킨',
            cal: 0,
            carbohydrate: 333,
            protein: 333,
            fat: 333,
            serving: 1,
          },
        },
      ],
    },
    {
      isToday: false,
      weekDay: '화',
      meals: [
        {
          breakfast: {
            foodName: '햄버거',
            cal: 444,
            carbohydrate: 444,
            protein: 444,
            fat: 444,
            serving: 1,
          },
          lunch: {
            foodName: '떡볶이',
            cal: 555,
            carbohydrate: 555,
            protein: 555,
            fat: 555,
            serving: 1,
          },
          dinner: {
            foodName: '탕수육',
            cal: 666,
            carbohydrate: 666,
            protein: 666,
            fat: 666,
            serving: 1,
          },
        },
      ],
    },
    {
      isToday: false,
      weekDay: '수',
      meals: [
        {
          breakfast: {},
          lunch: {},
          dinner: {},
        },
      ],
    },
  ],
  mealInfo: [
    {
      foodName: '',
      cal: 0,
      carbohydrate: 0,
      protein: 0,
      fat: 0,
      serving: 0,
    },
  ],
}

const myDietReducer = createSlice({
  name: 'myDiets',
  initialState,
  reducers: {
    setMyDiets: (state: MyDiets, action: PayloadAction<MyDiets>) => {
      state = action.payload
    },
    setMealInfo: (state, action) => {
      state['mealInfo'][0].foodName = action.payload.foodName
      state['mealInfo'][0].cal = action.payload.cal
      state['mealInfo'][0].carbohydrate = action.payload.carbohydrate
      state['mealInfo'][0].protein = action.payload.protein
      state['mealInfo'][0].fat = action.payload.fat
      state['mealInfo'][0].serving = action.payload.serving
      // state["mealInfo"][0] = action.payload;
    },
  },
})

export type { MyDiet, MyDiets }
export const { setMyDiets, setMealInfo } = myDietReducer.actions
export default myDietReducer.reducer
