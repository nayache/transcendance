import React, { useState } from "react";

const User = () => {
	const [ radius, setRadius ] =  useState<number>(5);

	const myFunction = () => {
		
		console.log("click button")
		let radiusCopy: number = radius;
		radiusCopy++;
		setRadius(radiusCopy);
		console.log("radius = ", radius);
	}
}
export default User;