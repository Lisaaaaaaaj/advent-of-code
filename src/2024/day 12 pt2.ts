const mappedData = [...realData];
const mappedDataRowLength = mappedData.length;
const mappedDataColLength = mappedData[0].length;

const findAllRegions = () => {
	const workableData: { [key: string]: [number, number][][] } = {};

	mappedData.forEach((d, rowIndex) => {
		d.split('').forEach((dd, colIndex) => {
			if (!workableData[dd]) {
				workableData[dd] = [[]];
				workableData[dd][workableData[dd].length - 1].push([rowIndex, colIndex]);
			} else if (workableData[dd]) {
				workableData[dd][workableData[dd].length - 1].push([rowIndex, colIndex]);
			}
		});
	});

	return workableData;
};

const findRegion = (
	grid: Array<string | number>[],
	startX: number,
	startY: number,
	targetColor: number
) => {
	const relevantPlots: [number, number][] = [];
	const modifiedGrid = grid;
	const x_len = modifiedGrid.length;
	const y_len = modifiedGrid[0].length;
	const color = modifiedGrid[startX][startY];

	if (color === targetColor) {
		return relevantPlots;
	}

	const fill = (row: number, col: number) => {
		if (modifiedGrid[row][col] === color) {
			modifiedGrid[row][col] = targetColor;
			if (row >= 1) fill(row - 1, col);
			if (row + 1 < x_len) fill(row + 1, col);
			if (col >= 1) fill(row, col - 1);
			if (col + 1 < y_len) fill(row, col + 1);
		}
	};

	fill(startX, startY);

	modifiedGrid.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			if (col.toString() === targetColor.toString()) {
				relevantPlots.push([rowIndex, colIndex]);
			}
		});
	});

	return relevantPlots;
};

const groupedData = Object.entries(findAllRegions()).reduce((acc, d) => {
	const groupedByRegion: { region: number; vectors: [number, number][] }[] = [
		{ region: 0, vectors: [] },
	];

	const plot = d[1];

	const seenPlots = new Set();

	plot.map((dd) => {
		dd.map((ddd) => {
			let relevantPlots: [number, number][] = [];

			if (!seenPlots.has(JSON.stringify(relevantPlots))) {
				const startX = ddd[0];
				const startY = ddd[1];
				const targetColor = 2;

				relevantPlots = findRegion(
					mappedData.map((d) => d.split('')),
					startX,
					startY,
					targetColor
				);

				groupedByRegion[groupedByRegion.length - 1].vectors = relevantPlots;
				groupedByRegion.push({
					region: groupedByRegion[groupedByRegion.length - 1].region + 1,
					vectors: [],
				});
			}

			seenPlots.add(JSON.stringify(relevantPlots));
		});
	});

	groupedByRegion.pop();

	const set = new Set(groupedByRegion.map((result) => JSON.stringify(result.vectors)));

	return {
		...acc,
		[d[0]]: Array.from(set).map((elem) => JSON.parse(elem)),
	};
}, {} as { [key: string]: [number, number][][] });

const findSides = (region: [number, number][]) => {
	const edges: { [key: string]: [number, number] } = region.reduce((acc, d) => {
		const [row, col] = d;
		const foundEdges: { [key: string]: [number, number] } = { ...acc };

		[
			[row + 1, col],
			[row - 1, col],
			[row, col + 1],
			[row, col - 1],
		].map((dd) => {
			const [nextRow, nextCol] = dd;

			if (region.some(([x, y]) => x === nextRow && y === nextCol)) {
				return;
			}

			const edgeRow = (row + nextRow) / 2;
			const edgeCol = (col + nextCol) / 2;

			foundEdges[`${edgeRow},${edgeCol}`] = [edgeRow - row, edgeCol - col];
		});

		return { ...foundEdges };
	}, {});

	const seenEdges = new Set();

	return Object.keys(edges).reduce((acc, d) => {
		const edge = d;

		if (seenEdges.has(edge)) {
			return acc;
		} else {
			seenEdges.add(edge);
		}

		const [edgeRow, edgeCol] = edge.split(',').map(Number);

		const lookForCorners = (a: number, b: number, even: boolean) => {
			[-1, 1].forEach((lookUp) => {
				let corner = (even ? a : b) + lookUp;

				while (
					edges[even ? `${corner},${b}` : `${a},${corner}`] &&
					edges[even ? `${corner},${b}` : `${a},${corner}`][0] === edges[edge][0] &&
					edges[even ? `${corner},${b}` : `${a},${corner}`][1] === edges[edge][1]
				) {
					seenEdges.add(even ? `${corner},${b}` : `${a},${corner}`);
					corner += lookUp;
				}
			});
		};

		if (edgeRow % 1 === 0) {
			lookForCorners(edgeRow, edgeCol, true);
		} else {
			lookForCorners(edgeRow, edgeCol, false);
		}

		return (acc += 1);
	}, 0);
};

const fencingTotalPrice = Object.entries(groupedData).reduce((acc, d) => {
	let num = 0;

	const prices: { area: number; perimeter: number }[] = d[1].map((dd) => {
		return { area: dd.length, perimeter: findSides(dd) };
	});

	prices.forEach((price) => (num += price.area * price.perimeter));

	return (acc += num);
}, 0);

console.log(fencingTotalPrice);
