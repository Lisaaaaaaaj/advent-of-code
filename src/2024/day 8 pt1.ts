const workableData = [...realData.split(/\n\t/)];
const mapRowLength = workableData.length;
const mapColLength = workableData[0].length;

const findRelatedAntennas = () => {
	const antennas: { [key: string]: { location: [number, number][] } } = {};

	workableData.forEach((d, rowIndex) =>
		d.split('').forEach((dd, colIndex) => {
			if (dd !== '.') {
				if (!antennas[dd]) {
					antennas[dd] = { location: [] };
				}
				antennas[dd].location.push([rowIndex, colIndex]);
			}
		})
	);

	return antennas;
};

const foundRelatedAntennas = findRelatedAntennas();

const calcAntinodePositions = (
	a: [number, number],
	b: [number, number],
	diff: [number, number]
) => {
	let antinodes: [number, number][] = [];
	if (a[0] < b[0] && a[1] > b[1]) {
		antinodes = [
			[a[0] - diff[0], a[1] + diff[1]],
			[b[0] + diff[0], b[1] - diff[1]],
		];
	} else if (a[0] < b[0] && a[1] < b[1]) {
		antinodes = [
			[a[0] - diff[0], a[1] - diff[1]],
			[b[0] + diff[0], b[1] + diff[1]],
		];
	}

	return antinodes;
};

const findAntinodesBetweenAntennas = () => {
	return Object.fromEntries(
		Object.entries(foundRelatedAntennas).map(([key, val]) => {
			const { location } = val;

			const antinodes: { [key: string]: [number, number][] } = {};

			location.forEach((d) => {
				location
					.filter((dd) => JSON.stringify(d) !== JSON.stringify(dd))
					.map((dd) => {
						if (!antinodes[`[${dd}]|[${d}]`]) {
							const distanceBetweenAntennas: [number, number] = [
								Math.abs(dd[0] - d[0]),
								Math.abs(d[1] - dd[1]),
							];

							antinodes[`[${d}]|[${dd}]`] = calcAntinodePositions(d, dd, distanceBetweenAntennas);
						}
					});
			});

			return [key, { ...val, antinodes }];
		})
	);
};
const antennasWithAntinodes = findAntinodesBetweenAntennas();

const totalUniqueAntinodes = new Set();

const findInBoundAntinodes = () => {
	return Object.values(antennasWithAntinodes).reduce((acc, d) => {
		const nodes: [number, number][] = [];

		Object.values(d.antinodes).forEach((dd) =>
			nodes.push(
				...dd.filter(
					(ddd) => ddd[0] > -1 && ddd[0] < mapRowLength && ddd[1] > -1 && ddd[1] < mapColLength
				)
			)
		);

		return [...acc, ...nodes];
	}, [] as [number, number][]);
};
findInBoundAntinodes().forEach((d) => totalUniqueAntinodes.add(JSON.stringify(d)));

console.log(totalUniqueAntinodes.size);
