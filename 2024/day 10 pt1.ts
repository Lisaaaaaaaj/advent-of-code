const mappedData: number[][] = [...realData]
	.map((d) => d.split(''))
	.map((d) => d.map((x) => parseInt(x, 10)));

const directions = [
	[0, 1],
	[0, -1],
	[1, 0],
	[-1, 0],
];

const trailAllPaths = (wMap: number[][]) => {
	let activeNums: [number, number, number, number][] = [];

	const allTrailHeads: [number, number, number, number][] = [];

	wMap.forEach((d, rowIndex) =>
		d.forEach((dd, colIndex) =>
			dd === 0 ? allTrailHeads.push([rowIndex, colIndex, allTrailHeads.length, 0]) : dd
		)
	);

	allTrailHeads.forEach((t) => {
		const [row, col, id] = t;
		activeNums.push([row, col, 0, id]);
	});

	while (activeNums.length > 0) {
		const currActiveNum = activeNums.shift()!;
		const [currRow, currCol, pos, id] = currActiveNum;

		if (pos === 9) {
			allTrailHeads[id][3] += 1;
		} else {
			const nextDirections = directions.map((d) => [currRow + d[0], currCol + d[1]]);
			const filteredDirections = [...nextDirections].filter((d) => {
				const outOfBounds =
					d[0] < 0 || d[0] > wMap.length - 1 || d[1] < 0 || d[1] > wMap[0].length - 1;

				if (outOfBounds) {
					return false;
				}

				const nextTileIsInSequence = wMap[d[0]][d[1]] === pos + 1;

				return nextTileIsInSequence;
			});

			filteredDirections.forEach((d) => {
				activeNums.push([d[0], d[1], pos + 1, id]);
			});
		}

		activeNums = activeNums.filter(
			(item, index, arr) =>
				arr.findIndex((duplicateItem) => JSON.stringify(duplicateItem) === JSON.stringify(item)) ===
				index
		);
	}

	return allTrailHeads;
};
const trailedPaths = trailAllPaths(mappedData);

const sumOfTrailHeadScores = trailedPaths.reduce((acc, d) => (acc += d[d.length - 1]), 0);

console.log(sumOfTrailHeadScores);
