import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { inputsState, Header } from '@/types/restTypes';

const initialState: inputsState = {
  url: '',
  urlError: false,
  body: '',
  headers: [],
};

export const restInputsSlice = createSlice({
  name: 'restInputsSlice',
  initialState,
  reducers: {
    changeUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    changeUrlError: (state, action: PayloadAction<boolean>) => {
      state.urlError = action.payload;
    },
    changeBody: (state, action: PayloadAction<string>) => {
      state.body = action.payload;
    },
    changeHeaders: (state, action: PayloadAction<Header[]>) => {
      state.headers = action.payload;
    },
  },
});

export const { changeUrl, changeUrlError, changeBody, changeHeaders } =
  restInputsSlice.actions;

export default restInputsSlice.reducer;
