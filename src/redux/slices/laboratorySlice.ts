import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface laboratoryTypes {
    contactEmail: string;
    contactPhone: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    address: string;
    name: string;
    id: string;
}

const initialState: laboratoryTypes = {
    contactEmail: '',
    contactPhone: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    address: '',
    name: '',
    id: '',
}

const laboratorySlice = createSlice({
    name: "laboratory",
    initialState,
    reducers: {
        setLaboratory: (state, action: PayloadAction<laboratoryTypes>)=> {
            return action.payload;
        },
        updateLaboratory: (state, action: PayloadAction<Partial<laboratoryTypes>>)=> {
            return {...state, ...action.payload};
        },
        clearLaboratory: (state)=> {
            return initialState;
        }
    }
})

export const {setLaboratory, updateLaboratory, clearLaboratory} = laboratorySlice.actions;
export default laboratorySlice.reducer;