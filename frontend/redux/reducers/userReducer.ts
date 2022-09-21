import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  userId?: string
}

const initialState: User = {}

const userReducer = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state: User, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
  },
})

export type { User }
export const { setUser } = userReducer.actions
export default userReducer.reducer
