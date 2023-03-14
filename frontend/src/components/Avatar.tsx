import React, { Component } from "react";
import { Status } from "../constants/EMessage";
import DefaultImg from "../img/avatar2.jpeg"



interface Props {
	srcImg: string | undefined,
}

const Avatar = ({ srcImg }: Props) => {
	
	return (
		<div className="avatar">
			<div className="avatar-img">
				<img src={srcImg ? srcImg : DefaultImg} alt="#" />
			</div>
		</div>
	);
}

export default Avatar