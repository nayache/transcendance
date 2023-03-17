import { Container } from '../styles/Playground.style'
import Canvas from './Canvas'
import PaddleDisplayer from './PaddleDisplayer.class'
import BallDisplayer from './BallDisplayer.class'
import RefereeDisplayer from './RefereeDisplayer.class'
// import DrawerDisplayer from './DrawerDisplayer.class'
import PlayerDisplayer, { PlayerSide } from './PlayerDisplayer.class'
import DrawerDisplayer from './DrawerDisplayer.class'

const MAX_GOALS: number = 4;

interface Props {
}

const Playground = () => {

	const paddle_left: PaddleDisplayer = new PaddleDisplayer(
		undefined,
		110,
		"blue"
	)
	const player_left: PlayerDisplayer = new PlayerDisplayer(PlayerSide.Left, paddle_left)
	const paddle_right: PaddleDisplayer = new PaddleDisplayer(
		undefined,
		110,
		"red"
	)
	const player_right: PlayerDisplayer = new PlayerDisplayer(PlayerSide.Right, paddle_right)
	const ball: BallDisplayer = new BallDisplayer(
		50,
		"grey",
	)
	const ref: RefereeDisplayer = new RefereeDisplayer(
		[player_left, player_right],
		ball,
		MAX_GOALS
	)
	const drawer: DrawerDisplayer = new DrawerDisplayer(ref)
	
	return (
		<Container>
			{/* {isCanvasReady([playgroundWidth, playgroundHeight]) &&
			<Canvas display={gameLoop} id="playground"
			width={playgroundWidth} height={playgroundHeight} />} */}
			<Canvas display={(context, canvasWidth, canvasHeight, canvas) => drawer.gameLoop(context, canvasWidth, canvasHeight, canvas)} id="playground" />
		</Container>
	)
};

export default Playground;