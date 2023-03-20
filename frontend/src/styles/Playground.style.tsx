import styled from "styled-components"

//size la width et la height du jeu (doit responsive)

const baseWidth: number = 1920
const baseHeight: number = 1344

const percentageWidth: number = 70

// height: ${baseHeight * percentageWidth / baseWidth}%;

export const Container = styled.div`

	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0;
	margin: auto;
`
