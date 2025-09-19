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

	const fill = (r: number, c: number) => {
		if (modifiedGrid[r][c] === color) {
			modifiedGrid[r][c] = targetColor;
			if (r >= 1) fill(r - 1, c);
			if (r + 1 < x_len) fill(r + 1, c);
			if (c >= 1) fill(r, c - 1);
			if (c + 1 < y_len) fill(r, c + 1);
		}
	};

	fill(startX, startY);

	modifiedGrid.forEach((r, rowIndex) => {
		r.forEach((c, colIndex) => {
			if (c.toString() === targetColor.toString()) {
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

const numOfNeighbour = (
	char: string,
	arr: string[],
	i: number,
	j: number,
	rows: number,
	cols: number
) => {
	let count = 0;

	[
		i > 0 && arr[i - 1][j] === char,
		j > 0 && arr[i][j - 1] === char,
		i < rows - 1 && arr[i + 1][j] === char,
		j < cols - 1 && arr[i][j + 1] === char,
	]
		.filter((t) => t)
		.forEach(() => count++);

	return count;
};

const findPerimeter = (char: string, arr: string[]) => {
	let perimeter = 0;
	const rows = arr.length;
	const cols = arr[0].length;

	for (let i = 0; i < rows; i++)
		for (let j = 0; j < cols; j++)
			if (arr[i][j] && arr[i][j] === char)
				perimeter += 4 - numOfNeighbour(char, arr, i, j, rows, cols);

	return perimeter;
};

const fencingTotalPrice = Object.entries(groupedData).reduce((acc, d) => {
	let num = 0;

	const prices: { area: number; perimeter: number }[] = d[1].map((dd) => {
		const prefilledArr: [string][] = Array.from({ length: mappedDataRowLength }).fill(
			Array.from({ length: mappedDataColLength }).fill('9')
		) as [string][];
		const arrForPerimeter = prefilledArr.map((pd, rowIndex) => {
			return pd
				.map((pdd, colIndex) => {
					const relevantPlot = dd.find(
						(ddd: number[]) => ddd[0] === rowIndex && ddd[1] === colIndex
					);

					if (relevantPlot) {
						return d[0];
					}

					return pdd;
				})
				.join('');
		});

		return { area: dd.length, perimeter: findPerimeter(d[0], arrForPerimeter) };
	});

	prices.forEach((price) => (num += price.area * price.perimeter));

	return (acc += num);
}, 0);

console.log(fencingTotalPrice);
