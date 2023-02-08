import React, { useState, useRef, useEffect } from 'react'
import { Container } from '../styles/Playground.style'
import Canvas from './Canvas'
import Paddle from './Paddle.class'
import Ball from './Ball.class'
import Referee from './Referee.class'
import Drawer from './Drawer.class'
import Player, { PlayerSide } from './Player.class'

const MAX_GOALS: number = 4;

interface Props {
}

const Playground = () => {

	const paddle_left: Paddle = new Paddle(
		undefined,
		110,
		"blue"
	)
	const player_left: Player = new Player(PlayerSide.Left, paddle_left)
	const paddle_right: Paddle = new Paddle(
		undefined,
		110,
		"red"
	)
	const player_right: Player = new Player(PlayerSide.Right, paddle_right)
	const ball: Ball = new Ball(
		50,
		"grey",
	)
	const ref: Referee = new Referee(
		[player_left, player_right],
		ball,
		MAX_GOALS
	)
	const drawer: Drawer = new Drawer(ref)
	
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