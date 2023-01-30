import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ClientApi from '../../components/ClientApi.class';
import { IUser } from '../../interface/User';
import { AppDispatch, RootState } from '../store';

export interface UserProps {
	loading: boolean,
	user?: IUser,
	redirectToRegister?: boolean,
	error?: string,
}

interface ThunkProps {
	body?: BodyInit | null
}

const initialState: UserProps = {
	loading: false
}


const baseOfUrlUser: string = 'http://localhost:3042/user'



export const verifyToken = createAsyncThunk('user/verify', async (undefined, { getState }) => {
	await ClientApi.verifyToken();
	const user: IUser = {
		...(<RootState>getState()).user.user
	}
	return user;
})

export const getUserPseudo = createAsyncThunk('user/getPseudo',
async (undefined, { getState }) => {
	const url: string = baseOfUrlUser + '/pseudo';

	const data = await ClientApi.get(url);
	const { pseudo } = data;
	const user: IUser = {
		...(<RootState>getState()).user.user,
		pseudo
	}
	return user;
})

export const patchUserPseudo = createAsyncThunk('user/patchPseudo',
async ({body}: ThunkProps, { getState }) => {
	const url = baseOfUrlUser + '/pseudo'
	
	const { pseudo } = await ClientApi.patch(url, body);
	const user: IUser = {
		...(<RootState>getState()).user.user,
		pseudo
	}
	return user;
})

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		enableRedirectToRegister: (state) => {
			console.log("state.redirectToRegister = ", state.redirectToRegister);
			state.redirectToRegister = true;
			console.log('on vient d\'enable');
			console.log("state.redirectToRegister = ", state.redirectToRegister);
		},
		disableRedirectToRegister: (state) => {
			state.redirectToRegister = false;
		}
	},
	extraReducers(builder) {
		builder.addCase(getUserPseudo.pending, (state, action) => {
			state.loading = true;
		})
		builder.addCase(getUserPseudo.fulfilled, (state, action) => {
			state.loading = false;
			state.user = action.payload
		})
		builder.addCase(getUserPseudo.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message
		})
		builder.addCase(patchUserPseudo.pending, (state, action) => {
			state.loading = true;
		})
		builder.addCase(patchUserPseudo.fulfilled, (state, action) => {
			state.loading = false;
			state.user = action.payload
		})
		builder.addCase(patchUserPseudo.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message
		})
		builder.addCase(verifyToken.pending, (state, action) => {
			state.loading = true;
		})
		builder.addCase(verifyToken.fulfilled, (state, action) => {
			state.loading = false;
			state.user = action.payload
		})
		builder.addCase(verifyToken.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message
		})
	},
})
const userReducer = userSlice.reducer;

export const { enableRedirectToRegister, disableRedirectToRegister } = userSlice.actions;
export default userReducer;