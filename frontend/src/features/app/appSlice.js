import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    currentView: 'Login',
    showSidebar: false,
  },
  reducers: {
    setCurrentView(state, action) {
      state.currentView = action.payload
    },
    setShowSidebar(state, action) {
      state.showSidebar = action.payload
    }
  }
})

export const { setCurrentView, setShowSidebar } = appSlice.actions

export default appSlice.reducer