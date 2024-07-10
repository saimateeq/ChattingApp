import { createSlice } from "@reduxjs/toolkit";

export const UserDataSlice = createSlice({
    name: 'UserData',
    initialState : {
        value : {
            
        }
    },
    reducers: {
        setUserObj: (state, action) => {
            state.value = action.payload
        },
    },
})
export const { setUserObj } = UserDataSlice.actions
export default UserDataSlice.reducer