import FirstWin from '../img/firstwin.png'
import CleanSheet from '../img/cleansheet.jpg'
import PongMaster from '../img/pongmaster.png'

type TAchievement = "FirstWin" | "CleanSheet" | "PONG-MASTER";

export interface IDisplayAchievement {
	img: string,
	name: TAchievement,
	content?: string,
}

export const DisplayAchievements: IDisplayAchievement[] = [
	{
		name: "FirstWin",
		img: FirstWin
	},
	{
		name: "CleanSheet",
		img: CleanSheet
	},
	{
		name: "PONG-MASTER",
		img: PongMaster
	},
]