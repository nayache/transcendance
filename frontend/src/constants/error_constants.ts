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
}

export enum TypeErr {
	UPDATED,
	EXPIRED,
	NOT_FOUND,
	EMPTY, // parametre vide
	INVALID,
	DUPLICATED,
}