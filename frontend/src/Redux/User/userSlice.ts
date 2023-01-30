import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ClientApi from "../../Components/ClientApi.class";
import { IUser } from "../../Interface/User";
import { AppDispatch, RootState } from "../store";

export interface UserProps {
	loading: boolean,
	user?: IUser,
	redirectToRegister?: boolean,
	error?: string,
}

interface ThunkProps {
	body?: BodyInit | null
}

const initialState: UserProps = {
	loading: false
}


const baseOfUrl: string = 'http://localhost:3042/user'
const redirectToRegister: string = '/register';



export const verify = createAsyncThunk('user/verify',

)

export const getUserPseudo = createAsyncThunk('user/getPseudo',
async (undefined, { getState }) => {
	const url: string = baseOfUrl + '/pseudo';

	const data = await ClientApi.get(url);
	const { pseudo } = data;
	return {
		...(<RootState>getState()).user,
		pseudo
	}
})

export const patchUserPseudo = createAsyncThunk('user/patchPseudo',
async ({body}: ThunkProps, { getState }) => {
	const url = baseOfUrl + '/pseudo'
	
	const { pseudo } = await ClientApi.patch(url, body);
	return {
		...(<RootState>getState()).user,
		pseudo
	}
})

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
		}
	},
	extraReducers(builder) {
		builder.addCase(getUserPseudo.pending, (state, action) => {
			state.loading = true;
		})
		builder.addCase(getUserPseudo.fulfilled, (state, action) => {
			state.loading = false;
			state.user = action.payload
		})
		builder.addCase(getUserPseudo.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message
		})
		builder.addCase(patchUserPseudo.pending, (state, action) => {
			state.loading = true;
		})
		builder.addCase(patchUserPseudo.fulfilled, (state, action) => {
			state.loading = false;
			state.user = action.payload
		})
		builder.addCase(patchUserPseudo.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message
		})
		
	},
})
const userReducer = userSlice.reducer;

export const { enableRedirectToRegister, disableRedirectToRegister } = userSlice.actions;
export default userReducer;