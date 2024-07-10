import { combineReducers, configureStore } from '@reduxjs/toolkit'
import  UserDataReducer  from "./reducers/UserDataReducer"

const RootReducers = combineReducers({
    UserDataReducer : UserDataReducer ,
   
})
export default configureStore({
    reducer: RootReducers,
})