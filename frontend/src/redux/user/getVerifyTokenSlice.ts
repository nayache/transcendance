import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import ClientApi from "../../components/ClientApi.class";
import { RootState } from "../store";

export interface VerifyTokenProps {
	loading: boolean,
	isGood?: true,
	redirectToRegister?: boolean,
	redirectToSignin?: boolean,
	getVerifyTokenError?: SerializedError,
}

const initialState: VerifyTokenProps = {
	loading: false,
	isGood: undefined,
}

export const getVerifyToken = createAsyncThunk("/user/getVerify", async (undefined, { getState }) => {
	await ClientApi.verifyToken();
	// if throw an error isGood will stay undefined
	const isGood: true = true;
	return isGood;
})

const getVerifyTokenSlice = createSlice({
	name: "getVerifyToken",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(getVerifyToken.pending, (state, action) => {
			state.loading = true;
		})
		builder.addCase(getVerifyToken.fulfilled, (state, action) => {
			state.loading = false;
			state.isGood = action.payload
		})
		builder.addCase(getVerifyToken.rejected, (state, action) => {
			state.loading = false;
			state.getVerifyTokenError = action.error
		})
	},
})

const getVerifyTokenReducer = getVerifyTokenSlice.reducer
export default getVerifyTokenReducer;