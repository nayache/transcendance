export interface IError {
	about: AboutErr,
	type: TypeErr,
	message?: string,
}

export enum AboutErr {
	AUTH,
	TOKEN,
	HEADER,
	SELFUSER,
	USER,
	PSEUDO,
	AVATAR,
	CHANNEL,
	PASSWORD,
	MESSAGE,
	REQUEST,
	TWOFA
}

export enum TypeErr {
	EXPIRED, //token expire
	TIMEOUT, // token cannot resfresh
	NOT_FOUND,
	EMPTY, // parametre vide
	INVALID,
	DUPLICATED,
	REJECTED //exemple: acces denied for join channel
}