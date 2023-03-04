import React, { Component } from "react";
import { Status } from "../constants/EMessage";

interface Props {
	image: string,
	status: Status
}

const Avatar = ({ image, status }: Props) => {
	
	return (
		<div className="avatar">
			<div className="avatar-img">
			<img src={image} alt="#" />
			</div>
			<span className={`isOnline`}></span>
		</div>
	);
}

export default Avatar