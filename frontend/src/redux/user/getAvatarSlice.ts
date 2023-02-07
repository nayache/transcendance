import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import ClientApi from "../../components/ClientApi.class";
import { RootState } from "../store";
import userReducer, { baseOfUrlUser, enableRedirectToSignin } from "./userSlice";

export interface GetAvatarProps {
	loading: boolean,
	avatar?: File,
	getAvatarStatusCode?: number,
	getAvatarError?: SerializedError,
}

const initialState: GetAvatarProps = {
	loading: false,
	avatar: undefined,
}

export const getUserAvatar = createAsyncThunk('user/getAvatar',
async (undefined, { dispatch }) => {
	const endUrl: string = '/avatar'
	const url: string = baseOfUrlUser + endUrl;

	try {
		const data = await ClientApi.get(url);
		const { avatar } = data;
		return avatar;
	} catch (e) {
		const err: Error = <Error>e;

		if (err.name == '404')
			dispatch(enableRedirectToSignin());
		throw new Error(err.message);
	}
})

const getAvatarSlice = createSlice({
	name: "getAvatar",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(getUserAvatar.pending, (state, action) => {
			state.loading = true;
		})
		builder.addCase(getUserAvatar.fulfilled, (state, action) => {
			state.loading = false;
			state.avatar = action.payload
		})
		builder.addCase(getUserAvatar.rejected, (state, action) => {
			state.loading = false;
			state.getAvatarError = action.error
		})
	},
})

const getAvatarReducer = getAvatarSlice.reducer
export default getAvatarReducer;