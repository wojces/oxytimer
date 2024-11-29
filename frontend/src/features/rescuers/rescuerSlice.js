import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRescuers } from "../../api/rescuers"

const initialState = {
  rescuers: [],
}

export const fetchRescuers = createAsyncThunk('fetchRescuers', async () => {
  const response = await getRescuers()
  return response.data
})

const rescuerSlice = createSlice({
  name: 'rescuer',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchRescuers.fulfilled, (state, action) => {
      state.rescuers = action.payload
    })
  }
})

export default rescuerSlice.reducer;