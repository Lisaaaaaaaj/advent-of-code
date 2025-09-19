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

const swapChars = (string: string, from: number, to: number) => {
	const charArray = string.split('');

	[charArray[from], charArray[to]] = [charArray[to], charArray[from]];

	return charArray.join('');
};

let totalLoad = 0;

const tiltRocks = (lines: string[][]) => {
	return lines.map((line) => {
		const splittedLines = line
			.join('')
			.split(/(#)/g)
			.filter((sp) => sp.length);
		const groupedChunks = [...splittedLines.map((sp) => [...sp.matchAll(/O/g)])];

		const orderedRocks = [...splittedLines];

		groupedChunks.forEach((chunk, chunkIndex) => {
			let orderedChunks = '';

			chunk.forEach((ch) => {
				if (!orderedChunks.length) {
					orderedChunks = ch.input;
				}

				const dotIndex = orderedChunks.indexOf('.');

				if (dotIndex !== -1 && dotIndex < ch.index) {
					orderedChunks = swapChars(orderedChunks, ch.index, dotIndex);
					orderedRocks[chunkIndex] = orderedChunks;
				}
			});
		});

		return orderedRocks.filter((sp) => sp.length).join('');
	});
};

let cycledRocks: string[] = [];

const cycleRocks = (orderedRocks: string[], times: number) => {
	if (times === 0) {
		cycledRocks = orderedRocks;

		return undefined;
	}

	const orderedVerticalLines = orderLines(orderedRocks, 'vertical');
	const orderedRocksToNorth = tiltRocks([...orderedVerticalLines]);

	const faceNorth = orderLines(orderedRocksToNorth, 'vertical');

	const orderedRocksToWest = tiltRocks([...faceNorth]);
	const faceWest = orderLines(orderedRocksToWest, 'vertical').map((s) => s.reverse());

	const orderedRocksToSouth = tiltRocks([...faceWest]);
	const faceSouth = orderLines(orderedRocksToSouth, 'vertical').reverse();

	const faceEast = orderLines(
		orderLines(
			faceSouth.reverse().map((f) => f.join('')),
			'vertical'
		).map((f) => f.join('')),
		'vertical'
	).map((f) => f.reverse());
	const orderedRocksToEast = tiltRocks([...faceEast])
		.reverse()
		.map((s) => s.split('').reverse().join(''));

	cycleRocks(orderedRocksToEast, (times -= 1));
};
cycleRocks(realData, 1);

for (let j = 0; j < 999; j++) {
	cycleRocks(cycledRocks, 1);
}

cycledRocks.forEach((line, lineIndex) => {
	const amountOfRocks = line.match(/O/g)?.length || 0;
	if (amountOfRocks) {
		totalLoad += (line.length - lineIndex) * amountOfRocks;
	}
});

console.log(totalLoad);
