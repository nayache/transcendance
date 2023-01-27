import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../Interface/User";
import { RootState } from "../store";

export interface UserProps {
	loading: boolean,
	user?: IUser,
	redirectTo?: string,
	error?: string,
}

interface ThunkProps {
	token?: string,
	body?: BodyInit | null
}

const initialState: UserProps = {
	loading: false
}


const baseOfUrl: string = 'http://localhost:3042/user'
const redirectToRegister: string = '/register';




export const getUserPseudo = createAsyncThunk('user/getPseudo',
async ({token, body}: ThunkProps, { dispatch, getState }) => {
	const url: string = baseOfUrl + '/pseudo';
	let headers: HeadersInit | undefined;
	
	if (token)
		headers = {
			Authorization: `Bearer ${token}`,
			'Content-type': 'application/json; charset=UTF-8'
		}
	else
		headers = undefined;
	let init: RequestInit | undefined = {
		headers
	};
	const res = await fetch(url, init)
	console.log("res = ", res);
	//token update
	if (!res.ok)
		throw new Error(res.status.toString())
	const data = await res.json();
	const { pseudo } = data;
	return {
		...(<RootState>getState()).user,
		pseudo
	}
})

export const patchUserPseudo = createAsyncThunk('user/patchPseudo',
async ({token, body}: ThunkProps, { dispatch, getState }) => {
	const url = baseOfUrl + '/pseudo'
	const method: string = 'PATCH'
	let headers: HeadersInit | undefined;

	if (token)
		headers = {
			Authorization: `Bearer ${token}`,
			'Content-type': 'application/json; charset=UTF-8'
		}
	else
		headers = undefined;
	let init: RequestInit | undefined = {
		method, headers, body
	};
	const res = await fetch(url, init)
	const data = await res.json()
	if ("token" in data && data.token)
		dispatch(userSlice.actions.enableRedirectToRegister())
	if (!res.ok)
		throw new Error(res.status.toString())
	const { pseudo } = data;
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
			state.redirectTo = redirectToRegister
		},
		disableRedirectToRegister: (state) => {
			state.redirectTo = undefined;
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

export const { disableRedirectToRegister } = userSlice.actions;
export default userReducer;