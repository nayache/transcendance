import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import ClientApi from "../../components/ClientApi.class";
import { RootState } from "../store";

export interface TwoFaProps {
	loading: boolean,
	isGood?: true,
	getTwoFaStatusCode?: number,
	getTwoFaError?: SerializedError,
}

const initialState: TwoFaProps = {
	loading: false,
	isGood: undefined,
}

export const getTwoFa = createAsyncThunk("/user/getTwoFa", async (undefined, { getState }) => {
	// await ClientApi.post('/generate')
	// // if throw an error isGood will stay undefined
	// const isGood: true = true;
	// return isGood;
})

const getTwoFaSlice = createSlice({
	name: "getTwoFa",
	initialState,
	reducers: {},
	extraReducers(builder) {
		// builder.addCase(getTwoFa.pending, (state, action) => {
		// 	state.loading = true;
		// })
		// builder.addCase(getTwoFa.fulfilled, (state, action) => {
		// 	state.loading = false;
		// 	state.isGood = action.payload
		// })
		// builder.addCase(getTwoFa.rejected, (state, action) => {
		// 	state.loading = false;
		// 	state.getTwoFaError = action.error
		// })
	},
})

const getTwoFaReducer = getTwoFaSlice.reducer
export default getTwoFaReducer;