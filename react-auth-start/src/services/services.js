import { createAxiosClient } from "./axiosClient";
import { useAuthStore } from "../stores/authStore";

const REFRESH_TOKEN_URL = 'http://localhost:5000/api/v1/auth/refreshToken'
const BASE_URL = 'http://localhost:5000/api/v1/'

function getCurrentAccessToken() {
    return useAuthStore.getState().accessToken
}

function getCurrentRefreshToken() {
    return useAuthStore.getState().refreshToken
}


function setRefreshTokens(tokens){
    const login = useAuthStore.getState().login
    login(tokens)
}

async function logout(){
    console.log('logout')
}

export const client = createAxiosClient({
    options: {
        baseURL: BASE_URL,
        timeout: 300000,
        headers: {
            'Content-Type': 'application/json',
        }
    },
    getCurrentAccessToken,
    getCurrentRefreshToken,
    refreshTokenUrl: REFRESH_TOKEN_URL,
    logout,
    setRefreshTokens
})


export function getProfile(){
    return client.get('/users/profile')
}