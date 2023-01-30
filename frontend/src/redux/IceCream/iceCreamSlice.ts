import { createSlice } from "@reduxjs/toolkit";
import { cakeActions } from "../Cake/CakeSlice";

interface IceCreamProps {
	numOfIceCreams: number
}

const initialState: IceCreamProps = {
	numOfIceCreams: 20
}

const iceCreamSlice = createSlice({
	name: "iceCream",
	initialState,
	reducers: {
		ordered: (state, action) => {
			state.numOfIceCreams -= action.payload
		},
		restocked: (state, action) => {
			state.numOfIceCreams += action.payload
		}
	},
	extraReducers(builder) {
		builder.addCase(cakeActions.ordered, (state, action) => {
			state.numOfIceCreams--;
		})
	},
})
const iceCreamReducer = iceCreamSlice.reducer;

export const iceCreamActions = iceCreamSlice.actions;
export default iceCreamReducer;