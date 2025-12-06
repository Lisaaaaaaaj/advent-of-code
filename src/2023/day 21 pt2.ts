const workableData = [...realData];

const findStart = (): [number, number] => {
	let row = 0,
		col = 0;

	for (let rowIndex = row; rowIndex < workableData.length; rowIndex++) {
		for (let colIndex = col; colIndex < workableData[rowIndex].length; colIndex++) {
			if (workableData[rowIndex][colIndex] === 'S') {
				row = rowIndex;
				col = colIndex;
			}
		}
	}

	return [row, col];
};
const startPos: [number, number] = findStart();

const gardenLength = workableData.length;
const steps = 26501365;
const gardenWidth = Math.floor(steps / gardenLength) - 1;

const exponent = 2;
const oddGardens = Math.pow(Math.floor(gardenWidth / exponent) * exponent + 1, exponent);
const evenGardens = Math.pow(Math.floor((gardenWidth + 1) / exponent) * exponent, exponent);

const plotsToReach = (startRow: number, startColumn: number, steps: number) => {
	const plotted = new Set();
	const visited = new Set();

	visited.add(`${startRow},${startColumn}`);

	const q = [[startRow, startColumn, steps]];
	const directions = (row: number, col: number) => [
		[row, col - 1],
		[row, col + 1],
		[row - 1, col],
		[row + 1, col],
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
				newRow >= gardenLength ||
				newColumn < 0 ||
				newColumn >= workableData[0].length;
			const alreadyVisited = visited.has(`${newRow},${newColumn}`);

			if (outOfBounds || workableData[newRow][newColumn] === '#' || alreadyVisited) {
				continue;
			}

			visited.add(`${newRow},${newColumn}`);
			q.push([newRow, newColumn, stepsLeft - 1]);
		}
	}

	return plotted.size;
};

const additionalGardenExponent = 3;
const smallTriangleEdgeExponent = Math.floor(gardenLength / exponent) - 1;
const largeTriangleEdgeExponent =
	Math.floor((gardenLength * additionalGardenExponent) / exponent) - 1;

const toReachPlotParts = {
	edgeCornerTop: [gardenLength - 1, startPos[1], gardenLength - 1],
	edgeCornerRight: [startPos[0], 0, gardenLength - 1],
	edgeCornerBottom: [0, startPos[1], gardenLength - 1],
	edgeCornerLeft: [startPos[0], gardenLength - 1, gardenLength - 1],

	smallTriangleTopRight: [gardenLength - 1, 0, smallTriangleEdgeExponent],
	smallTriangleTopLeft: [gardenLength - 1, gardenLength - 1, smallTriangleEdgeExponent],
	smallTriangleBottomRight: [0, 0, smallTriangleEdgeExponent],
	smallTriangleBottomLeft: [0, gardenLength - 1, smallTriangleEdgeExponent],

	largeTriangleTopRight: [gardenLength - 1, 0, largeTriangleEdgeExponent],
	largeTriangleTopLeft: [gardenLength - 1, gardenLength - 1, largeTriangleEdgeExponent],
	largeTriangleBottomRight: [0, 0, largeTriangleEdgeExponent],
	largeTriangleBottomLeft: [0, gardenLength - 1, largeTriangleEdgeExponent],
};

const allReachedEvenPoints =
	evenGardens * plotsToReach(startPos[0], startPos[1], gardenLength * exponent);
const allReachedOddPoints =
	oddGardens * plotsToReach(startPos[0], startPos[1], gardenLength * exponent + 1);
const sumParts = (parts: number[][]) =>
	parts.reduce((acc, d) => acc + plotsToReach(d[0], d[1], d[2]), 0);
const allEdgeCorners = sumParts([
	toReachPlotParts.edgeCornerTop,
	toReachPlotParts.edgeCornerBottom,
	toReachPlotParts.edgeCornerLeft,
	toReachPlotParts.edgeCornerRight,
]);
const allSmallTriangles = sumParts([
	toReachPlotParts.smallTriangleTopRight,
	toReachPlotParts.smallTriangleTopLeft,
	toReachPlotParts.smallTriangleBottomRight,
	toReachPlotParts.smallTriangleBottomLeft,
]);
const allLargeTriangles = sumParts([
	toReachPlotParts.largeTriangleTopRight,
	toReachPlotParts.largeTriangleTopLeft,
	toReachPlotParts.largeTriangleBottomRight,
	toReachPlotParts.largeTriangleBottomLeft,
]);

const answer =
	allReachedOddPoints +
	allReachedEvenPoints +
	allEdgeCorners +
	(gardenWidth + 1) * allSmallTriangles +
	gardenWidth * allLargeTriangles;

console.log(answer);
