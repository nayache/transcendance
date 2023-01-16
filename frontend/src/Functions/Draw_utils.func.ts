const drawMiddleLine = (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
	const middleWidth = canvasWidth / 2;
	const lineWidth = canvasWidth / 100;

	context.beginPath();
	context.lineWidth = lineWidth;
	context.setLineDash([20, 15]);
	context.moveTo(middleWidth, 0);
	context.lineTo(middleWidth, canvasHeight);
	context.stroke();
}

export const drawBgnd = (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvasWidth, canvasHeight);
	drawMiddleLine(context, canvasWidth, canvasHeight);
}

export const clearBgnd = (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}