let isLogoutInProgress = false;

const handleResponse = async (response) => {
  if (response.status === 498 && !isLogoutInProgress) {
    isLogoutInProgress = true;
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        await fetch('https://localhost:7136/api/Account/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });

        localStorage.removeItem('authToken');
        window.location.href = '/';
      } catch (error) {
        console.error('Error during logout:', error);
      }
    } else {
      console.error('Auth token not found');
    }
    isLogoutInProgress = false;
  }
  return response;
};

const originalFetch = window.fetch;

window.fetch = async (url, options) => {
  const modifiedOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  };

  const response = await originalFetch(url, modifiedOptions);
  await handleResponse(response);
  return response;
};

export default window.fetch;
