import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { inputsState, Header, RequestHistory } from '@/types/restTypes';

const isBrowser = typeof window !== 'undefined';

const initialState: inputsState = {
  url: '',
  sdlUrl: '',
  urlError: false,
  sdlUrlError: false,
  body: '',
  headers: [],
  RequestHistory: isBrowser
    ? localStorage.getItem('requestHistory')
      ? JSON.parse(localStorage.getItem('requestHistory')!)
      : []
    : [],
};

export const restInputsSlice = createSlice({
  name: 'restInputsSlice',
  initialState,
  reducers: {
    changeUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    changeSdlUrl: (state, action: PayloadAction<string>) => {
      state.sdlUrl = action.payload; // Reducer for SDL URL
    },
    changeUrlError: (state, action: PayloadAction<boolean>) => {
      state.urlError = action.payload;
    },
    changeSdlUrlError: (state, action: PayloadAction<boolean>) => {
      state.sdlUrlError = action.payload; // SDL URL error
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
  changeSdlUrl,
  changeUrlError,
  changeSdlUrlError,
  changeBody,
  changeHeaders,
  changeRequestHistory,
} = restInputsSlice.actions;

export default restInputsSlice.reducer;
