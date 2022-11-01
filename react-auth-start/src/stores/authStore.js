import create from "zustand";

function setTokensToLocalStorage({ accessToken, refreshToken }) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

function removeTokensFromLocalStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export const useAuthStore = create((set, get) => ({
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isLoggedIn: () => !!get().accessToken,
  login: (tokens) => {
    setTokensToLocalStorage(tokens);
    set((state) => ({
      ...state,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }));
  },
  logout: () => {
    removeTokensFromLocalStorage();
    set((state) => ({
      ...state,
      accessToken: null,
      refreshToken: null,
    }));
  },
}));
