import { useDispatch, useSelector } from "react-redux";
import { disableRedirectToRegister, UserProps } from '../Redux/User/userSlice';
import { AppDispatch, RootState } from "../Redux/store";

export const REGISTERROUTE = 'http://localhost:3042/auth'

class ClientApi {

	private _redirect: string;
	private _token: string | null;
	private _keyTokenLocalStorage: string;

	constructor(
		private _dispatch: AppDispatch,
		private _user: UserProps,
		private _registerApiRoute: string | undefined = REGISTERROUTE,
		private _registerRoute: string | undefined = '/register'
	) {
		this._redirect = window.location.href;
		this._keyTokenLocalStorage = 'token';
		this._token = localStorage.getItem(this._keyTokenLocalStorage);
	}

	public get registerApiRoute() {
		return this._registerApiRoute;
	}

	public set registerApiRoute(registerApiRoute: string | undefined) {
		this._registerApiRoute = registerApiRoute;
	}

	public get token(): string | null {
		return this._token;
	}

	private set token(token: string | null) {
		this._token = token; // utiliser localstorage
	}
	
	public get registerRoute(): string | undefined {
		return this._registerRoute;
	}

	private set redirect(redirect: string) {
		if (redirect == this.registerRoute)
			this._dispatch(disableRedirectToRegister());
		this._redirect = redirect;
		window.location.href = this._redirect;
	}

	private get redirect(): string {
		return this._redirect;
	}

	public async register(code: string | null, location: string = '/', registerApiRoute?: string) {
		
		if (registerApiRoute)
			this.registerApiRoute = registerApiRoute;		
		if (!code)
			throw new Error('The code does not exist');
		if (!this.registerApiRoute)
			throw new Error('The endpoint to the register fetch api is not specified')
		if (code)
		{
			const paramEndpoint: string = '?code=' + code;

			const res: Response = await fetch(this.registerApiRoute + paramEndpoint);
			const data = await res.json();
			if (!data.token)
				throw new Error('Did not receive the token from api');
			localStorage.setItem(this._keyTokenLocalStorage, data.token);
			this.redirect = location;
		}
	}

	public async get() {

	}
}

export default ClientApi;