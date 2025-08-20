import { createSlice } from '@reduxjs/toolkit';
import { ProdServ } from '@/screens/productos/types';
import { prodServAPI } from '../services/prodserv';

interface DataState {
    productos: ProdServ[]
}

const initialState: DataState = {
    productos: []
}

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            prodServAPI.endpoints.getProdServs.matchFulfilled, (state, { payload }) => {
                state.productos = payload?.data ?? [];
            });
    }
})

export default dataSlice.reducer;