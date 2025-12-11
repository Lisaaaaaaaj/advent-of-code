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

const swapChars = (string: string, from: number, to: number) => {
	const charArray = string.split('');

	[charArray[from], charArray[to]] = [charArray[to], charArray[from]];

	const charArrayModified = charArray.map((d, index) =>
		index > 0 && index <= from && d === '.' ? 'X' : d
	);

	return charArrayModified.join('');
};

let takenSteps = 0;

let rowOutOfBounds = false;
let orderedGuard = [...realData];

const tiltGuard = (lines: string[][]) => {
	const modifiedLines = lines.map((line) => {
		const splittedLines = line
			.join('')
			.split(/(#)/g)
			.filter((sp) => sp.length);
		const groupedChunks = [...splittedLines.map((sp) => [...sp.matchAll(/O/g)])];

		const orderedGuard = [...splittedLines];

		groupedChunks.forEach((chunk, chunkIndex) => {
			let orderedChunks = '';

			chunk.forEach((ch) => {
				if (!orderedChunks.length) {
					orderedChunks = ch.input;
				}

				const dotIndex =
					orderedChunks.indexOf('.') !== -1
						? orderedChunks.indexOf('.')
						: orderedChunks.indexOf('X');

				if (dotIndex !== -1 && dotIndex < ch.index) {
					orderedChunks = swapChars(orderedChunks, ch.index, dotIndex);
					orderedGuard[chunkIndex] = orderedChunks;
				}
			});
		});

		return orderedGuard.filter((sp) => sp.length).join('');
	});

	const orderedRow = orderLines(modifiedLines, 'vertical');
	const firstRow = orderedRow[0].find((d) => d === 'O');
	const lastRow = orderedRow[modifiedLines.length - 1]?.find((d) => d === 'O');

	const findOutOfBounds = [
		firstRow && currDir === dir.down,
		firstRow && currDir === dir.up,
		lastRow && currDir === dir.up,
		lastRow && currDir === dir.down,
		firstRow && currDir === dir.left,
		firstRow && currDir === dir.right,
		lastRow && currDir === dir.left,
		lastRow && currDir === dir.right,
	].some((d) => d);

	if (findOutOfBounds) {
		rowOutOfBounds = true;
		orderedGuard = modifiedLines;

		return modifiedLines;
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

	return modifiedLines;
};

let cycledGuard: string[] = [];

const stopWatchingGuard = () => {
	takenSteps += orderedGuard.reduce(
		(acc, d) => acc + d.split('').filter((dd) => dd === 'X').length,
		1
	);
	cycledGuard = orderedGuard;
	watchGuard = false;
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

console.log(cycledGuard);
console.log(takenSteps);
