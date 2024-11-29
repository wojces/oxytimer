import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "../../api/user";

const initialState = {
  user: {},
  usersList: []
}

export const fetchUser = createAsyncThunk('fetchUser', async () => {
  const response = await getUser()
  return response.data
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload
    })
  }

})

export default userSlice.reducer;