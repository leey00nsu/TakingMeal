import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MyDiet {
  isToday: boolean;
  weekDay: string;
  meals: any;
}

interface MealInfo {
  foodName: string;
  status: number;
}

interface MyDiets {
  dietList: any;
  mealInfo: MealInfo[];
  [props: string]: any;
}

const initialState: any = {
  dietList: [
    {
      foods: [],
      amount: 0,
      cal: 0,
      carbon: 0,
      protein: 0,
      fat: 0,
    },
    { foods: [], amount: 0, cal: 0, carbon: 0, protein: 0, fat: 0 },
    { foods: [], amount: 0, cal: 0, carbon: 0, protein: 0, fat: 0 },
    { foods: [], amount: 0, cal: 0, carbon: 0, protein: 0, fat: 0 },
    { foods: [], amount: 0, cal: 0, carbon: 0, protein: 0, fat: 0 },
    { foods: [], amount: 0, cal: 0, carbon: 0, protein: 0, fat: 0 },
    { foods: [], amount: 0, cal: 0, carbon: 0, protein: 0, fat: 0 },
  ],
  mealInfo: [
    {
      foodName: "",
      cal: 0,
      carbohydrate: 0,
      protein: 0,
      fat: 0,
      serving: 0,
      status: 0,
    },
  ],
};

const myDietReducer = createSlice({
  name: "myDiets",
  initialState,
  reducers: {
    setMyDiets: (state, action) => {
      let dateFilter = action.payload.dateFilter;
      //console.log(dateFilter);
      state["dietList"][6 - dateFilter].foods = action.payload.foods;
      state["dietList"][6 - dateFilter].cal = action.payload.cal;
      state["dietList"][6 - dateFilter].carbon = action.payload.carbon;
      state["dietList"][6 - dateFilter].protein = action.payload.protein;
      state["dietList"][6 - dateFilter].fat = action.payload.fat;
      state["dietList"][6 - dateFilter].amount = action.payload.amount;
      // state["mealInfo"][0].serving = action.payload.serving;
      //console.log(state["dietList"][6 - dateFilter])
    },
    setMealInfo: (state, action) => {
      state["mealInfo"][0].foodName = action.payload.foodName;
      state["mealInfo"][0].cal = action.payload.cal;
      state["mealInfo"][0].carbohydrate = action.payload.carbohydrate;
      state["mealInfo"][0].protein = action.payload.protein;
      state["mealInfo"][0].fat = action.payload.fat;
      state["mealInfo"][0].amount = action.payload.amount;
      state["mealInfo"][0].serving = action.payload.serving;
      state["mealInfo"][0].status = action.payload.status;
    },
  },
});

export type { MyDiet, MyDiets };
export const { setMyDiets, setMealInfo } = myDietReducer.actions;
export default myDietReducer.reducer;
