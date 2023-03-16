export enum Relation {
	UNKNOWN,
	PENDING,
	FRIEND
}

export interface IUser {
	pseudo?: string,
	avatar?: string
}
