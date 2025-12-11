let id = 0;

const representFileBlocks = () => {
	const workableData: string[] = [];

	[...realData.split('')].forEach((d, index) => {
		const freeSpace = index % 2;
		if (freeSpace) {
			for (let i = 0; i < parseInt(d, 10); i++) {
				workableData.push('.');
			}
		} else {
			for (let i = 0; i < parseInt(d, 10); i++) {
				workableData.push(id.toString());
			}
			id += 1;
		}
	});

	return workableData;
};
const fileBlocks = representFileBlocks();
console.log(fileBlocks);

const swapChars = (arr: string[], from: number, to: number) => {
	const charArray = arr;

	[charArray[from], charArray[to]] = [charArray[to], charArray[from]];

	return charArray;
};

const indexesAintSequential = (arr: number[]) => {
	for (let i = 0; i < arr.length - 1; i++) {
		if (arr[i] + 1 !== arr[i + 1]) {
			return arr[i + 1];
		}
	}

	return null;
};

const getAllFreeSpaces = (arr: number[], spaceLength: number) => {
	const result = arr.reduce((acc, _, i) => {
		if (i + spaceLength <= arr.length) {
			acc.push(arr.slice(i, i + spaceLength));
		} else {
			acc.push(arr.slice(i, i + spaceLength).concat(arr.slice(0, (i + spaceLength) % arr.length)));
		}

		return acc;
	}, [] as number[][]);

	return result;
};

const orderFileBlocks = () => {
	let relevantFileBlocks = [...fileBlocks];

	while (id > 0) {
		const relevantWholeFile = [...relevantFileBlocks.filter((d) => d === id.toString())];
		let filesFitAtFreeSpace = true;

		const relFileIndex = [...relevantFileBlocks].indexOf(relevantWholeFile[0]);
		let freeSpace = [...relevantFileBlocks].map((d, i) => (d === '.' ? i : 0)).filter((d) => d > 0);

		freeSpace = getAllFreeSpaces(freeSpace, relevantWholeFile.length).filter(
			(space) => space.every((sp) => sp < relFileIndex) && !indexesAintSequential(space)
		)[0];

		if (!freeSpace || freeSpace.length < relevantWholeFile.length) {
			freeSpace = [];
		}

		if (!freeSpace.length) {
			filesFitAtFreeSpace = false;
		} else if (filesFitAtFreeSpace) {
			for (let i = 0; i < relevantWholeFile.length; i++) {
				const relFileIindex = relevantFileBlocks.lastIndexOf(relevantWholeFile[0]);

				relevantFileBlocks = swapChars(relevantFileBlocks, relFileIindex, freeSpace[i]);
			}
		}

		id -= 1;
	}

	return relevantFileBlocks;
};
const orderedFileBlock = orderFileBlocks();
console.log(orderedFileBlock.join(''));

const checksum = orderedFileBlock.reduce(
	(acc, d, index) => (acc += d === '.' ? 0 : parseInt(d, 10) * index),
	0
);

console.log(checksum);
