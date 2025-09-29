import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './index'; 


export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// some derived selectors
export const selectNeedsProfileSetup = createSelector(
  [selectUser, selectIsAuthenticated],
  (user, isAuth) => {
    return isAuth && user?.profileCompleted === false;
  }
);

export const selectLandingPath = createSelector(
  [selectIsAuthenticated, selectNeedsProfileSetup],
  (isAuth, needsSetup) => {
    if (!isAuth) {
      return '/signin'; // If logged out, go to sign in
    }
    if (needsSetup) {
      return '/auth'; // If profile incomplete, go to setup page
    }
    return '/profile'; // If complete, go to profile page
  }
);