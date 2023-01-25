import React, { useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import Playground from "./Playground";
import styled from "styled-components";

const GamePage: React.FC = () => {

	return (
		<React.Fragment>
			<Background />
			<Baseline title="Ping pong mais dans gamepage"/>
			<Playground />
		</React.Fragment>
	)
}
export default GamePage;