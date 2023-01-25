import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../Interface/User";

interface UserProps {
	loading: boolean,
	data?: any,
	error?: string,
}

interface ThunkProps {
	url: string,
	token?: string,
	method?: string,
	body?: any
}

const initialState: UserProps = {
	loading: false
}

export const fetchApi = createAsyncThunk('user/fetchApi',
async ({url, token, method, body}: ThunkProps) => {
	let headers: HeadersInit | undefined;
	if (token)
		headers = {
			Authorization: `Bearer ${token}`
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
	return await res.json()
})

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(fetchApi.pending, (state, action) => {
			state.loading = true;
		})
		builder.addCase(fetchApi.fulfilled, (state, action) => {
			state.loading = false;
			state.data = action.payload
		})
		builder.addCase(fetchApi.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message
		})
	},
})
const userReducer = userSlice.reducer;

export const userActions = userSlice.actions;
export default userReducer;