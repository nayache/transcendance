import FileResizer from 'react-image-file-resizer'
import { io, Socket } from 'socket.io-client';
import { AboutErr, IError, TypeErr } from "../constants/EError";
import { BASE_URL, API_BASE_AUTH, REGISTER_ROUTE, SIGNIN_ROUTE, API_VERIFY_TOKEN_ROUTE, API_TOKEN_ROUTE, API_SOCKET_URL } from "../constants/RoutesApi";


class ClientApi {

	private static readonly keyTokenLocalStorage: string = 'token';
	public static readonly registerApiRoute: string = API_BASE_AUTH;
	public static readonly registerRoute: string = REGISTER_ROUTE;
	public static readonly registerEndpoint: string = '/register';
	public static readonly signinRoute: string = SIGNIN_ROUTE;


	public static get token(): string | null {
		return localStorage.getItem(ClientApi.keyTokenLocalStorage);
	}

	private static set token(token: string | null) {
		if (!token)
			return ;
		localStorage.setItem(ClientApi.keyTokenLocalStorage, token);
	}

	public static set redirect(redirect: URL) {
		const rawUrlParameters: string = window.location.search;
		const cleanUrlParameters: URLSearchParams = new URLSearchParams(rawUrlParameters);
		
		if (ClientApi.redirect.href == redirect.href
		|| (redirect.pathname.indexOf(ClientApi.registerEndpoint) === 0
		&& cleanUrlParameters.has('code')))
			return;
		window.location.href = redirect.href;
	}

	public static get redirect(): URL {
		return new URL(window.location.href);
	}

	public static async getBlobFromImgSrc(filename: string, imgSrc: string) {
		const res = await fetch(imgSrc)
		const blob = await res.blob()
		// const file = new File([blob], filename + '.png', blob)
		return blob
	}

	public static async getFileFromImgSrc(filename: string, imgSrc: string) {
		const res = await fetch(imgSrc)
		const blob = await res.blob()
		const file = new File([blob], filename + '.png', blob)
		return file
	}
	
	public static resizeFile(file: Blob) {
		return new Promise((resolve) => {
		FileResizer.imageFileResizer(
			file,
			300,
			300,
			"JPEG",
			100,
			0,
			(uri) => {
			resolve(uri);
			},
			"base64"
		);
		})
	}

	private static doRedirectToRegister(err: IError) {
		return (
			(err.about == AboutErr.TOKEN && err.type == TypeErr.TIMEOUT)
			|| (err.about == AboutErr.HEADER && err.type == TypeErr.INVALID)
			|| (err.about == AboutErr.USER && err.type == TypeErr.NOT_FOUND)
		)
	}

	private static doRedirectToSignin(err: IError) {
		return (err.about == AboutErr.PSEUDO && err.type == TypeErr.NOT_FOUND)
	}

	private static async fetchEndpoint(url: string, init?: RequestInit | undefined): Promise<any> {
		console.log("------- Bienvenue dans fetchEndPoint -------");
		const res = await fetch(url, init);
		const data: any = await res.json();
		console.log("data = ", data);
		if (!res.ok)
		{
			const err = data.error
			console.log("data.error = ", data.error)
			if (this.doRedirectToRegister(data.error))
			{
				ClientApi.redirect = new URL(ClientApi.registerRoute)
				throw err;
			}
			else if (this.doRedirectToSignin(data.error))
			{
				ClientApi.redirect = new URL(ClientApi.signinRoute)
				throw err;
			}
			else if (err.about == AboutErr.TOKEN && err.type == TypeErr.EXPIRED)
			{
				try {
					const res = await fetch(API_TOKEN_ROUTE, {
						headers: {
							Authorization: `Refresh ${ClientApi.token}`,
						}
					})
					const data: any = await res.json();
					console.log("data dans expired = ", data);
					if (data.error)
					{
						if (this.doRedirectToRegister(data.error))
						{
							ClientApi.redirect = new URL(ClientApi.registerRoute)
							throw data.error;
						}
						throw data.error;
					}
					ClientApi.token = data.token
					if (!init)
						init = {}
					if (!init?.headers)
						init.headers = {}
					const data2ndChance = await ClientApi.fetchEndpoint(url, {...init,
						headers: {...init.headers,
							Authorization: `Bearer ${ClientApi.token}`,
						}
					});
					return data2ndChance;
				} catch (err) {
					console.log("avant de throw ici")
					throw err;
				}
			}
			console.log("avant de throw")
			throw data.error;
		}
		return data
	}

	public static async verifyToken(): Promise<true> {
		const endOfEndpoint: string = '/verify';
		const url: string = ClientApi.registerApiRoute + endOfEndpoint;
		let headers: HeadersInit | undefined;

		if (ClientApi.token)
			headers = {
				Authorization: `Bearer ${ClientApi.token}`,
			}
		const data: any = await ClientApi.fetchEndpoint(url, { headers });
		return (true);
	}
	
	public static async register(callback: () => unknown, code: string | null, twofa: string | null = null) {
		let path: string = 'register';

		if (!code)
			throw new Error('The code does not exist');
		if (!ClientApi.registerApiRoute)
			throw new Error('The endpoint to the register fetch api is not specified')
		if (code)
		{
			if (twofa)
				path = 'twofa';
			const data = await ClientApi.post(
				ClientApi.registerApiRoute, JSON.stringify({
					code,
					digit: twofa,
					path
			}), 'application/json');
			if (!data.token)
				throw new Error('Did not receive the token from api');
			ClientApi.token = data.token;
			return callback();
		}
	}
	
	public static disconnect () {
		localStorage.removeItem(ClientApi.keyTokenLocalStorage);
	}

	public static async get(url: string): Promise<any> {

		let headers: HeadersInit | undefined;

		if (ClientApi.token)
			headers = {
				Authorization: `Bearer ${ClientApi.token}`,
				// 'Content-type': 'application/json; charset=UTF-8'
			}
		else
			headers = undefined;
		let init: RequestInit | undefined = {
			headers
		};
		const data: any = await ClientApi.fetchEndpoint(url, init);
		return (data);
	}

	
	public static async patch(url: string, body?: BodyInit | null, contentType?: string): Promise<any> {

		const method: string = 'PATCH'
		const headers: HeadersInit = {};
	
		if (ClientApi.token)
			headers['Authorization'] = `Bearer ${ClientApi.token}`
		if (contentType)
			headers["Content-Type"] = contentType
		let init: RequestInit | undefined = {
			method, headers, body
		};
		const data: any = await ClientApi.fetchEndpoint(url, init)
		return (data);
	}
	
	public static async post(url: string, body?: BodyInit | null, contentType?: string): Promise<any> {
		
		const method: string = 'POST'
		let headers: HeadersInit = {};
		
		if (ClientApi.token)
			headers['Authorization'] = `Bearer ${ClientApi.token}`
		if (contentType)
			headers["Content-Type"] = contentType
		let init: RequestInit | undefined = {
			method, headers, body
		};
		const data: any = await ClientApi.fetchEndpoint(url, init)
		return (data);
	}
	
	public static async delete(url: string): Promise<any> {
		
		const method: string = 'DELETE'
		let headers: HeadersInit = {};
		
		if (ClientApi.token)
			headers['Authorization'] = `Bearer ${ClientApi.token}`
		let init: RequestInit | undefined = {
			method, headers
		};
		const data: any = await ClientApi.fetchEndpoint(url, init)
		return (data);
	}
}

export default ClientApi;