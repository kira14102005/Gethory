import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../http';


export interface User {
  _id: string;
  email: string;
  displayName?: string | null;
  name?: string | null;
  verified: boolean;

  profileCompleted: boolean;
  avatarUrl?: string | null;
  roles?: string[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// // --- ASYNC THUNKS ---

// /**
//  * Thunk to rehydrate the user session on application boot.
//  * It attempts to fetch user data using existing session cookies.
//  */
// export const fetchCurrentUser = createAsyncThunk<User | null, void, { rejectValue: string }>(
//   'user/fetchCurrentUser',
//   async (_, { rejectWithValue }) => {
//     try {
//       // Assuming 'api' (axios/fetch) is configured to send cookies ('withCredentials' in Axios)
//       // The backend route is /user
//       const res = await fetch('http://localhost:3000/user', { 
//         credentials: 'include' 
//       });

//       if (res.status === 401 || res.status === 403) {
//         // Not authenticated or session expired (backend clears cookies)
//         return null; 
//       }
//       if (!res.ok) {
//          throw new Error('Failed to fetch current user');
//       }

//       const data = await res.json();

//       // The user controller returns { msg: "Your Details", User: user.omitPassword() }
//       const fetchedUser = data.User as Partial<User>;

//       // **CRUCIAL LOGIC: Determine profileSetupComplete on the client**
//       // In your current setup, the completion of the /auth flow is represented by the 'name' field
//       const isProfileComplete = !!fetchedUser.name;

//       return {
//           id: fetchedUser._id as string, 
//           email: fetchedUser.email as string, 
//           name: fetchedUser.name,
//           verified: fetchedUser.verified as boolean,
//           profileSetupComplete: isProfileComplete,
//           // Map other necessary fields
//       } as User;

//     } catch (err) {
//       return rejectWithValue((err as Error).message);
//     }
//   }
// );
// inside frontend/src/store/authSlice.ts

export const fetchCurrentUser = createAsyncThunk<User | null, void, { rejectValue: string }>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/user', { withCredentials: true })

      if (res.status === 401 || res.status === 403) {
        return null;
      }

      if (res.status != 200) {
        // Handle other potential non-2xx errors (e.g., 500)
        throw new Error('Failed to fetch current user');
      }

      const data = res.data;
      //@ts-ignore
      const fetchedUser = data.user as Partial<User>;

      return {
        _id: fetchedUser._id as string,
        email: fetchedUser.email as string,
        name: fetchedUser.name,
        verified: fetchedUser.verified as boolean,
        profileCompleted: fetchedUser.profileCompleted as boolean
      } as User

    } catch (err) {
      // 5. Thunk Rejection
      // If an error is thrown (e.g., network error, internal server error), 
      // we use rejectWithValue to trigger the 'rejected' action and set the error message.
      return rejectWithValue(`Network Error during session check: ${(err as Error).message}`);
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Used on successful login (API handles token, frontend sets state)
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    // Used on logout or failed session check
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    // Used for local, non-critical profile field updates
    updateUserProfile(state, action: PayloadAction<Partial<User>>) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
    }
  },
  extraReducers(builder) {
    builder
      // Handle Thunk lifecycle actions
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.loading = false;
        state.user = action.payload;
        // Set isAuthenticated based on whether a user object was successfully returned
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? 'Session check failed';
      });
  }
});

export const { setUser, clearUser, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;