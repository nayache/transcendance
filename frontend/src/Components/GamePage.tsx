import React, { useState } from "react"
import Playground from "./Playground";
import Background from './Background'
import styled from "styled-components";

const GamePage: React.FC = () => {

	return (
		<React.Fragment>
			<Background />
			{/* { getTitle() } */}
			<Playground />
		</React.Fragment>
	)
}
export default GamePage;