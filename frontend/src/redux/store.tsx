import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import roomReducer from "./channelsSlice";

const reducer = combineReducers({
})

const store = configureStore({
	reducer
})

console.log("initial state = ", store.getState())
store.subscribe(() => console.log(store.getState()))


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export default store;