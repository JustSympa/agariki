import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/lib/db/schema'
import * as api from '@/src/api'

interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
}

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (userId: string) => {
    const is_stored = localStorage.getItem('user')
    if(is_stored) return JSON.parse(is_stored)
    const user = await api.users.read(userId)
    localStorage.setItem('user', JSON.stringify(user))
    return user
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, updates }: { id: string; updates: Partial<User> }) => {
    const user = await api.users.update(id, updates)
    localStorage.setItem('user', JSON.stringify(user))
    return user
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ newPassword }: { newPassword: string }) => {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<any>) => {
      state.session = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.session = null
      state.loading = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch user profile'
        state.loading = false
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.error = null
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to change password'
      })
  },
})

export const { setSession, clearAuth, setLoading } = authSlice.actions
export default authSlice.reducer