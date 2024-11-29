import { configureStore } from '@reduxjs/toolkit'
import tableReducer from '../features/table/tableSlice'
import appReducer from '../features/app/appSlice'
import loginReducer from '../features/login/loginSlice'
import timeReducer from '../features/time/timeSlice'
import rescuerReduer from '../features/rescuers/rescuerSlice'
import userReducer from '../features/user/userSlice'

export default configureStore({
  reducer: {
    table: tableReducer,
    app: appReducer,
    login: loginReducer,
    time: timeReducer,
    rescuer: rescuerReduer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),


})