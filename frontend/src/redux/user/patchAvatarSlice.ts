import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import axios from "axios";
import ClientApi from "../../components/ClientApi.class";
import { RootState } from "../store";
import userReducer, { baseOfUrlUser, enableRedirectToSignin } from "./userSlice";

export interface PatchAvatarProps {
	loading: boolean,
	avatar?: string,
	redirectToRegister?: boolean,
	redirectToSignin?: boolean,
	patchAvatarStatusCode?: number,
	patchAvatarError?: SerializedError,
}

type ThunkPropsAvatar = {
	avatar?: string
};

const initialState: PatchAvatarProps = {
	loading: false,
}

export const patchUserAvatar = createAsyncThunk('user/patchAvatar',
async ({ avatar }: ThunkPropsAvatar, { getState }) => {
	const endUrl:string = '/avatar'
	const url = baseOfUrlUser + endUrl

	if (!avatar)
		throw new Error('The avatar have not been set up which is required to patch user avatar')
	const toSend = new FormData()
	console.log("avatar dans patch = ", avatar)
	console.log("typeof avatar dans patch = ", typeof avatar)
	let file = await ClientApi.getFileFromImgSrc("avatar", avatar)
	file = await (<Promise<File>>ClientApi.resizeFile(file))
	console.log("file = ", file);
	toSend.append("file", file, file.name)
	// axios.defaults.headers.common['Authorization'] = `Bearer ${ClientApi.token}`
	// const res = await axios.patch(url, toSend);
	// const res = await axios.patchForm(url, {
	// 	'file': file.bu
	// },
	// {
	// 	headers: {
	// 		'Authorization': `Bearer ${ClientApi.token}`,
	// 		'Content-Type': 'multipart/form-data'
	// 	}
	// });
	const data = await ClientApi.post(url, toSend);
	return data;
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