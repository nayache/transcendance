import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import ClientApi from "../../components/ClientApi.class";
import { RootState } from "../store";
import userReducer, { baseOfUrlUser, enableRedirectToSignin } from "./userSlice";

export interface PatchAvatarProps {
	loading: boolean,
	avatar?: File,
	redirectToRegister?: boolean,
	redirectToSignin?: boolean,
	patchAvatarError?: SerializedError,
}

type ThunkPropsAvatar = {
	avatar?: File
};

const initialState: PatchAvatarProps = {
	loading: false,
	avatar: undefined,
}

export const patchUserAvatar = createAsyncThunk('user/patchAvatar',
async ({ avatar }: ThunkPropsAvatar, { getState }) => {
	const endUrl:string = '/avatar'
	const url = baseOfUrlUser + endUrl

	const data = await ClientApi.patch(url, { avatar });
	return data.avatar;
})

const patchAvatarSlice = createSlice({
	name: "getAvatar",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(patchUserAvatar.pending, (state, action) => {
			state.loading = true;
		})
		builder.addCase(patchUserAvatar.fulfilled, (state, action) => {
			state.loading = false;
			state.avatar = action.payload
		})
		builder.addCase(patchUserAvatar.rejected, (state, action) => {
			state.loading = false;
			state.patchAvatarError = action.error
		})
	},
})

const patchAvatarReducer = patchAvatarSlice.reducer
export default patchAvatarReducer;