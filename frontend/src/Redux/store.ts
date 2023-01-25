import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import cakeReducer from "./Cake/CakeSlice";
import iceCreamReducer from "./IceCream/iceCreamSlice";
import userReducer from "./User/userSlice";

const store = configureStore({
	reducer: {
		cake: cakeReducer,
		iceCream: iceCreamReducer,
		user: userReducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;