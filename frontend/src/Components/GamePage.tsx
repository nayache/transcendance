import React, { useState } from "react"
import Background from './Background'
import Baseline from "./Baseline";
import Playground from "./Playground";
import { getPrivateDOMElements } from '../Functions/Token_utils'
import styled from "styled-components";

const GamePage: React.FC = () => {

	return getPrivateDOMElements (
		<React.Fragment>
			<Background />
			<Baseline />
			<Playground />
		</React.Fragment>
	)
}
export default GamePage;