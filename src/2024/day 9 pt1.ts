const representFileBlocks = () => {
	const workableData: string[] = [];
	let id = 0;

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

	charArray.pop();

	return charArray;
};

const orderFileBlocks = () => {
	let orderedFileBlock = fileBlocks;

	while (orderedFileBlock.indexOf('.') !== -1) {
		orderedFileBlock = swapChars(
			orderedFileBlock,
			orderedFileBlock.length - 1,
			orderedFileBlock.indexOf('.')
		);
	}

	return orderedFileBlock;
};
const orderedFileBlock = orderFileBlocks();
console.log(orderedFileBlock.join(''));

const checksum = orderedFileBlock.reduce((acc, d, index) => (acc += parseInt(d, 10) * index), 0);

console.log(checksum);
