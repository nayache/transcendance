export enum Relation {
	UNKNOWN,
	PENDING,
	FRIEND
}

export interface IUser {
	pseudo?: string,
	avatar?: string
}


// "profile": {
// 	"avatar": null,
// 	"pseudo": "KOPER",
// 	"friends": 0,
// 	"level": 1,
// 	"xp": 400,
// 	"requiredXp": 1050,
// 	"percentageXp": 38.095238095238095,
// 	"achievements": [],
// 	"wins": 2,
// 	"looses": 2,
// 	"history": [
// 		{
// 			"id": "8d743062-d288-4e6b-8ca0-76e739d518fc",
// 			"ranked": false,
// 			"difficulty": "hard",
// 			"player1": "NARUTO",
// 			"player2": "KOPER",
// 			"score1": 0,
// 			"score2": 42,
// 			"forfeit": true,
// 			"xp1": 0,
// 			"xp2": 200,
// 			"date": "2023-03-16T00:04:41.023Z"
// 		},
// 		{
// 			"id": "9f8f2768-a527-4e40-8995-bc29652bcf7b",
// 			"ranked": true,
// 			"difficulty": "hard",
// 			"player1": "NARUTO",
// 			"player2": "KOPER",
// 			"score1": 42,
// 			"score2": 0,
// 			"forfeit": true,
// 			"xp1": 200,
// 			"xp2": 0,
// 			"date": "2023-03-16T00:05:42.833Z"
// 		}
// 	]
// }
// }