import axios from "axios";

let failedQueue = [];
let isRefreshing = false;

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

export function createAxiosClient({
  options,
  getCurrentAccessToken,
  getCurrentRefreshToken,
  refreshTokenUrl,
  logout,
  setRefreshedTokens,
}) {
  const client = axios.create(options);

  client.interceptors.request.use(
    (config) => {
      if (config.authorization !== false) {
        const token = getCurrentAccessToken();
        if (token) {
          config.headers.Authorization = "Bearer " + token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    (error) => {
      const originalRequest = error.config;
      // In "axios": "^1.1.3" there is an issue with headers, and this is the workaround.
      originalRequest.headers = JSON.parse(
        JSON.stringify(originalRequest.headers || {})
      );
      const refreshToken = getCurrentRefreshToken();

      // If error, process all the requests in the queue and logout the user.
      const handleError = (error) => {
        processQueue(error);
        logout();
        return Promise.reject(error);
      };

      // Refresh token conditions
      if (
        refreshToken &&
        error.response?.status === 401 &&
        error.response.data.message === "TokenExpiredError" &&
        originalRequest?.url !== refreshTokenUrl &&
        originalRequest?._retry !== true
      ) {
        
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
        isRefreshing = true;
        originalRequest._retry = true;
        return client
          .post(refreshTokenUrl, {
            refreshToken: refreshToken,
          })
          .then((res) => {
            const tokens = {
              accessToken: res.data?.accessToken,
              refreshToken: res.data?.refreshToken,
            };
            setRefreshedTokens(tokens);
            processQueue(null);

            return client(originalRequest);
          }, handleError)
          .finally(() => {
            isRefreshing = false;
          });
      }

      // Refresh token missing or expired => logout user...
      if (
        error.response?.status === 401 &&
        error.response?.data?.message === "TokenExpiredError"
      ) {
        return handleError(error);
      }

      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );

  return client;
}
