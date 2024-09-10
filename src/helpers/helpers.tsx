import { changeRequestHistory } from '@/store/slices/restInputsSlice';

export const saveEndpointToLS = (pathname, searchParams, dispatch) => {
  const newPathname = pathname.split('/').slice(3).join('/');
  const endpointString = `${newPathname}?${searchParams.toString()}`;

  const lsStoredRequestHistory = localStorage.getItem('requestHistory');
  const storedRequests = lsStoredRequestHistory
    ? JSON.parse(lsStoredRequestHistory)
    : [];

  const newRequest = {
    endpoint: endpointString,
  };
  const updatedRequests = [...storedRequests, newRequest];

  localStorage.setItem('requestHistory', JSON.stringify(updatedRequests));
  dispatch(changeRequestHistory(updatedRequests));
};
