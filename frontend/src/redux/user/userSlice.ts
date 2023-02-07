import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import ClientApi from '../../components/ClientApi.class';
import { IUser } from '../../interface/User';
import { AppDispatch, RootState } from '../store';

export interface UserProps {
	loading: boolean,
	redirectToRegister?: boolean,
	redirectToSignin?: boolean,
	userError?: SerializedError,
}

type ThunkPropsPseudo = IUser

const initialState: UserProps = {
	loading: false
}


export const baseOfUrlUser: string = 'http://localhost:3042/user'


const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		enableRedirectToRegister: (state) => {
			console.log("state.redirectToRegister = ", state.redirectToRegister);
			state.redirectToRegister = true;
			console.log('on vient d\'enable');
			console.log("state.redirectToRegister = ", state.redirectToRegister);
		},
		disableRedirectToRegister: (state) => {
			state.redirectToRegister = false;
		},
		enableRedirectToSignin: (state) => {
			console.log("state.redirectToSignin = ", state.redirectToSignin);
			state.redirectToSignin = true;
			console.log('on vient d\'enable');
			console.log("state.redirectToSignin = ", state.redirectToSignin);
		},
		disableRedirectToSignin: (state) => {
			state.redirectToSignin = false;
		}
	},
})
const userReducer = userSlice.reducer;

export const { enableRedirectToRegister, disableRedirectToRegister, enableRedirectToSignin, disableRedirectToSignin } = userSlice.actions;
export default userReducer;