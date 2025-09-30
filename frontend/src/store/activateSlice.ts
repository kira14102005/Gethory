import { createSlice } from "@reduxjs/toolkit"
export interface ActivateState {
    name: string | undefined,
    username: string | undefined,
    avatar: string | undefined
}
const initialState: ActivateState =
{
    name: undefined,
    username: undefined,
    avatar: undefined,
}

export const activateSlice = createSlice({
    name: 'activate',
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload
        },
        setUsername: (state, action) => {
            state.username = action.payload
        },
        setAvatar: (state, action) => {
            state.avatar = action.payload

        },
        clearActivate: (state) => {
            state.name = undefined,
                state.username = undefined,
                state.avatar = undefined
        }
    }
})

export const { setName, setUsername, setAvatar, clearActivate } = activateSlice.actions
export default activateSlice.reducer