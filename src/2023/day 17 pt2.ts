const mappedData: number[][] = [...realData]
	.map((d) => d.split(''))
	.map((d) => d.map((x) => parseInt(x, 10)));

type Direction = 'du' | 'rl';
type PriorityElement = [number, number, number, Direction];

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

const findShortestPath = (wMap: number[][], maxStraightSteps: number, minSteps: number) => {
	const activeNums = new PriorityQueue();
	const visitedNums: Set<string> = new Set();

	const directions: { [key in Direction]: Array<[number, number]> } = {
		rl: [
			[0, 1],
			[0, -1],
		],
		du: [
			[1, 0],
			[-1, 0],
		],
	};
	const nextDirection = (
		activePos: [number, number],
		dir: [number, number],
		i: number
	): [number, number] => {
		const [row, col] = activePos;
		const [nextRow, nextCol] = dir;

		return [row + i * nextRow, col + i * nextCol];
	};

	const getNextDirection = (row: number, col: number, dir: Direction, heatLoss: number) => {
		const checkBothDirs = (i: number) => i < dir.length;
		const checkDirWithinMaxStraightSteps = (j: number) => j <= maxStraightSteps;

		for (let dirCount = 0; checkBothDirs(dirCount); dirCount++) {
			let newHeatLoss = heatLoss;

			for (
				let straightStepCount = 1;
				checkDirWithinMaxStraightSteps(straightStepCount);
				straightStepCount++
			) {
				const [nextRow, nextCol] = nextDirection(
					[row, col],
					directions[dir][dirCount],
					straightStepCount
				);
				const nextDirIsNotOutOfBounds =
					nextRow >= 0 && nextRow < wMap.length && nextCol >= 0 && nextCol < wMap[0].length;

				if (nextDirIsNotOutOfBounds) {
					newHeatLoss += wMap[nextRow][nextCol];

					if (straightStepCount >= minSteps) {
						activeNums.push([newHeatLoss, nextRow, nextCol, dir === 'rl' ? 'du' : 'rl']);
					}
				}
			}
		}
	};

	activeNums.push([0, 0, 0, 'rl']);
	activeNums.push([0, 0, 0, 'du']);

	while (!activeNums.isEmpty()) {
		const [heatLoss, row, col, dir] = activeNums.shift();
		const currUnVisited = JSON.stringify([row, col, dir]);
		const reachedFinalPos = row === wMap.length - 1 && col === wMap[0].length - 1;

		if (reachedFinalPos) {
			return heatLoss;
		} else if (!visitedNums.has(currUnVisited)) {
			visitedNums.add(currUnVisited);
			getNextDirection(row as number, col as number, dir as Direction, heatLoss as number);
		}
	}
};
const foundShortestPath = findShortestPath(mappedData, 10, 4);

console.log(foundShortestPath);
