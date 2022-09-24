import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  userId?: string;
  userAge?: string;
  userGender?: string;
  avgCal?: number;
  avgCarbon?: number;
  avgFat?: number;
  avgProtein?: number;
}

const initialState: User = {};

const userReducer = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state: User, action: any) => {
      state.userId = action.payload.userId;
      state.userAge = action.payload.userAge;
      state.userGender = action.payload.userGender;
      if (action.payload.userGender == "남성") {
        if (action.payload.userAge == "초등학교") {
          state.avgCal = 2000;
          state.avgCarbon = 300;
          state.avgProtein = 65;
          state.avgFat = 50;
        } else if (action.payload.userAge == "중학교") {
          state.avgCal = 2500;
          state.avgCarbon = 375;
          state.avgProtein = 82;
          state.avgFat = 64;
        } else if (action.payload.userAge == "고등학교") {
          state.avgCal = 2700;
          state.avgCarbon = 405;
          state.avgProtein = 88;
          state.avgFat = 70;
        }
      } else if (action.payload.userGender == "여성") {
        if (action.payload.userAge == "초등학교") {
          state.avgCal = 1800;
          state.avgCarbon = 270;
          state.avgProtein = 59;
          state.avgFat = 46;
        } else if (action.payload.userAge == "중학교") {
          state.avgCal = 2000;
          state.avgCarbon = 300;
          state.avgProtein = 65;
          state.avgFat = 50;
        } else if (action.payload.userAge == "고등학교") {
          state.avgCal = 2000;
          state.avgCarbon = 300;
          state.avgProtein = 65;
          state.avgFat = 50;
        }
      }
    },
  },
});

export type { User };
export const { setUser } = userReducer.actions;
export default userReducer.reducer;
