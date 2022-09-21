import { AnyAction, CombinedState, combineReducers } from 'redux'
import locationsReducer, { Locations } from './reducers/locationsReducer'
import myDietReducer, { MyDiets } from './reducers/myDietReducer'
import userReducer, { User } from './reducers/userReducer'

interface ReducerState {
  locations: Locations
  myDiets: MyDiets
  user: User
}

const rootReducer = (
  state: ReducerState | undefined,
  action: AnyAction
): CombinedState<ReducerState> => {
  const combinedReducer = combineReducers({
    locations: locationsReducer,
    myDiets: myDietReducer,
    user: userReducer,
  })
  return combinedReducer(state, action)
}

export default rootReducer
