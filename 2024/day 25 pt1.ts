// 250 too low
// 4105 too high

const workableData = [...realData.split(/\n/g)]
	.map((d) => d.split(/\t/)[1])
	.reduce((acc, d) => {
		const nextOne: string[] = [];

		if (!d) {
			return [...acc, nextOne];
		} else {
			acc[acc.length - 1].push(d);
		}

		return [...acc];
	}, [] as string[][]);

const keys = workableData.filter((d) => [...d[0]].every((p) => p === '.'));
const locks = workableData.filter((d) => [...d[0]].every((p) => p === '#'));

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

const pairs = new Map();

locks.forEach((lock, lockIndex) => {
	keys.forEach((key, keyIndex) => {
		const modifiedLock = orderLines(lock, 'vertical');
		const modifiedKey = orderLines(key, 'vertical');

		pairs.set(`${lockIndex}-${keyIndex}`, true);

		for (let i = 0; i < modifiedLock.length; i++) {
			for (let j = 1; j < modifiedLock[i].length - 1; j++) {
				const hasOverlap = modifiedLock[i][j] === modifiedKey[i][j] && modifiedLock[i][j] === '#';

				if (hasOverlap) {
					pairs.set(`${lockIndex}-${keyIndex}`, false);
					break;
				}
			}
		}
	});
});

const merryChristmas = [...pairs].filter((f) => f[1]).length;

console.log(pairs);
console.log(merryChristmas);
