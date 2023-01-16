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

const Baseline: React.FC = () => {

	const [title, setTitle] = useState('Pong')

	const getTitle = () => {
		return (
			<TitleDiv>
				<Title>{title}</Title>
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