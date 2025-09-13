import { createSlice } from '@reduxjs/toolkit';
import { prodServAPI } from '../services/prodserv';

// Tipo temporal para ProdServ
interface ProdServ {
    id: number;
    tipo: string;
    nombre: string;
    [key: string]: any;
}

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