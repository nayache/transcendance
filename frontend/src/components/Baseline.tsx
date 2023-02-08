import React, { useState } from 'react'
import styled from "styled-components";

interface Props {
	title: string
}

const TitleDiv = styled.div`
	position: relative;
	width: fit-content;
	margin: auto;
`

const Title = styled.p`
	position: relative;
	width: fit-content;
	margin: auto;
	font-size: 3rem;
`

interface Props {
	title: string
}

const Baseline: React.FC<Props> = (props: Props) => {

	// const [title, setTitle] = useState('Pong')

	const getTitle = () => {
		return (
			<TitleDiv>
				<Title>{props.title}</Title>
			</TitleDiv>
		)
	}

	return (
		<div>
			{ getTitle() }
		</div>
	)
}
export default Baseline;