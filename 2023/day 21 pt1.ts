const workableData = [...realData];

const findStart = (): [number, number] => {
	let row = 0,
		col = 0;

	for (let rowIndex = 0; rowIndex < workableData.length; rowIndex++) {
		for (let colIndex = 0; colIndex < workableData[rowIndex].length; colIndex++) {
			if (workableData[rowIndex][colIndex] === 'S') {
				row = rowIndex;
				col = colIndex;
			}
		}
	}

	return [row, col];
};
const startPos: [number, number] = findStart();

const plotsToReach = (steps: number) => {
	const plotted = new Set();
	const visited = new Set();

	visited.add(`${startPos[0]},${startPos[1]}`);

	const q = [[startPos[0], startPos[1], steps]];
	const directions = (row: number, col: number) => [
		[row + 1, col],
		[row - 1, col],
		[row, col + 1],
		[row, col - 1],
	];

	while (q.length > 0) {
		const [row, column, stepsLeft] = q.shift()!;

		if (stepsLeft % 2 === 0) {
			plotted.add(`${row},${column}`);
		}
		if (stepsLeft === 0) {
			continue;
		}

		for (const [newRow, newColumn] of directions(row, column)) {
			const outOfBounds =
				newRow < 0 ||
				newRow >= workableData.length ||
				newColumn < 0 ||
				newColumn >= workableData[0].length;
			const charIsRock = workableData[newRow][newColumn] === '#';
			const alreadyVisited = visited.has(`${newRow},${newColumn}`);

			if (outOfBounds || charIsRock || alreadyVisited) {
				continue;
			}

			visited.add(`${newRow},${newColumn}`);
			q.push([newRow, newColumn, stepsLeft - 1]);
		}
	}

	return plotted.size;
};

const answer = plotsToReach(64);

console.log(answer);
