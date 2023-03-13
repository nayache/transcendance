export enum AboutErr {
	AUTH,
	TOKEN,
	HEADER,
	USER,
	TARGET,
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