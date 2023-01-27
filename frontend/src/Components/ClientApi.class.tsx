import { useDispatch, useSelector } from "react-redux";
import { disableRedirectToRegister, enableRedirectToRegister, UserProps } from '../Redux/User/userSlice';
import { AppDispatch, RootState } from "../Redux/store";

export const REGISTERAPIROUTE = 'http://localhost:3042/auth'
export const REGISTERROUTE = '/register'

class ClientApi {

	private static readonly keyTokenLocalStorage: string = 'token';
	public static readonly registerApiRoute: string | undefined = REGISTERAPIROUTE;
	public static readonly registerRoute: string | undefined = REGISTERROUTE;
	private static _dispatch?: AppDispatch;
	private static _reduxUser?: UserProps;

	public static set dispatch(dispatch: AppDispatch) {
		ClientApi._dispatch = dispatch;
	}

	public static get dispatch() {
		if (!ClientApi._dispatch)
			throw new Error('The dispatch in ClientApi have not been set up')
		return ClientApi._dispatch;
	}

	public static set reduxUser(reduxUser: UserProps) {
		ClientApi._reduxUser = reduxUser;
	}
	
	public static get reduxUser() {
		if (!ClientApi._reduxUser)
			throw new Error('The redux user state in ClientApi have not been set up')
		return ClientApi._reduxUser;
	}

	public static get token(): string | null {
		return localStorage.getItem(ClientApi.keyTokenLocalStorage);
	}

	private static set token(token: string | null) {
		if (!token)
			return ;
		localStorage.setItem(ClientApi.keyTokenLocalStorage, token);
	}

	public static set redirect(redirect: string) {
		if (redirect == ClientApi.registerRoute || redirect == `http://localhost:3000${ClientApi.registerRoute}`)
			ClientApi.dispatch(disableRedirectToRegister());
		window.location.href = redirect;
	}

	public static get redirect(): string {
		return window.location.href;
	}

	public static async register(code: string | null, location: string = '/') {

		if (!code)
			throw new Error('The code does not exist');
		if (!ClientApi.registerApiRoute)
			throw new Error('The endpoint to the register fetch api is not specified')
		if (code)
		{
			const paramEndpoint: string = '?code=' + code;

			const res: Response = await fetch(ClientApi.registerApiRoute + paramEndpoint);
			const data = await res.json();
			if (!data.token)
				throw new Error('Did not receive the token from api');
			ClientApi.token = data.token;
			ClientApi.redirect = location;
		}
	}

	private static async fetchEndpoint(url: string, init?: RequestInit | undefined) {
		const res = await fetch(url, init);
		const data: any = await res.json();
		if ("token" in data && !data.token)
			ClientApi.dispatch(enableRedirectToRegister())
		else if ("token" in data && data.token)
			ClientApi.token = data.token;
		if (!res.ok)
			throw new Error(res.status.toString())
		return data;
	}

	public static async get(url: string): Promise<any> {

		let headers: HeadersInit | undefined;

		if (ClientApi.token)
			headers = {
				Authorization: `Bearer ${ClientApi.token}`,
				'Content-type': 'application/json; charset=UTF-8'
			}
		else
			headers = undefined;
		let init: RequestInit | undefined = {
			headers
		};
		const data: any = await ClientApi.fetchEndpoint(url, init);
		return (data);
	}

	public static async patch(url: string, body: BodyInit | null | undefined): Promise<any> {
		const method: string = 'PATCH'
		let headers: HeadersInit | undefined;
	
		if (ClientApi.token)
			headers = {
				Authorization: `Bearer ${ClientApi.token}`,
				'Content-type': 'application/json; charset=UTF-8'
			}
		else
			headers = undefined;
		let init: RequestInit | undefined = {
			method, headers, body
		};
		const data: any = ClientApi.fetchEndpoint(url, init)
		return (data);
	}
}

export default ClientApi;