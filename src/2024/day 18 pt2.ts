// 35,61 not the right answer
// 33,61 not the right answer
// 30,15 not the right answer
// 60,51 not the right answer

// 61,50 really... one off . mkay!

const dummyDataGridLength = 7;
const realDataGridLength = 71;

const grid: string[][] = Array.from({ length: realDataGridLength })
	.fill('.')
	.map(() => Array.from({ length: realDataGridLength }).fill('.')) as string[][];

const canWalkReachablePath = () => {
	const queue: [number, number, number[][]][] = [[0, 0, []]];
	const visited: Set<string> = new Set();

	const getValidNeighbors = (x: number, y: number, visited: Set<string>) => {
		const directions = [
			[x + 1, y],
			[x - 1, y],
			[x, y - 1],
			[x, y + 1],
		];
		const validNeighbours = [];

		for (const [i, j] of directions) {
			if (
				i >= 0 &&
				i < realDataGridLength &&
				j >= 0 &&
				j < realDataGridLength &&
				grid[j][i] === '.' &&
				!visited.has(`${i},${j}`)
			) {
				validNeighbours.push([i, j]);
			}
		}

		return validNeighbours;
	};

	while (queue.length > 0) {
		const [x, y, path] = queue.shift()!;

		if (x === realDataGridLength - 1 && y === realDataGridLength - 1) {
			return path;
		}

		const validNeighbours = getValidNeighbors(x, y, visited);
		if (validNeighbours?.length) {
			for (const [i, j] of validNeighbours) {
				queue.push([i, j, [...path, [i, j]]]);
				visited.add(`${i},${j}`);
			}
		}
	}

	return null;
};

const findPointOfUnReachablePath = () => {
	let path = null;

	for (const line of realData.split(/\n\t/g)) {
		const [x, y] = line.trim().split(',').map(Number);

		grid[y][x] = '#';

		if (path === null || path.some((point) => point[0] === x && point[1] === y)) {
			path = canWalkReachablePath();

			if (path === null) {
				return `${x},${y}`;
			}
		}
	}
};

const ans = findPointOfUnReachablePath();

console.log(ans);
