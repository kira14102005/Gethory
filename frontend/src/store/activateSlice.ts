import { createSlice } from "@reduxjs/toolkit"
export interface ActivateState {
    name: string,
    username: string,
    avatar: string
}
const initialState: ActivateState =
{
    name: '',
    username: '',
    avatar: ''
}

export const activateSlice = createSlice({
    name: 'activate',
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload
        },
        setAvatar: (state, action) => {
            state.avatar = action.payload

        }
    }
})

export const {setName , setAvatar}  = activateSlice.actions
export default activateSlice.reducer