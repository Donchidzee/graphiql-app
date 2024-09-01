import { AppDispatch } from '@/store/store'; // Adjust import based on your project structure
import { changeRequestHistory } from '@/store/slices/restInputsSlice';

export const saveEndpointToLS = (pathname, searchParams, dispatch) => {
  const endpointString = `${pathname}?${searchParams.toString()}`;

  const lsStoredRequestHistory = localStorage.getItem('requestHistory');
  const storedRequests = lsStoredRequestHistory
    ? JSON.parse(lsStoredRequestHistory)
    : [];

  const newRequest = {
    endpoint: endpointString,
    variables: ''
  };
  const updatedRequests = [...storedRequests, newRequest];

  localStorage.setItem('requestHistory', JSON.stringify(updatedRequests));
  dispatch(changeRequestHistory(updatedRequests));

}