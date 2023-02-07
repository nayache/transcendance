import { useDispatch, useSelector } from "react-redux";
import { UserProps, enableRedirectToRegister } from '../redux/user/userSlice';
import { AppDispatch, RootState } from '../redux/store';
import FileResizer from 'react-image-file-resizer'
import axios from "axios";

export const REGISTERAPIROUTE: string = 'http://localhost:3042/auth'
export const REGISTERROUTE: string = '/register'
export const SIGNINROUTE: string = '/signin'

class ClientApi {

	private static readonly keyTokenLocalStorage: string = 'token';
	public static readonly registerApiRoute: string = REGISTERAPIROUTE;
	public static readonly registerRoute: string = REGISTERROUTE;
	public static readonly signinRoute: string = SIGNINROUTE;
	/*
	private static _dispatch?: AppDispatch;

	public static set dispatch(dispatch: AppDispatch) {
		ClientApi._dispatch = dispatch;
	}

	public static get dispatch() {
		if (!ClientApi._dispatch)
			throw new Error('The dispatch in ClientApi have not been set up')
		return ClientApi._dispatch;
	}
	*/

	public static get token(): string | null {
		return localStorage.getItem(ClientApi.keyTokenLocalStorage);
	}

	private static set token(token: string | null) {
		if (!token)
			return ;
		localStorage.setItem(ClientApi.keyTokenLocalStorage, token);
	}

	public static set redirect(redirect: string) {
		window.location.href = redirect;
	}

	public static get redirect(): string {
		return window.location.href;
	}

	public static async getBlobFromImgSrc(filename: string, imgSrc: string) {
		const res = await fetch(imgSrc)
		const blob = await res.blob()
		// const file = new File([blob], filename + '.png', blob)
		// console.log(file)
		console.log("blob dans formation = ", blob)
		return blob
	}

	public static async getFileFromImgSrc(filename: string, imgSrc: string) {
		const res = await fetch(imgSrc)
		const blob = await res.blob()
		const file = new File([blob], filename + '.png', blob)
		console.log("file dans formation = ", file)
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

	// public static async verifyCode(res: Response) {
	// 	const data: any = await res.json();
	// 	if (!res.ok)
	// 	{
	// 		if (data.statusCode == 401 || "token" in data && !data.token)
	// 		{
	// 			console.log("dans le 2nd if")
	// 			ClientApi.redirect = ClientApi.registerRoute
	// 		}
	// 		else if ("token" in data && data.token)
	// 			ClientApi.token = data.token;
	// 		console.log("avant de throw")
	// 		const error = new Error(data.message);
	// 		error.name = data.statusCode;
	// 		error.message = error.message
	// 		throw error;
	// 	}
	// }
	
	private static async fetchEndpoint(url: string, init?: RequestInit | undefined): Promise<any> {
		const res = await fetch(url, init);
		console.log("res = ", res);
		const data: any = await res.json();
		console.log("data = ", data);
		if (!res.ok)
		{
			if (data.statusCode == 401 || "token" in data && !data.token)
			{
				console.log("dans le 2nd if")
				ClientApi.redirect = ClientApi.registerRoute
			}
			else if ("token" in data && data.token)
			{
				ClientApi.token = data.token;
				ClientApi.redirect = '/'
			}
			console.log("avant de throw")
			const error = new Error(data.message);
			error.name = data.statusCode;
			error.message = error.message
			throw error;
		}
		return data
	}

	public static async verifyToken(): Promise<any> {
		const endOfEndpoint: string = '/verify';
		const url: string = ClientApi.registerApiRoute + endOfEndpoint;
		let headers: HeadersInit | undefined;

		if (ClientApi.token)
			headers = {
				Authorization: `Bearer ${ClientApi.token}`,
			}
		const data: any = await ClientApi.fetchEndpoint(url, { headers });
		return (data);
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

	
	public static async patch(url: string, body: BodyInit | null | undefined, contentType?: string): Promise<any> {

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
	
	public static async post(url: string, body: BodyInit | null | undefined, contentType?: string): Promise<any> {
		
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
}

export default ClientApi;