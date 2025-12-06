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

const orderedVerticalLines = orderLines(realData, 'vertical');

const swapChars = (string: string, from: number, to: number) => {
	const charArray = string.split('');

	[charArray[from], charArray[to]] = [charArray[to], charArray[from]];

	return charArray.join('');
};

let totalLoad = 0;

const orderedRocksToNorth = [...orderedVerticalLines].map((line) => {
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

orderedRocksToNorth.forEach((line) => {
	line.split('').forEach((char, charIndex) => {
		if (char === 'O') {
			totalLoad += line.length - charIndex;
		}
	});
});

console.log(totalLoad);
