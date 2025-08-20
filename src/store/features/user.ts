import { createSlice } from '@reduxjs/toolkit';

interface UserState {
    email?: string;
    accessToken?: string;
    refreshToken?: string;
    roles?: string[];
}

const initialState: UserState = {
    email: '',
    accessToken: undefined,
    refreshToken: undefined,
    roles: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, { payload }) => {
            state.email = payload.email;
            state.accessToken = payload.accessToken;
            state.refreshToken = payload.refreshToken;
            state.roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
        },
        tokenReceived: (state, { payload }) => {
            //console.log({payload})
            if (payload.email) {
                state.email = payload.email;    
            }
            state.accessToken = payload.accessToken;
            state.refreshToken = payload.refreshToken;
            if (payload.roles) {
                state.roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
            }  
        },
        logout: () => initialState
    }
})

export const { login, logout, tokenReceived } = userSlice.actions;
export default userSlice.reducer;