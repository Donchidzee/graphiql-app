import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Header, inputsState, RequestHistory } from '@/types/restTypes';

const initialState: inputsState = {
  url: '',
  urlError: false,
  body: '',
  headers: [],
  RequestHistory: localStorage.getItem('requestHistory')
    ? JSON.parse(localStorage.getItem('requestHistory'))
    : [],
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
    changeRequestHistory: (state, action: PayloadAction<RequestHistory[]>) => {
      state.RequestHistory = [...action.payload];
    },
  },
});

export const {
  changeUrl,
  changeUrlError,
  changeBody,
  changeHeaders,
  changeRequestHistory,
} = restInputsSlice.actions;

export default restInputsSlice.reducer;
