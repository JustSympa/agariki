import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createClient } from '@/lib/supabase/client'
import { PointOfActivity } from '@/lib/db/schema'

interface PoaState {
  points: PointOfActivity[]
  loading: boolean
  error: string | null
}

const initialState: PoaState = {
  points: [],
  loading: false,
  error: null,
}

export const fetchUserPoints = createAsyncThunk(
  'poa/fetchUserPoints',
  async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('points_of_activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
)

export const createPoint = createAsyncThunk(
  'poa/createPoint',
  async (point: Omit<PointOfActivity, 'id' | 'created_at' | 'updated_at'>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('points_of_activity')
      .insert([point])
      .select()
      .single()

    if (error) throw error
    return data
  }
)

export const updatePoint = createAsyncThunk(
  'poa/updatePoint',
  async ({ id, updates }: { id: string; updates: Partial<PointOfActivity> }) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('points_of_activity')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
)

export const deletePoint = createAsyncThunk(
  'poa/deletePoint',
  async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('points_of_activity')
      .delete()
      .eq('id', id)

    if (error) throw error
    return id
  }
)

const poaSlice = createSlice({
  name: 'poa',
  initialState,
  reducers: {
    clearPoints: (state) => {
      state.points = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPoints.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserPoints.fulfilled, (state, action) => {
        state.points = action.payload
        state.loading = false
      })
      .addCase(fetchUserPoints.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch points'
        state.loading = false
      })
      .addCase(createPoint.fulfilled, (state, action) => {
        state.points.unshift(action.payload)
      })
      .addCase(updatePoint.fulfilled, (state, action) => {
        const index = state.points.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.points[index] = action.payload
        }
      })
      .addCase(deletePoint.fulfilled, (state, action) => {
        state.points = state.points.filter(p => p.id !== action.payload)
      })
  },
})

export const { clearPoints } = poaSlice.actions
export default poaSlice.reducer