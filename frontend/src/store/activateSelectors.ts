import type { RootState } from './index'
export const selectName = (state: RootState) => state.activate.name;
export const selectUsername = (state: RootState) => state.activate.username;
export const selectAvatar = (state: RootState) => state.activate.avatar;
export const selectActivate = (state: RootState) => state.activate;
