type Direction = 'u' | 'd' | 'l' | 'r';
type Beam = {
	char: string;
	pos: [number, number];
};

const mapMap = [...realMap];
const mappedMap = [
	...mapMap.map((line, lineIndex) => {
		const lineCollection: Beam[] = [];

		[...line].map((linePart, linePartIndex) => {
			lineCollection.push({
				char: linePart,
				pos: [lineIndex, linePartIndex],
			});
		});

		return lineCollection;
	}),
];

const workableMap = [...mappedMap];

const directions: { [key in Direction]: [number, number] } = {
	r: [0, 1],
	l: [0, -1],
	u: [-1, 0],
	d: [1, 0],
};

const orderLines = (pattern: string[], searchType: 'vertical' | 'horizontal') => {
	const verticalLength = pattern[0].length;
	const horizontalLength = pattern.length;
	const searchLength = searchType === 'horizontal' ? horizontalLength : verticalLength;
	const searchLengthWithin = searchLength === horizontalLength ? verticalLength : horizontalLength;

	const lines: string[][] = [];

	for (let i = 0; i < searchLength; i++) {
		lines.push([]);

		for (let j = 0; j < searchLengthWithin; j++) {
			if (searchType === 'vertical') {
				lines[i].push(pattern[j].charAt(i));
			} else {
				lines[i].push(pattern[i].charAt(j));
			}
		}
	}

	return lines;
};

const runBeams = (
	wMap: Beam[][],
	startPos: [number, number],
	lastPos: [number, number],
	direction: [number, number]
) => {
	const energizedBeams: Set<string> = new Set();

	const activeBeams: Array<Beam & { lastPos: [number, number]; nextPos: [number, number] }> = [
		{ ...wMap[startPos[0]][startPos[1]], lastPos, nextPos: direction },
	];

	let beam = { ...activeBeams[0], char: wMap[0][0].char };

	const nextBeamDirection = (
		activeBeamPos: [number, number],
		dir: [number, number]
	): [number, number] => {
		const [row, col] = activeBeamPos;
		const [nextRow, nextCol] = dir;

		return [row + nextRow, col + nextCol];
	};

	while (activeBeams.length > 0) {
		beam = activeBeams[0];
		activeBeams.shift();

		const rowOutOfBounds = beam.pos[0] < 0 || beam.pos[0] >= wMap[0].length;
		const columnOutOfBounds = beam.pos[1] < 0 || beam.pos[1] >= wMap.length;
		if (rowOutOfBounds || columnOutOfBounds) {
			continue;
		}

		if (energizedBeams.has(JSON.stringify([beam.pos, beam.lastPos]))) {
			continue;
		} else {
			energizedBeams.add(JSON.stringify([beam.pos, beam.lastPos]));
		}

		const nextBeam = wMap[beam.pos[0]][beam.pos[1]];
		const [nextBeamRow, nextBeamCol] = nextBeamDirection(beam.pos, beam.nextPos);

		if (nextBeam.char === '.') {
			activeBeams.push({
				char: beam.char,
				pos: [nextBeamRow, nextBeamCol],
				lastPos: beam.lastPos,
				nextPos: beam.nextPos,
			});
		} else if (['|', '-'].includes(nextBeam.char)) {
			const mirrSplit = nextBeam.char === '|';

			if (
				[directions[mirrSplit ? 'u' : 'l'], directions[mirrSplit ? 'd' : 'r']].includes(
					beam.lastPos
				)
			) {
				activeBeams.push({
					char: beam.char,
					pos: [nextBeamRow, nextBeamCol],
					lastPos: beam.lastPos,
					nextPos: beam.nextPos,
				});
			} else {
				activeBeams.push({
					char: beam.char,
					pos: nextBeamDirection(beam.pos, directions[mirrSplit ? 'u' : 'l']),
					lastPos: directions[mirrSplit ? 'd' : 'r'],
					nextPos: directions[mirrSplit ? 'u' : 'l'],
				});
				activeBeams.push({
					char: beam.char,
					pos: nextBeamDirection(beam.pos, directions[mirrSplit ? 'd' : 'r']),
					lastPos: directions[mirrSplit ? 'u' : 'l'],
					nextPos: directions[mirrSplit ? 'd' : 'r'],
				});
			}
		} else if (['L', 'R'].includes(nextBeam.char)) {
			const mirrDir = nextBeam.char === 'R';
			const relevantDir = [directions['u'], directions['d'], directions['l'], directions['r']].find(
				(dir) => beam.lastPos === dir
			);

			if (relevantDir) {
				const mappedDirs = {
					[directions.u.toString()]: {
						dir: directions[mirrDir ? 'l' : 'r'],
						lastPos: directions[mirrDir ? 'r' : 'l'],
						nextPos: directions[mirrDir ? 'l' : 'r'],
					},
					[directions.d.toString()]: {
						dir: directions[mirrDir ? 'r' : 'l'],
						lastPos: directions[mirrDir ? 'l' : 'r'],
						nextPos: directions[mirrDir ? 'r' : 'l'],
					},
					[directions.l.toString()]: {
						dir: directions[mirrDir ? 'u' : 'd'],
						lastPos: directions[mirrDir ? 'd' : 'u'],
						nextPos: directions[mirrDir ? 'u' : 'd'],
					},
					[directions.r.toString()]: {
						dir: directions[mirrDir ? 'd' : 'u'],
						lastPos: directions[mirrDir ? 'u' : 'd'],
						nextPos: directions[mirrDir ? 'd' : 'u'],
					},
				}[relevantDir.toString()];

				activeBeams.push({
					char: beam.char,
					pos: nextBeamDirection(beam.pos, mappedDirs.dir),
					lastPos: mappedDirs.lastPos,
					nextPos: mappedDirs.nextPos,
				});
			}
		}
	}

	return energizedBeams;
};

const energizeBeam = (
	startPos: [number, number],
	lastPos: [number, number],
	nextPos: [number, number]
) => {
	const energizedMap: Beam[][] = JSON.parse(JSON.stringify(Array.from(workableMap)));

	const energizeMap = (eMap: Set<string>) => {
		Array.from(eMap).forEach((beam) => {
			const wMapPos = beam.replace(/(\[|\])/g, '').split(',', 2);
			energizedMap[parseInt(wMapPos[0], 10)][parseInt(wMapPos[1], 10)].char = '#';
		});
	};
	energizeMap(runBeams(workableMap, startPos, lastPos, nextPos));

	let totalEnergized = 0;

	const filteredWorkableMap = [...energizedMap].map((w) => w.filter((x) => x.char === '#'));
	filteredWorkableMap.forEach((fwMap) => {
		totalEnergized += fwMap.length;
	});

	console.log(energizedMap.map((w) => w.map((x) => x.char).join('')));

	return totalEnergized;
};

const energizedFullBeams = () => {
	const totalFullBeamsEnergized: number[] = [];
	const relevantLines = (lines: string[]) =>
		lines.filter((_, index) => [0, mapMap.length - 1].includes(index));
	const stringToCoords = (relMap: string[]) =>
		relMap.map((line, lineIndex) =>
			line.split('').map((_, index) => [lineIndex === 0 ? 0 : 9, index])
		);
	const topAndDownRow = stringToCoords(relevantLines([...mapMap]));
	const corners: number[][] = [
		topAndDownRow[0][0],
		topAndDownRow[0][9],
		topAndDownRow[1][0],
		topAndDownRow[1][9],
	];
	const foundCorner = (coord: number[]) =>
		corners.find((corny) => JSON.stringify(corny) === JSON.stringify(coord));
	const leftAndRightMostColumn = stringToCoords(
		relevantLines(orderLines(mapMap, 'vertical').map((l) => l.join('')))
	).map((coords) => coords.filter((coord) => !foundCorner(coord)));

	topAndDownRow.forEach((rows, index) => {
		const mirrIndex = index === 0;

		rows.forEach((row) => {
			if (foundCorner(row)) {
				totalFullBeamsEnergized.push(
					energizeBeam(
						row as [number, number],
						directions[mirrIndex ? 'l' : 'r'],
						directions[mirrIndex ? 'r' : 'l']
					)
				);
			}

			totalFullBeamsEnergized.push(
				energizeBeam(
					row as [number, number],
					directions[mirrIndex ? 'u' : 'd'],
					directions[mirrIndex ? 'd' : 'u']
				)
			);
		});
	});

	leftAndRightMostColumn.forEach((columns, index) => {
		const mirrIndex = index === 0;

		columns.forEach((column) => {
			totalFullBeamsEnergized.push(
				energizeBeam(
					column as [number, number],
					directions[mirrIndex ? 'u' : 'd'],
					directions[mirrIndex ? 'd' : 'u']
				)
			);
		});
	});

	return Math.max(...totalFullBeamsEnergized);
};
const totalFullBeamsEnergized = energizedFullBeams();

console.log(totalFullBeamsEnergized);
