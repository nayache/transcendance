import React, { useEffect, useRef } from 'react'
import { CanvasStyled } from '../Styles/Canvas.style'

type MyProps = {
	draw: (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, canvasPosY: number) => void;
}
type Props = React.ComponentPropsWithoutRef<'canvas'> & MyProps


const Canvas = ({draw, ...rest}: Props) => {
	
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas)
			return ;
		canvas.width = canvas.offsetWidth; // quand on size le canvas avec ces variables, le canvas gere bien les pixels
		canvas.height = canvas.offsetHeight; // il suffit d'enlever pour voir comment ca rend
		let context = canvas.getContext('2d');
		if (!context)
			return ;
		console.log("canvas.getBoundingClientRect().top = ", canvas.getBoundingClientRect().top, "  canvas.getBoundingClientRect().y = ", canvas.getBoundingClientRect().y)
		draw(context, canvas.width, canvas.height, canvas.getBoundingClientRect().top);
	}, [canvasRef, draw])

	return (
		<CanvasStyled ref={canvasRef} {...rest} />
	)
}
export default Canvas;