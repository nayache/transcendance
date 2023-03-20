import styled from "styled-components"

//size la width et la height du jeu (doit responsive)

const baseWidth: number = 1920
const baseHeight: number = 960

const percentageWidth: number = 70

// height: ${baseHeight * percentageWidth / baseWidth}%;

export const Container = styled.div`

	position: relative;
	width: ${percentageWidth}%;
	height: 300px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0;
	margin: auto;
`
