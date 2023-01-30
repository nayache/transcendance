import { createSlice } from "@reduxjs/toolkit"

export interface CakeProps {
	numOfCakes: number
}

const initialState: CakeProps = {
	numOfCakes: 10
}

const cakeSlice = createSlice({
	name: "cake",
	initialState,
	reducers: {
		ordered: (state, action) => {
			state.numOfCakes--; 
		},
		restocked: (state, action) => {
			state.numOfCakes += action.payload
		}
	}
})
const cakeReducer = cakeSlice.reducer;

export const cakeActions = cakeSlice.actions;
export default cakeReducer;