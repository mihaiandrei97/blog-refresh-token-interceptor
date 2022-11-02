import axios from "axios";

let failedQueue = [];
let isRefreshing = false;

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      console.log("sa facut rezolve la promise");
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
  setRefreshTokens,
}) {
  const client = axios.create(options);

  client.interceptors.request.use(
    (config) => {
      const token = getCurrentAccessToken();
      console.log("intra iar oare in request?", Object.keys(config.headers));
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
      }
      return config;
    },
    (error) => {
      console.log('aici intra?')
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
      const refreshToken = getCurrentRefreshToken();

      const handleError = (error) => {
        processQueue(error);
        logout();

        return Promise.reject(error);
      };

      // REFRESH TOKEN CONDITIONS
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
            setRefreshTokens(tokens);
            processQueue(null);
            console.log(originalRequest)
            originalRequest.headers = JSON.parse(JSON.stringify(originalRequest.headers || {}))
            return client(originalRequest)
          }, handleError)
          .finally(() => {
            isRefreshing = false;
          });
      }

      if (
        error.response?.status === 401 &&
        error.response?.data?.message === "TokenExpiredError"
      ) {
        return handleError(error);
      }
      // Invalid token scenario
      // if (
      //   (error.response?.status === 401 || error.response?.status === 400) &&
      //   INVALID_TOKEN_CODE_ERRORS.includes(error.response?.data?.code)
      // ) {
      //   return handleError(error);
      // }

      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );

  return client;
}
