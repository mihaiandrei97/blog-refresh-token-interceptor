import { createAxiosClient } from "./axiosClient";

const REFRESH_TOKEN_URL = 'http://localhost:5000/api/v1/auth/refreshToken'
const BASE_URL = 'http://localhost:5000/api/v1/'

function getCurrentAccessToken() {
    return localStorage.getItem('accessToken');
}

function getCurrentRefreshToken() {
    return localStorage.getItem('refreshToken');
}


async function setRefreshTokens(tokens){
    
}

export const client = createAxiosClient({
    options: {
        baseURL: BASE_URL,
        timeout: 300000
    },
    getCurrentAccessToken,
    getCurrentRefreshToken,
    refreshTokenUrl: REFRESH_TOKEN_URL,
    logout
})
