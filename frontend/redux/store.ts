import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'

const store = configureStore({
  reducer: rootReducer,
})

declare global {
  type Store = ReturnType<typeof store.getState>
}

export default store
