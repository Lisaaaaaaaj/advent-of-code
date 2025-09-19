const workableData = [...realData];

const grid = new Array(1000).fill(0).map(() => new Array(1000).fill(0));

const floodFill = (
	grid: number[][],
	startX: number,
	startY: number,
	endX: number,
	endY: number,
	instruction: string
) => {
	const queue = [[startX, startY]];
	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];
	const seen = new Set();
	seen.add(JSON.stringify([startX, startY]));

	while (queue.length > 0) {
		const [x, y] = queue.shift()!;

		grid[x][y] =
			instruction === 'toggle' ? (grid[x][y] === 0 ? 1 : 0) : instruction === 'turn on' ? 1 : 0;

		for (const [dx, dy] of directions) {
			const newX = x + dx;
			const newY = y + dy;

			if (
				!seen.has(JSON.stringify([newX, newY])) &&
				newX >= startX &&
				newX <= endX &&
				newY >= startY &&
				newY <= endY
			) {
				queue.push([newX, newY]);
				seen.add(JSON.stringify([newX, newY]));
			}
		}
	}
};

workableData.forEach((d) => {
	const [x1, y1, x2, y2] = d
		.trim()
		.match(/[0-9]+/g)!
		.map((dd) => parseInt(dd, 10));
	const instruction = d.trim().match(/turn on|turn off|toggle/g)![0];

	floodFill(grid, x1, y1, x2, y2, instruction);
});

const lightThatAreOn = grid.reduce((acc, d) => {
	let on = 0;

	d.forEach((dd) => (on += dd));

	return (acc += on);
}, 0);

console.log(lightThatAreOn);
