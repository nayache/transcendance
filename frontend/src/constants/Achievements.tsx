import FirstWin from '../img/firstwin.png'
import CleanSheet from '../img/cleansheet.jpg'
import PongMaster from '../img/pongmaster.png'

type TAchievement = "First Win" | "Clean Sheet" | "PONG MASTER";

export interface IDisplayAchievement {
	img: string,
	name: TAchievement,
	content?: string,
}

export const DisplayAchievements: IDisplayAchievement[] = [
	{
		name: "First Win",
		img: FirstWin
	},
	{
		name: "Clean Sheet",
		img: CleanSheet
	},
	{
		name: "PONG MASTER",
		img: PongMaster
	},
]