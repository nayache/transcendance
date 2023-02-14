export interface IError {
	about: AboutErr,
	type: TypeErr,
	message?: string,
}

export enum AboutErr {
	TOKEN,
	HEADER,
	USER,
	PSEUDO,
	AVATAR,
	CHANNEL
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