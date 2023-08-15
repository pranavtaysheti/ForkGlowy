import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TasksVisiblity = {
  showCompleted: boolean;
};
const tasksVisiblityInitial = {
  showCompleted: false,
};
const tasksVisiblitySlice = createSlice({
  name: "tasksVisiblity",
  initialState: tasksVisiblityInitial,
  reducers: {
    setVisiblity: (state, action: PayloadAction<TasksVisiblity>) => {
      state.showCompleted = action.payload.showCompleted;
    },
  },
});

export const tasksVisiblityReducer = tasksVisiblitySlice.reducer;
export const { setVisiblity } = tasksVisiblitySlice.actions;