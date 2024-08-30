import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type inputsState = {
  url: string;
  urlError: boolean;
  body: string;
};

const initialState: inputsState = {
  url: '',
  urlError: false,
  body: '',
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
  },
});

export const { changeUrl, changeUrlError, changeBody } =
  restInputsSlice.actions;

export default restInputsSlice.reducer;
