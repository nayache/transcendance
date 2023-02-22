import Navbar from "./Navbar";
import '../styles/TwoFASettings.css'
import '../styles/Toggle.css'
import React, { useEffect, useRef, useState } from "react";
import { FiTriangle } from "react-icons/fi"
import Modal from "./Modal";
import EnableTwoFaSettings from "./EnableTwoFASettings";
import ClientApi from "./ClientApi.class";
import { API_TWOFA_ROUTE } from "../constants/RoutesApi";

let differenceHeight: number = 0;

const TwoFASettings = () => {

	return (
		<div>
			<Navbar />
			<EnableTwoFaSettings />
		</div>
	)
}

export default TwoFASettings