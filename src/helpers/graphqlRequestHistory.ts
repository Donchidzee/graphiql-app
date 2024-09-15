export const saveGraphqlRequestToLS = (
  url: string,
  sdl: string,
  query: string,
  headers: string
) => {
  const newPathname = url.split('/').slice(3).join('/');
  const request = {
    endpoint: newPathname,
    sdl,
    query,
    headers,
  };

  const lsStoredRequestHistory = localStorage.getItem('graphqlRequestHistory');
  const storedRequests = lsStoredRequestHistory
    ? JSON.parse(lsStoredRequestHistory)
    : [];

  const updatedRequests = [...storedRequests, request];

  localStorage.setItem(
    'graphqlRequestHistory',
    JSON.stringify(updatedRequests)
  );
};
