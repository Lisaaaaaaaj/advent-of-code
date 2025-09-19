const directions: { [key: string]: [number, number] } = {
	'^': [-1, 0],
	'>': [0, 1],
	v: [1, 0],
	'<': [0, -1],
};

const grid = new Array(4000).fill('.').map(() => new Array(4000).fill('.'));
let position = [grid.length / 2, grid.length / 2];

const visitedHouses = new Set();
visitedHouses.add(`${[grid.length / 2, grid.length / 2]}`);

[...realData.split('')].forEach((dir) => {
	const nextPos = [position[0] + directions[dir][0], position[1] + directions[dir][1]];

	visitedHouses.add(`${nextPos}`);
	position = nextPos;
});

const ans = visitedHouses.size;

console.log(ans);
