// 155516 too high
// 153516 too high
// 151516 too high
// 151515 not the right answer
// 149516 not the right answer
// 150516 not the right answer
// 147514 not the right answer
// 147550 not the right answer
// 203652 not the right answer
// 133588 not the right answer

// 133584 hell, 4 off!!!

type ReindeerPos = [number, number];
const start: ReindeerPos = [0, 0];
const end: ReindeerPos = [0, 0];

const workableData = [...realData].map((d, rowIndex) => {
	return d.split('').map((dd, colIndex) => {
		if (dd === 'S' || dd === 'E' || dd === '.') {
			if (dd === 'S') {
				start[0] = rowIndex;
				start[1] = colIndex;
			}
			if (dd === 'E') {
				end[0] = rowIndex;
				end[1] = colIndex;
			}

			return dd;
		} else {
			return dd;
		}
	});
});

type PriorityElement = [number, number, number, string];

class PriorityQueue {
	array: PriorityElement[] = [];
	size = 0;
	compare = (a: PriorityElement, b: PriorityElement) => b[0] > a[0];
	constructor() {
		this.array = [];
	}

	push = (myval: PriorityElement) => {
		let i = this.size;
		this.array[this.size] = myval;
		this.size += 1;
		let p;
		let ap;
		while (i > 0) {
			p = (i - 1) >> 1;
			ap = this.array[p];
			if (!this.compare(myval, ap)) {
				break;
			}
			this.array[i] = ap;
			i = p;
		}
		this.array[i] = myval;
	};

	percolateDown = (i: number) => {
		const size = this.size;
		const hsize = this.size >>> 1;
		const ai = this.array[i];
		let l;
		let r;
		let bestc;
		while (i < hsize) {
			l = (i << 1) + 1;
			r = l + 1;
			bestc = this.array[l];
			if (r < size) {
				if (this.compare(this.array[r], bestc)) {
					l = r;
					bestc = this.array[r];
				}
			}
			if (!this.compare(bestc, ai)) {
				break;
			}
			this.array[i] = bestc;
			i = l;
		}
		this.array[i] = ai;
	};

	shift = () => {
		const ans = this.array[0];
		if (this.size > 1) {
			this.array[0] = this.array[--this.size];
			this.percolateDown(0);
		} else {
			this.size -= 1;
		}
		return ans;
	};

	isEmpty = () => {
		return this.size === 0;
	};
}

const directions: { [key: string]: [number, number] } = {
	E: [0, 1],
	W: [0, -1],
	N: [-1, 0],
	S: [1, 0],
};

const findHappyReindeersViaDijkstra = (grid: string[][], starts: [number, number, string][]) => {
	const visited: { [key: string]: number } = {};
	const pq = new PriorityQueue();

	const alreadyVisited = (props: [number, number, string]) => {
		return visited[JSON.stringify(props)];
	};

	starts.forEach((s) => {
		const [sr, sc, dir] = s;
		visited[JSON.stringify([sr, sc, dir])] = 0;
		pq.push([0, sr, sc, dir]);
	});

	while (pq.size > 0) {
		const [d, row, col, direction] = pq.shift();

		if (alreadyVisited([row, col, direction]) < d) {
			continue;
		}

		['E', 'W', 'N', 'S']
			.filter((d) => d !== direction)
			.forEach((next_dir) => {
				if (
					!alreadyVisited([row, col, next_dir]) ||
					alreadyVisited([row, col, next_dir]) > d + 1000
				) {
					visited[JSON.stringify([row, col, next_dir])] = d + 1000;
					pq.push([d + 1000, row, col, next_dir]);
				}
			});

		const [dr, dc] = directions[direction];
		const nextRow = row + dr;
		const nextCol = col + dc;

		const inBounds =
			0 <= nextRow && nextRow < grid.length && 0 <= nextCol && nextCol < grid[0].length;
		const notHittingWall = grid[nextRow][nextCol] !== '#';

		if (
			inBounds &&
			notHittingWall &&
			(!alreadyVisited([nextRow, nextCol, direction]) ||
				alreadyVisited([nextRow, nextCol, direction]) > d + 1)
		) {
			visited[JSON.stringify([nextRow, nextCol, direction])] = d + 1;
			pq.push([d + 1, nextRow, nextCol, direction]);
		}
	}

	return visited;
};

const findLowestPath = () => {
	const [grid, [sr, sc], [er, ec]] = [workableData, start, end];
	const visited = findHappyReindeersViaDijkstra(grid, [[sr, sc, 'E']]);
	let lowestPath = Infinity;

	['E', 'W', 'N', 'S'].forEach((dir) => {
		if (visited[JSON.stringify([er, ec, dir])]) {
			lowestPath = Math.min(lowestPath, visited[JSON.stringify([er, ec, dir])]);
		}
	});

	return { lowestPath, visited };
};

const foundLowestPath = findLowestPath();
console.log(foundLowestPath.lowestPath);
