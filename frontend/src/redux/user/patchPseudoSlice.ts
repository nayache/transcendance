import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import ClientApi from "../../components/ClientApi.class";
import { RootState } from "../store";
import userReducer, { baseOfUrlUser, enableRedirectToSignin } from "./userSlice";

export interface PatchPseudoProps {
	loading: boolean,
	pseudo?: string,
	errorMsg?: string,
	patchPseudoStatusCode?: number,
	patchPseudoError?: SerializedError,
}

type ThunkPropsPseudo = {
	pseudo?: string
};

const initialState: PatchPseudoProps = {
	loading: false,
}

export const patchUserPseudo = createAsyncThunk('user/patchPseudo',
async ({ pseudo }: ThunkPropsPseudo, { dispatch, getState }) => {
	const endUrl:string = '/pseudo'
	const url = baseOfUrlUser + endUrl

	try {
		const data = await ClientApi.patch(url, JSON.stringify({ pseudo }));
		console.log("data dans patchPseudo = ", data)
		return data.pseudo;
	} catch (err) {
		dispatch(patchPseudoSlice.actions.setStatusCode((<Error>err).name))
		throw <SerializedError>err
	}
})

const patchPseudoSlice = createSlice({
	name: "getPseudo",
	initialState,
	reducers: {
		setStatusCode: (state, action) => {
			state.patchPseudoStatusCode = action.payload
		}
	},
	extraReducers(builder) {
		builder.addCase(patchUserPseudo.pending, (state, action) => {
			state.loading = true;
			console.log("loading fut a true")
		})
		builder.addCase(patchUserPseudo.fulfilled, (state, action) => {
			state.loading = false;
			console.log("loading fut a false fulfilled")
			state.pseudo = action.payload
		})
		builder.addCase(patchUserPseudo.rejected, (state, action) => {
			state.loading = false;
			console.log("loading fut a false rejected")
			console.log("action.error.name = ", action.error.name);
			console.log("action.error = ", action.error);
			// state.patchPseudoError = {
			// 	name: action.error.name,
			// 	message: action.error.message,
			// 	stack: action.error.stack,
			// }

			// installer un debugger redux pour voir ce qui se passe
			state.errorMsg = action.error.message
			state.patchPseudoError = action.error
			console.log("state.patchPseudoError dans rejected = ", state.patchPseudoError);
		})
	},
})

const patchPseudoReducer = patchPseudoSlice.reducer
export default patchPseudoReducer;