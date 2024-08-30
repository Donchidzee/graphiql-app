import { configureStore } from '@reduxjs/toolkit';
import restInputsSliceReducer from './slices/restInputsSlice';

export const store = configureStore({
  reducer: {
    restInputs: restInputsSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
