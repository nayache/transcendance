export enum AboutErr {
	TOKEN,
	HEADER,
	USER,
	PSEUDO,
	AVATAR
}

export enum TypeErr {
	EXPIRED, //token expire
	TIMEOUT, // token cannot resfresh
	NOT_FOUND,
	EMPTY, // parametre vide
	INVALID,
	DUPLICATED,
}