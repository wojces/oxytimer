import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    userEmail: '',
    userPassword: '',
    isLoggedIn: false

  },
  reducers: {
    setUserEmail(state, action) {
      state.userEmail = action.payload
    },
    setUserPassword(state, action) {
      state.userPassword = action.payload
    },
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload
    },

  }
})

export const { setUserEmail, setUserPassword, setIsLoggedIn } = loginSlice.actions

export default loginSlice.reducer