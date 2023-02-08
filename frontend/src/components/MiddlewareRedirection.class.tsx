import { API_VERIFY_TOKEN_ROUTE } from "../constants/RoutesApi";
import ClientApi from "./ClientApi.class";

class MiddlewareRedirection {

	public static async isTokenOkay(): Promise<true> {
		await ClientApi.get(API_VERIFY_TOKEN_ROUTE) // data empty so we don't care
		return true
	}
	
}

export default MiddlewareRedirection