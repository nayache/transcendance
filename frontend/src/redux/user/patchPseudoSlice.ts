import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import ClientApi from "../../components/ClientApi.class";
import { RootState } from "../store";
import userReducer, { baseOfUrlUser, enableRedirectToSignin } from "./userSlice";

export interface PatchPseudoProps {
	loading: boolean,
	pseudo?: string,
	redirectToRegister?: boolean,
	redirectToSignin?: boolean,
	patchPseudoError?: SerializedError,
}

type ThunkPropsPseudo = {
	pseudo?: string
};

const initialState: PatchPseudoProps = {
	loading: false,
	pseudo: undefined,
}

export const patchUserPseudo = createAsyncThunk('user/patchPseudo',
async ({ pseudo }: ThunkPropsPseudo, { getState }) => {
	const endUrl:string = '/pseudo'
	const url = baseOfUrlUser + endUrl

	const data = await ClientApi.patch(url, JSON.stringify({ pseudo }));
	return data.pseudo;
})

const patchPseudoSlice = createSlice({
	name: "getPseudo",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(patchUserPseudo.pending, (state, action) => {
			state.loading = true;
		})
		builder.addCase(patchUserPseudo.fulfilled, (state, action) => {
			state.loading = false;
			state.pseudo = action.payload
		})
		builder.addCase(patchUserPseudo.rejected, (state, action) => {
			state.loading = false;
			state.patchPseudoError = action.error
		})
	},
})

const patchPseudoReducer = patchPseudoSlice.reducer
export default patchPseudoReducer;