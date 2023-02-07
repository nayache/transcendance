import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import cakeReducer from "./Cake/CakeSlice";
import iceCreamReducer from "./IceCream/iceCreamSlice";
import userReducer from './user/userSlice';
import getVerifyTokenReducer from './user/getVerifyTokenSlice';
import getPseudoReducer from './user/getPseudoSlice';
import patchPseudoReducer from './user/patchPseudoSlice';
import getAvatarReducer from './user/getAvatarSlice';
import patchAvatarReducer from './user/patchAvatarSlice';

const store = configureStore({
	reducer: {
		cake: cakeReducer,
		iceCream: iceCreamReducer,
		user: userReducer,
		getVerifyToken: getVerifyTokenReducer,
		getPseudo: getPseudoReducer,
		patchPseudo: patchPseudoReducer,
		getAvatar: getAvatarReducer,
		patchAvatar: patchAvatarReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
})

console.log("store.getState().user (initial state) = ", store.getState().user)
store.subscribe(() => console.log("store.getState().user = ", store.getState().user))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;