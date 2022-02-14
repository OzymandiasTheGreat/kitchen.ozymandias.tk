import React, {
	useEffect,
	useRef,
	CanvasHTMLAttributes,
	useState,
} from "react";
import { useWindowDimensions } from "react-native";

class Tiles {
	img: HTMLImageElement;
	canvas: HTMLCanvasElement | null;
	color: string;
	tile: HTMLCanvasElement;
	patternOne: CanvasPattern;
	patternTwo: CanvasPattern;
	drawing = true;
	now = Date.now();
	yOne = 0;
	yTwo = 0;

	constructor(
		img: HTMLImageElement,
		canvas: HTMLCanvasElement | null,
		color: string,
	) {
		this.img = img;
		this.canvas = canvas;
		this.color = color;
		this.tile = document.createElement("canvas");
		this.tile.width = this.img.width * 3;
		this.tile.height = this.img.height;

		const ctx: CanvasRenderingContext2D = this.tile.getContext(
			"2d",
		) as CanvasRenderingContext2D;
		ctx.drawImage(this.img, this.img.width * 1.5, 0);
		this.patternOne = this.ctx?.createPattern(this.tile, "repeat") as any;
		this.patternTwo = this.ctx?.createPattern(this.tile, "repeat") as any;
	}

	get ctx(): CanvasRenderingContext2D | null | undefined {
		return this.canvas?.getContext("2d");
	}

	get width(): number | undefined {
		return this.canvas?.width;
	}

	get height(): number | undefined {
		return this.canvas?.height;
	}

	destroy(): void {
		this.drawing = false;
		this.canvas = null;
	}

	draw(): void {
		if (Date.now() - this.now > 64 && this.ctx) {
			this.ctx.fillStyle = this.color;
			this.ctx.fillRect(
				0,
				0,
				(this.width || 0) * 3,
				(this.height || 0) * 3,
			);
			this.ctx.save();
			this.ctx.globalAlpha = 0.5;
			this.ctx.transform(
				0.71,
				0.71,
				-0.71,
				0.71,
				(this.width || 0) * 0.38,
				-(this.height || 0) * 1.45,
			);
			this.patternOne.setTransform(
				new DOMMatrix([
					1,
					0,
					0,
					1,
					this.width || 0,
					(this.height || 0) + (this.yOne += 1),
				]),
			);
			if (this.yOne >= 48) {
				this.yOne = 0;
			}
			this.ctx.fillStyle = this.patternOne;
			this.ctx.fillRect(
				0,
				0,
				(this.width || 0) * 5,
				(this.height || 0) * 5,
			);
			this.patternTwo.setTransform(
				new DOMMatrix([
					-1,
					0,
					0,
					-1,
					(this.width || 0) + this.img.width * 2.5,
					(this.height || 0) - (this.yTwo += 1),
				]),
			);
			if (this.yTwo >= 48) {
				this.yTwo = 0;
			}
			this.ctx.fillStyle = this.patternTwo;
			this.ctx.fillRect(
				0,
				0,
				(this.width || 0) * 5,
				(this.height || 0) * 5,
			);
			this.ctx.restore();
			this.now = Date.now();
		}
		if (this.drawing) {
			window.requestAnimationFrame(() => this.draw());
		}
	}
}

const TileBackground: React.FC<{ src: string; color: string }> = ({
	children,
	src,
	color,
	...props
}) => {
	const canvas = useRef<HTMLCanvasElement>(null);
	const { width, height } = useWindowDimensions();
	const [img, setImg] = useState<HTMLImageElement>();

	useEffect(() => {
		const i = new Image();
		i.onload = () => setImg(i);
		i.src = src;
	}, [src]);
	useEffect(() => {
		if (canvas.current) {
			canvas.current.width = width;
			canvas.current.height = height;

			let tiles: Tiles;
			if (img) {
				tiles = new Tiles(img, canvas.current, color);
				tiles.draw();
			}
			return () => tiles?.destroy();
		}
	}, [color, img, width, height]);

	return (
		<>
			<canvas
				ref={canvas}
				width="100%"
				height="2560px"
				style={styles.canvas}></canvas>
			{children}
		</>
	);
};

const styles = {
	canvas: {
		position: "fixed",
		top: 0,
		left: 0,
		"z-index": -1000,
	},
} as { canvas: CanvasHTMLAttributes<HTMLCanvasElement> };

export default TileBackground;
