import { createAxiosClient } from "./createAxiosClient";
import { useAuthStore } from "../src/stores/authStore";

const BASE_URL = 'http://localhost:5000/api/v1/'
const REFRESH_TOKEN_URL = `${BASE_URL}auth/refreshToken`

function getCurrentAccessToken() {
    return useAuthStore.getState().accessToken
}

function getCurrentRefreshToken() {
    return useAuthStore.getState().refreshToken
}


function setRefreshedTokens(tokens){
    const login = useAuthStore.getState().login
    login(tokens)
}

async function logout(){
    const logout = useAuthStore.getState().logout
    logout()
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
    setRefreshedTokens
})