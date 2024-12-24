import axios from "axios";

/**
 * A class to intercept Axios requests and handle token-based authentication.
 * It retries unauthorized (401) requests after refreshing the access token.
 */
class AxiosInterceptor {
  /**
   * Creates an AxiosInterceptor instance.
   * @param {object} [instanceConfig={}] - Configuration for the Axios instance.
   */
  constructor(instanceConfig = {}) {
    this.isRefreshing = false; // Tracks if a token refresh is in progress
    this.refreshSubscribers = []; // Queue for requests waiting for the token to refresh

    // Initialize Axios instance with provided configuration
    this.axiosInstance = axios.create({
      ...instanceConfig,
    });

    // Add request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = this.getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.message === "TokenExpiredError" &&
          !originalRequest._retry
        ) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
              const newTokens = await this.refreshTokens();
              this.setAccessToken(newTokens.accessToken);
              this.setRefreshToken(newTokens.refreshToken);

              this.refreshSubscribers.forEach((callback) =>
                callback(newTokens.accessToken)
              );
              this.refreshSubscribers = [];

              return this.axiosInstance(originalRequest);
            } catch (refreshError) {
              this.refreshSubscribers = []; // Clear the queue in case of failure
              this.setAccessToken("");
              this.setRefreshToken("");
              return Promise.reject(refreshError);
            } finally {
              this.isRefreshing = false;
            }
          }

          return new Promise((resolve) => {
            this.refreshSubscribers.push((newAccessToken) => {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              originalRequest._retry = true;
              resolve(this.axiosInstance(originalRequest));
            });
          });
        }

        return Promise.reject(error);
      }
    );

    // Bind instance methods for convenience
    /**
     * Makes a GET request.
     * @type {import('axios').AxiosInstance['get']}
     */
    this.get = this.axiosInstance.get.bind(this.axiosInstance);

    /**
     * Makes a POST request.
     * @type {import('axios').AxiosInstance['post']}
     */
    this.post = this.axiosInstance.post.bind(this.axiosInstance);

    /**
     * Makes a PUT request.
     * @type {import('axios').AxiosInstance['put']}
     */
    this.put = this.axiosInstance.put.bind(this.axiosInstance);

    /**
     * Makes a DELETE request.
     * @type {import('axios').AxiosInstance['delete']}
     */

    this.delete = this.axiosInstance.delete.bind(this.axiosInstance);
  }

  /**
   * Retrieves the current access token from localStorage.
   * @returns {string|null} The access token or null if not available.
   */
  getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  /**
   * Stores a new access token in localStorage.
   * @param {string} token - The new access token.
   */
  setAccessToken(token) {
    localStorage.setItem("accessToken", token);
  }

  /**
   * Retrieves the current refresh token from localStorage.
   * @returns {string|null} The refresh token or null if not available.
   */
  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  }

  /**
   * Stores a new refresh token in localStorage.
   * @param {string} token - The new refresh token.
   */
  setRefreshToken(token) {
    localStorage.setItem("refreshToken", token);
  }

  /**
   * Refreshes the authentication tokens by calling the refresh endpoint.
   * @returns {Promise<{ accessToken: string, refreshToken: string }>} The new access and refresh tokens.
   * @throws {Error} If the token refresh request fails.
   */
  async refreshTokens() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // try {
    const response = await this.axiosInstance.post("/auth/refreshToken", {
      refreshToken,
    });
    return response.data; // Expecting { accessToken: string, refreshToken: string }

    // } catch(e) {
    //   thr
    // }

    // if (response.status !== 200) {
    //   throw new Error("Failed to refresh token");
    // }
  }
}

// Export a pre-configured instance of AxiosInterceptor
export const client = new AxiosInterceptor({
  baseURL: "http://localhost:5000/api/v1",
});
