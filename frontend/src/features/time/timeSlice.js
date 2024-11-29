import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";


export const timeSlice = createSlice({
  name: 'time',
  initialState: {
    time: dayjs().unix(),
    timer: null

  },

  reducers: {
    updateCurrentTime(state, action) {
      state.time = action.payload
    },
  }
})

export const { updateCurrentTime } = timeSlice.actions

export default timeSlice.reducer
