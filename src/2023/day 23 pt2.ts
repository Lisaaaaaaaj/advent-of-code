const workableData = [...realData];

type Start = [number, number];
const start: Start = [0, workableData[0].indexOf('.')];
const end: [number, number] = [
	workableData.length - 1,
	workableData[workableData.length - 1].indexOf('.'),
];
const forestChar = '#';

const walkablePositions: [[number, number], [number, number]] = [start, end];
const stepsToWalk: { [key: string]: { [key: string]: number } } = {};
const visited = new Set();
const allDirections = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];

const inBound = (nextRow: number, nextCol: number) =>
	nextRow >= 0 &&
	nextRow < workableData.length &&
	nextCol >= 0 &&
	nextCol < workableData[0].length &&
	workableData[nextRow][nextCol] !== forestChar;

const determineSteps = () => {
	const stepInRange = (workableDataRows: number, workableDataCol: number) => {
		let nextSteps = 0;
		const stepInEveryDirection = 3;
		const nextStepPositions = [
			[workableDataRows - 1, workableDataCol],
			[workableDataRows + 1, workableDataCol],
			[workableDataRows, workableDataCol - 1],
			[workableDataRows, workableDataCol + 1],
		];

		for (const [nextRow, nextCol] of nextStepPositions) {
			if (inBound(nextRow, nextCol)) {
				nextSteps++;
			}
		}

		if (nextSteps >= stepInEveryDirection) {
			walkablePositions.push([workableDataRows, workableDataCol]);
		}
	};

	for (let workableDataRows = 0; workableDataRows < workableData.length; workableDataRows++) {
		const row = workableData[workableDataRows];
		for (let workableDataCol = 0; workableDataCol < row.length; workableDataCol++) {
			const currChar = row[workableDataCol];

			if (currChar === forestChar) {
				continue;
			}

			stepInRange(workableDataRows, workableDataCol);
		}
	}
};
determineSteps();

const prependWalkablePositions = () => {
	for (const position of walkablePositions) {
		stepsToWalk[position.toString()] = {};
	}
};
prependWalkablePositions();

const prependStepsToWalk = () => {
	for (const [visitedRow, visitedCol] of walkablePositions) {
		const walkList = [[0, visitedRow, visitedCol]];
		const visited = new Set();
		visited.add(`${visitedRow},${visitedCol}`);

		while (walkList.length > 0) {
			const [currPos, row, col] = walkList.pop()!;

			if (
				currPos !== 0 &&
				walkablePositions.some((position) => position[0] === row && position[1] === col)
			) {
				stepsToWalk[[visitedRow, visitedCol].toString()][[row, col].toString()] = currPos;
				continue;
			}

			for (const [newRow, newCol] of allDirections) {
				const nextRow = row + newRow;
				const nextCol = col + newCol;

				if (inBound(nextRow, nextCol) && !visited.has(`${nextRow},${nextCol}`)) {
					walkList.push([currPos + 1, nextRow, nextCol]);
					visited.add(`${nextRow},${nextCol}`);
				}
			}
		}
	}
};
prependStepsToWalk();

function findLongestWalk(position: Start) {
	if (position[0] === end[0] && position[1] === end[1]) {
		return 0;
	}

	let maxValue = -Number.MAX_SAFE_INTEGER;
	visited.add(`${position[0]},${position[1]}`);

	for (const nextStep of Object.keys(stepsToWalk[position.toString()])) {
		const nextPosition: Start = nextStep.split(',').map(Number) as Start;

		if (!visited.has(`${nextPosition[0]},${nextPosition[1]}`)) {
			maxValue = Math.max(
				maxValue,
				findLongestWalk(nextPosition) + stepsToWalk[position.toString()][nextStep]
			);
		}
	}

	visited.delete(`${position[0]},${position[1]}`);

	return maxValue;
}
const longestWalk = findLongestWalk(start);

console.log(longestWalk);
