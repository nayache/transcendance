import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../Interface/User";
import { RootState } from "../store";

interface Props {
	loading: boolean,
	user?: IUser,
	error?: string,
}

interface ThunkProps {
	token?: string,
	body?: BodyInit | null
}

const initialState: Props = {
	loading: false
}


const baseOfUrl = 'http://localhost:3042/user'


export const getUserPseudo = createAsyncThunk('user/getPseudo',
async ({token, body}: ThunkProps, { getState }) => {
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
	if (!res.ok)
		throw new Error(res.status.toString())
	const { pseudo } = await res.json()
	return {
		...(<RootState>getState()).user,
		pseudo
	}
})

export const patchUserPseudo = createAsyncThunk('user/patchPseudo',
async ({token, body}: ThunkProps, { getState }) => {
	const urlq = baseOfUrl + '/pseudo'
	const url = 'https://jsonplaceholder.typicode.com/posts/1'
	const method: string = 'PUT'
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
	console.log("res = ", res);
	if (!res.ok)
		throw new Error(res.status.toString())
	const { pseudo } = await res.json()
	return {
		...(<RootState>getState()).user,
		pseudo
	}
})

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
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

export const userActions = userSlice.actions;
export default userReducer;