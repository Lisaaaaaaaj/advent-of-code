const workableData = [...realData];

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

const dir = {
	up: [-1, 0],
	down: [1, 0],
	left: [0, -1],
	right: [0, 1],
};

let currDir = dir.up;

let watchGuard = true;

const swapChars = (string: string, from: number, to: number, part2?: boolean) => {
	const charArray = string.split('');

	[charArray[from], charArray[to]] = [charArray[to], charArray[from]];

	const charArrayModified = charArray.map((d, index) =>
		index > -1 && index <= from && d === '.' ? (part2 ? '.' : 'X') : d
	);

	return charArrayModified.join('');
};

let takenSteps = 0;

let rowOutOfBounds = false;
let orderedGuard = [...workableData];

let seenObstacleTwice = false;
const mapSeen = new Set();

const needNoFlip = (mapToFlip: string[]) =>
	mapToFlip.every((d, rowIndex) => {
		return d
			.split('')
			.every((dd, colIndex) => (dd === '#' ? workableData[rowIndex][colIndex] === '#' : true));
	});

const flipUntilMatchWorkableData = (mapToFlip: string[]) => {
	let stopFlippin = false;
	let goodMap = mapToFlip;
	while (!stopFlippin) {
		if (stopFlippin) {
			break;
		}

		let flippedMap = orderLines(
			orderLines(
				goodMap.reverse().map((f) => f),
				'horizontal'
			).map((f) => f.reverse().join('')),
			'vertical'
		).map((f) => f.join(''));

		if (needNoFlip(flippedMap)) {
			stopFlippin = true;
			goodMap = flippedMap;
		}

		flippedMap = orderLines(
			orderLines(
				goodMap.map((f) => f),
				'vertical'
			).map((f) => f.join('')),
			'horizontal'
		).map((f) => f.join(''));

		if (needNoFlip(flippedMap)) {
			stopFlippin = true;
			goodMap = flippedMap;
		}

		flippedMap = orderLines(
			orderLines(
				goodMap.map((f) => f),
				'vertical'
			).map((f) => f.join('')),
			'horizontal'
		).map((f) => f.join(''));

		if (needNoFlip(flippedMap)) {
			stopFlippin = true;
			goodMap = flippedMap;
		}

		flippedMap = orderLines(
			orderLines(
				goodMap.map((f) => f),
				'horizontal'
			).map((f) => f.reverse().join('')),
			'horizontal'
		).map((f) => f.join(''));

		if (needNoFlip(flippedMap)) {
			stopFlippin = true;
			goodMap = flippedMap;
		}

		flippedMap = orderLines(
			orderLines(
				goodMap.map((f) => f),
				'vertical'
			).map((f) => f.reverse().join('')),
			'vertical'
		).map((f) => f.join(''));

		if (needNoFlip(flippedMap)) {
			stopFlippin = true;
			goodMap = flippedMap;
		}

		flippedMap = orderLines(
			orderLines(
				goodMap.map((f) => f),
				'horizontal'
			).map((f) => f.join('')),
			'horizontal'
		).map((f) => f.join(''));

		if (needNoFlip(flippedMap)) {
			stopFlippin = true;
			goodMap = flippedMap;
		}

		//console.log(flippedMap)

		//throw Error('wtf')
	}

	return goodMap;
};

const findCurrentGuardPos = (relevantMap: string[][]) => {
	const relevantRow = relevantMap.findIndex((d) => d.includes('O'));

	if (relevantRow === -1) {
		rowOutOfBounds = true;
		return;
	}

	const relevantCol = relevantMap[relevantRow].findIndex((d) => d.includes('O'));
	if (mapSeen.has(JSON.stringify([relevantRow, relevantCol, currDir]))) {
		seenObstacleTwice = true;
	}

	mapSeen.add(JSON.stringify([relevantRow, relevantCol, currDir]));
};
const tiltGuard = (lines: string[][], part2?: boolean) => {
	const modifiedLines = lines.map((line) => {
		const splittedLines = line
			.join('')
			.split(/(#|@)/g)
			.filter((sp) => sp.length);
		const groupedChunks = [...splittedLines.map((sp) => [...sp.matchAll(/O/g)])];

		const orderedGuard = [...splittedLines];

		groupedChunks.map((chunk, chunkIndex) => {
			let orderedChunks = '';

			chunk.map((ch) => {
				if (!orderedChunks.length && ch.input.length) {
					orderedChunks = ch.input;
				}

				const dotIndex =
					orderedChunks.indexOf('.') !== -1
						? orderedChunks.indexOf('.')
						: orderedChunks.indexOf('X');

				if (dotIndex !== -1 && dotIndex < ch.index) {
					orderedChunks = swapChars(orderedChunks, ch.index, dotIndex, part2);
					orderedGuard[chunkIndex] = orderedChunks;
				}
			});
		});

		return orderedGuard.filter((sp) => sp.length).join('');
	});

	orderedGuard = modifiedLines;

	if (seenObstacleTwice) {
		return orderedGuard;
	}

	const orderedRow = orderLines(orderedGuard, 'vertical');
	const firstRow = orderedRow[0]?.find((d) => d === 'O');
	const lastRow = orderedRow[orderedGuard.length - 1]?.find((d) => d === 'O');

	const findOutOfBounds = [
		firstRow && currDir === dir.down,
		firstRow && currDir === dir.up,
		firstRow && currDir === dir.left,
		firstRow && currDir === dir.right,
		lastRow && currDir === dir.up,
		lastRow && currDir === dir.down,
		lastRow && currDir === dir.left,
		lastRow && currDir === dir.right,
	].some((d) => d);

	if (findOutOfBounds) {
		rowOutOfBounds = true;

		const relevantCol = orderedGuard.findIndex((d) => d.includes('O'));
		orderedGuard[relevantCol] = orderedGuard[relevantCol].replace('O', 'X');

		return orderedGuard;
	}

	if (currDir === dir.up) {
		currDir = dir.right;
	} else if (currDir === dir.down) {
		currDir = dir.left;
	} else if (currDir === dir.left) {
		currDir = dir.up;
	} else if (currDir === dir.right) {
		currDir = dir.down;
	}

	return orderedGuard;
};

let cycledGuard: string[] = [];

const stopWatchingGuard = (part2?: boolean) => {
	if (!part2) {
		takenSteps += orderedGuard.reduce(
			(acc, d) => acc + d.split('').filter((dd) => dd === 'X').length,
			0
		);
	}

	cycledGuard = orderedGuard;
	watchGuard = false;
	rowOutOfBounds = false;
};

while (watchGuard) {
	if (rowOutOfBounds) {
		stopWatchingGuard();
		break;
	}

	const orderedVerticalLines = orderLines(orderedGuard, 'vertical');
	const orderedGuardToNorth = tiltGuard([...orderedVerticalLines]);

	const faceNorth = orderLines(orderedGuardToNorth, 'vertical');

	if (rowOutOfBounds) {
		stopWatchingGuard();
		break;
	}

	const faceEast = orderLines(
		orderLines(
			faceNorth.reverse().map((f) => f.join('')),
			'vertical'
		).map((f) => f.join('')),
		'vertical'
	).map((f) => f.reverse());
	const orderedGuardToEast = tiltGuard([...faceEast]).map((s) => s.split('').join(''));

	orderedGuard = orderedGuardToEast;
}

console.log(takenSteps);

const cycledMapAlignedWithWorkableData = needNoFlip(cycledGuard)
	? cycledGuard
	: flipUntilMatchWorkableData(cycledGuard);

const guardPathPositions: Set<string> = new Set();

cycledMapAlignedWithWorkableData.forEach((d, rowIndex) => {
	d.split('').forEach((dd, colIndex) => {
		if (dd === 'X') {
			guardPathPositions.add(JSON.stringify([rowIndex, colIndex]));
		}
	});
});

orderedGuard = [...workableData];

const beginPosition = () => {
	const beginRow = orderedGuard
		.map((d, rowIndex) => (d.split('').findIndex((d) => d === 'O') > 0 ? rowIndex : 0))
		.filter((d) => d > 0)[0];
	const beginCol = orderedGuard
		.map((d) =>
			d.split('').findIndex((d) => d === 'O') > 0 ? d.split('').findIndex((d) => d === 'O') : 0
		)
		.filter((d) => d > 0)[0];

	return JSON.stringify([beginRow, beginCol]);
};

guardPathPositions.delete(beginPosition());

const arr: string[] = [...guardPathPositions];

const loopCount = new Set();

while (arr.length > 0) {
	const [relevantRowToPlaceObst, relevantColToPlaceObst]: [number, number] = JSON.parse(
		arr.shift()!
	);
	const relevantMapToModify = workableData.map((d) => d.split(''));
	relevantMapToModify[relevantRowToPlaceObst][relevantColToPlaceObst] = '@';

	watchGuard = true;
	currDir = dir.up;
	mapSeen.clear();
	seenObstacleTwice = false;

	orderedGuard = relevantMapToModify.map((d) => d.join(''));

	while (watchGuard) {
		if (rowOutOfBounds) {
			stopWatchingGuard(true);
			break;
		}

		const orderedVerticalLines = orderLines(orderedGuard, 'vertical');
		const orderedGuardToNorth = tiltGuard([...orderedVerticalLines], true);
		const faceNorth = orderLines(orderedGuardToNorth, 'vertical');

		findCurrentGuardPos(faceNorth);

		if (seenObstacleTwice) {
			loopCount.add(JSON.stringify([relevantRowToPlaceObst, relevantColToPlaceObst]));
			watchGuard = false;
			seenObstacleTwice = false;
			mapSeen.clear();
			break;
		} else if (rowOutOfBounds) {
			stopWatchingGuard(true);
			break;
		}

		const faceEast = orderLines(
			orderLines(
				faceNorth.reverse().map((f) => f.join('')),
				'vertical'
			).map((f) => f.join('')),
			'vertical'
		).map((f) => f.reverse());

		const orderedGuardToEast = tiltGuard([...faceEast], true).map((s) => s.split('').join(''));

		findCurrentGuardPos(faceEast);

		orderedGuard = orderedGuardToEast;
	}
}

console.log(loopCount);
console.log(loopCount.size);
