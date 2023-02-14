import React from "react";

interface Props {
	bgcolor: string,
	completed: number
}

const ProgressBar = ({ bgcolor, completed }: Props) => {

	const containerStyles = {
		height: 20,
		width: '100%',
		backgroundColor: "#e0e0de",
		borderRadius: 50,
		marginTop: 5,
		marginBottom: 5
	}

	const fillerStyles = {
		height: '100%',
		width: `${completed}%`,
		backgroundColor: bgcolor,
		borderRadius: 'inherit',
		textAlign: 'right' as "right"
	}

	const labelStyles = {
		padding: 5,
		color: 'white',
		fontWeight: 'bold'
	}

	return (
		<div style={containerStyles}>
			<div style={fillerStyles}>
			<span style={labelStyles}>{`${completed}%`}</span>
			</div>
		</div>
	);
};

export default ProgressBar;