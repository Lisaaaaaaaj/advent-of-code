const dummyDataGridLength = 7;
const dummyDataBytesFallCount = 12;

const realDataGridLength = 71;
const realDataBytesFallCount = 1024;

const workableData = [...realData.split(/\n\t/g)].map((d) => {
	const [col, row] = d.split(',');

	return [parseInt(row, 10), parseInt(col, 10)];
});

const grid: string[][] = Array.from({ length: realDataGridLength })
	.fill('.')
	.map(() => Array.from({ length: realDataGridLength }).fill('.')) as string[][];
const letBytesFall = () => {
	for (let i = 0; i < realDataBytesFallCount; i++) {
		const currentByteFalling = workableData[i];
		const [row, col] = currentByteFalling;

		grid[row][col] = '#';
	}
};
letBytesFall();

const start = [0, 0];
const end = [grid.length - 1, grid[0].length - 1];

const shortestPathViaBFS = (mat: (1 | 0)[][], src: [number, number], dest: [number, number]) => {
	const directions = [
		[-1, 0],
		[0, -1],
		[0, 1],
		[1, 0],
	];

	if (mat[src[0]][src[1]] !== 1 || mat[dest[0]][dest[1]] !== 1) {
		return -1;
	}

	const visited = new Array(grid.length)
		.fill(false)
		.map(() => new Array(grid[0].length).fill(false));

	visited[src[0]][src[1]] = true;

	const q = [{ pt: src, dist: 0 }];

	while (q) {
		const curr = q.shift()!;
		const pt = curr.pt;

		if (pt[0] === dest[0] && pt[1] === dest[1]) {
			return curr.dist;
		}

		for (let i = 0; i < 4; i++) {
			const [row, col] = [pt[0] + directions[i][0], pt[1] + directions[i][1]];
			const inBounds = row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

			if (inBounds && mat[row][col] === 1 && !visited[row][col]) {
				visited[row][col] = true;
				q.push({ pt: [row, col], dist: curr.dist + 1 });
			}
		}
	}

	return -1;
};

const findPristineShortestPathViaBFS = () => {
	const mat = grid.map((r) => r.map((c) => (c === '#' ? 0 : 1)));

	const source: [number, number] = [start[0], start[1]];
	const dest: [number, number] = [end[0], end[1]];

	const pristineShortestPath = shortestPathViaBFS(mat, source, dest);

	return pristineShortestPath;
};

const shortestPathSteps = findPristineShortestPathViaBFS();
console.log(shortestPathSteps);
