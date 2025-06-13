import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface userTypes {
    confirmedEmail: boolean;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    username: string;
    position: string;
    email: string;
    id: string;
}

const initialState: userTypes = {
    confirmedEmail: true,
    createdAt: '',
    updatedAt: '',
    firstName: '',
    lastName: '',
    username: '',
    position: '',
    email: '',
    id: '',
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<userTypes>)=> {
            return action.payload;
        },
        updateUser: (state, action: PayloadAction<Partial<userTypes>>)=> {
            return {...state, ...action.payload};
        },
        clearUser: (state)=> {
            return initialState;
        }
    }
})

export const {setUser, updateUser, clearUser} = userSlice.actions;
export default userSlice.reducer;