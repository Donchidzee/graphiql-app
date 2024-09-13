import { changeRequestHistory } from '@/store/slices/restInputsSlice';
import { useEffect } from 'react';

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

export const useBodyFocusAndBlurListeners = (refs, handleFocus, handleBlur) => {
  useEffect(() => {
    refs.forEach((ref) => {
      const element = ref.current;
      if (element) {
        element.addEventListener('focus', handleFocus);
        element.addEventListener('blur', handleBlur);
      }

      return () => {
        if (element) {
          element.removeEventListener('focus', handleFocus);
          element.removeEventListener('blur', handleBlur);
        }
      };
    });
  }, [refs, handleFocus, handleBlur]);
};

export const isBase64 = (str) => {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
};
