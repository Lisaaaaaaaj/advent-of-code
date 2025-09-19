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

type Cheat = { pt: [number, number]; cheatPos: [number, number]; dist: number };
type Cheats = Cheat[];
type ShortestPath = { dist: number; cheats: Cheats };

const shortestPathViaBFS = (
	mat: (1 | 0)[][],
	src: [number, number],
	dest: [number, number],
	findAllCheats: boolean,
	useCheat?: Cheat
): ShortestPath | number => {
	const directions = [
		[-1, 0],
		[0, -1],
		[0, 1],
		[1, 0],
	];
	const inBounds = (row: number, col: number) =>
		row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

	const visited = new Array(grid.length)
		.fill(false)
		.map(() => new Array(grid[0].length).fill(false));

	visited[src[0]][src[1]] = true;

	const q = [{ pt: src, dist: 0 }];

	const cheats: Cheats = [];

	const cheat = (
		curr: {
			pt: [number, number];
			dist: number;
		},
		i: number,
		visited: boolean[][]
	) => {
		if (findAllCheats) {
			const pt = curr.pt;
			const [cheatRow, cheatCol] = [pt[0] + directions[i][0] * 1, pt[1] + directions[i][1] * 1];
			const [nextRow, nextCol] = [pt[0] + directions[i][0] * 2, pt[1] + directions[i][1] * 2];
			const cheatInBounds = (row: number, col: number) =>
				row > 0 && row < grid.length - 1 && col > 0 && col < grid[0].length - 1;
			const isCheatableWall = cheatInBounds(cheatRow, cheatCol) && mat[cheatRow][cheatCol] === 0;
			const isWalkableByCheat =
				cheatInBounds(nextRow, nextCol) &&
				mat[nextRow][nextCol] === 1 &&
				!visited[nextRow][nextCol];

			if (isCheatableWall && isWalkableByCheat) {
				return cheats.push({
					pt: [cheatRow, cheatCol],
					cheatPos: [nextRow, nextCol],
					dist: curr.dist + 1,
				});
			}
		}

		return false;
	};

	let usedCheat = false;

	const goToNextPositionToVisit = (
		curr: {
			pt: [number, number];
			dist: number;
		},
		row: number,
		col: number
	) => {
		if (inBounds(row, col) && mat[row][col] === 1 && !visited[row][col]) {
			visited[row][col] = true;
			q.push({ pt: [row, col], dist: curr.dist + 1 });
		}
	};

	while (q) {
		const curr = q.shift()!;
		const pt = curr.pt;

		if (pt[0] === dest[0] && pt[1] === dest[1]) {
			return { dist: curr.dist, cheats };
		}

		const relevantNextPositions = [];

		for (let i = 0; i < 4; i++) {
			const findCheats = cheat(curr, i, visited);

			if (!findCheats) {
				const [row, col] = [pt[0] + directions[i][0], pt[1] + directions[i][1]];

				if (!usedCheat && useCheat) {
					relevantNextPositions.push([row, col]);
				} else {
					goToNextPositionToVisit(curr, row, col);
				}
			}
		}

		const foundCheatWall =
			useCheat &&
			!usedCheat &&
			relevantNextPositions.find((d) => d[0] === useCheat.pt[0] && d[1] === useCheat.pt[1]);

		if (foundCheatWall) {
			const [row, col] = useCheat.cheatPos;

			usedCheat = true;
			visited[row][col] = true;
			q.push({ pt: [row, col], dist: useCheat.dist + 1 });
		} else {
			relevantNextPositions.forEach((pos) => {
				const [row, col] = pos;

				goToNextPositionToVisit(curr, row, col);
			});
		}
	}

	return -1;
};

const findPristineShortestPathViaBFSWithAllPossibleCheats = () => {
	const mat = grid.map((r) => r.map((c) => (c === '#' ? 0 : 1)));

	const source: [number, number] = [start[0], start[1]];
	const dest: [number, number] = [end[0], end[1]];

	const pristineShortestPathWithCheats = shortestPathViaBFS(
		mat,
		source,
		dest,
		true
	) as ShortestPath;

	return pristineShortestPathWithCheats;
};

const defaultShortestPath = findPristineShortestPathViaBFSWithAllPossibleCheats();
const defaultShortestPathSteps = defaultShortestPath.dist;
const allCheats = defaultShortestPath.cheats;

const findShortestPathViaBFSWithByCheating = (cheats: Cheats) => {
	const mat = grid.map((r) => r.map((c) => (c === '#' ? 0 : 1)));

	const source: [number, number] = [start[0], start[1]];
	const dest: [number, number] = [end[0], end[1]];

	const shortestPathsViaCheat = [];

	for (let i = 0; i < cheats.length; i++) {
		const pristineShortestPathWithCheats = shortestPathViaBFS(
			mat,
			source,
			dest,
			false,
			cheats[i]
		) as ShortestPath;
		shortestPathsViaCheat.push(pristineShortestPathWithCheats.dist);
	}

	return shortestPathsViaCheat;
};

const foundAllShortestPathsByCheating = findShortestPathViaBFSWithByCheating(allCheats);
const allSavedPicoseconds = foundAllShortestPathsByCheating.map(
	(cheat) => defaultShortestPathSteps - cheat
);

const allSavedAtLeast100PicoSeconds = allSavedPicoseconds.filter((ps) => ps >= 100).length;

console.log(allSavedAtLeast100PicoSeconds);
