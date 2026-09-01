import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from './authTypes';

const getInitialState = (): AuthState => {
  try {
    const storedToken = localStorage.getItem('unimart_token');
    const storedUser = localStorage.getItem('unimart_user');
    if (storedToken && storedUser) {
      return {
        token: storedToken,
        user: JSON.parse(storedUser) as User,
        isAuthenticated: true,
      };
    }
  } catch {
    // If JSON parsing fails or localStorage unavailable, fall back to empty
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      try {
        localStorage.setItem('unimart_token', action.payload.token);
        localStorage.setItem('unimart_user', JSON.stringify(action.payload.user));
      } catch {
        // Ignore localStorage write failures
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem('unimart_token');
        localStorage.removeItem('unimart_user');
      } catch {
        // Ignore localStorage remove failures
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
