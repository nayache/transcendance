import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import ClientApi from "../../components/ClientApi.class";
import { RootState } from "../store";
import userReducer, { baseOfUrlUser, enableRedirectToSignin } from "./userSlice";

export interface GetPseudoProps {
	loading: boolean,
	pseudo?: string,
	getPseudoStatusCode?: number,
	getPseudoError?: SerializedError,
}

const initialState: GetPseudoProps = {
	loading: false,
	pseudo: undefined,
}

export const getUserPseudo = createAsyncThunk('user/getPseudo',
async (undefined, { dispatch }) => {
	const endUrl: string = '/pseudo'
	const url: string = baseOfUrlUser + endUrl;

	try {
		const data = await ClientApi.get(url);
		const { pseudo } = data;
		return pseudo;
	} catch (e) {
		const err: Error = <Error>e;

		if (err.name == '404')
			dispatch(enableRedirectToSignin());
		throw new Error(err.name + ': ' + err.message);
	}
})

const getPseudoSlice = createSlice({
	name: "getPseudo",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(getUserPseudo.pending, (state, action) => {
			state.loading = true;
		})
		builder.addCase(getUserPseudo.fulfilled, (state, action) => {
			state.loading = false;
			state.pseudo = action.payload
		})
		builder.addCase(getUserPseudo.rejected, (state, action) => {
			state.loading = false;
			state.getPseudoError = action.error
		})
	},
})

const getPseudoReducer = getPseudoSlice.reducer
export default getPseudoReducer;