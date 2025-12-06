// 957648 too low
// 1195887 too high???

// 957831 <-- correct one, I forgot to re-add initial visited and set 50 to 100 :')

const start = [0, 0];
const end = [0, 0];

const grid = [...realData]
	.map((d) => d.split(''))
	.map((d, rowIndex) => {
		return d.map((dd, colIndex) => {
			if (dd === 'S') {
				start[0] = rowIndex;
				start[1] = colIndex;
			}
			if (dd === 'E') {
				end[0] = rowIndex;
				end[1] = colIndex;
			}

			return dd;
		});
	});

type ShortestPath = { dist: number; visited: { pt: number[]; dist: number }[] };

const shortestPathViaPristineBFS = (
	mat: (1 | 0)[][],
	src: [number, number],
	dest: [number, number]
): ShortestPath | number => {
	const directions = [
		[-1, 0],
		[0, -1],
		[0, 1],
		[1, 0],
	];
	const inBounds = (row: number, col: number) =>
		row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

	const seen = new Array(grid.length).fill(false).map(() => new Array(grid[0].length).fill(false));

	seen[src[0]][src[1]] = true;

	const visited = [{ pt: src, dist: 0 }];

	const q = [{ pt: src, dist: 0 }];

	while (q) {
		const curr = q.shift()!;
		const pt = curr.pt;

		if (pt[0] === dest[0] && pt[1] === dest[1]) {
			return { dist: curr.dist, visited };
		}

		for (let i = 0; i < 4; i++) {
			const [row, col] = [pt[0] + directions[i][0], pt[1] + directions[i][1]];

			if (inBounds(row, col) && mat[row][col] === 1 && !seen[row][col]) {
				seen[row][col] = true;
				q.push({ pt: [row, col], dist: curr.dist + 1 });
				visited.push({ pt: [row, col], dist: curr.dist + 1 });
			}
		}
	}

	return -1;
};

const findPristineShortestPathViaBFS = () => {
	const mat = grid.map((r) => r.map((c) => (c === '#' ? 0 : 1)));

	const source: [number, number] = [start[0], start[1]];
	const dest: [number, number] = [end[0], end[1]];

	const pristineShortestPathWithCheats = shortestPathViaPristineBFS(
		mat,
		source,
		dest
	) as ShortestPath;

	return pristineShortestPathWithCheats;
};

const defaultShortestPath = findPristineShortestPathViaBFS();
const visited = defaultShortestPath.visited;

const findSavedAtLeast100PicoSecondsByCheating = (
	visited: {
		pt: number[];
		dist: number;
	}[]
) => {
	let shortestPathsViaCheat = 0;

	for (let i = 0; i < visited.length; i++) {
		for (let j = 0; j < visited.length; j++) {
			if (i === j) continue;

			const start = visited[i].pt;
			const end = visited[j].pt;

			const dist = Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);

			if (dist <= 20 && visited[i].dist - visited[j].dist - dist >= 100) {
				shortestPathsViaCheat++;
			}
		}
	}

	return shortestPathsViaCheat;
};

const allSavedAtLeast100PicoSeconds = findSavedAtLeast100PicoSecondsByCheating(visited);

console.log(allSavedAtLeast100PicoSeconds);
