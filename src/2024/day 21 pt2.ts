// 193202 too high
// 188078 too high
// 186562 too high

const workableDataCodes = realDataCodes;

const shortestSequences = (codes: string[]) => {
	const getKeyPadPositions = (keypad: string[][]) =>
		keypad.reduce((acc, d, ri) => {
			let obj = {};

			d.forEach((c, ci) => {
				obj = { ...obj, [c]: [ri, ci] };
			});

			return { ...acc, ...obj };
		}, {});
	const numericKeypad = [
		['7', '8', '9'],
		['4', '5', '6'],
		['1', '2', '3'],
		['X', '0', 'A'],
	];
	const numericKeypadPositions: { [key: string]: [number, number] } =
		getKeyPadPositions(numericKeypad);
	const directionalKeypad = [
		['X', '^', 'A'],
		['<', 'v', '>'],
	];
	const directionKeyPadPositions: { [key: string]: [number, number] } =
		getKeyPadPositions(directionalKeypad);

	const panicGapChar = 'X';
	const numericKeypadInBounds = (row: number, col: number) =>
		row >= 0 &&
		row < numericKeypad.length &&
		col >= 0 &&
		col < numericKeypad[0].length &&
		numericKeypad[row][col] !== panicGapChar;
	const directionalKeyPadInBounds = (row: number, col: number) =>
		row >= 0 &&
		row < directionalKeypad.length &&
		col >= 0 &&
		col < directionalKeypad[0].length &&
		directionalKeypad[row][col] !== panicGapChar;

	const getSequence = (
		seqCode: string,
		keyPadPositions: {
			[key: string]: [number, number];
		},
		keyPadInBounds: (row: number, col: number) => boolean
	) => {
		const sequence = [];
		let prevKey = 'A';

		const getPathPieces = (a: string, b: string) => {
			const [r1, c1] = keyPadPositions[a];
			const [r2, c2] = keyPadPositions[b];
			const moveToPos = (char: string, a: number, b: number) => {
				return char.repeat(a - b);
			};

			const ud = r2 > r1 ? moveToPos('v', r2, r1) : moveToPos('^', r1, r2);
			const lr = c2 > c1 ? moveToPos('>', c2, c1) : moveToPos('<', c1, c2);

			let piece = `${ud}${lr}A`;

			if (c2 > c1 && keyPadInBounds(r2, c1)) {
				return piece;
			} else if (keyPadInBounds(r1, c2)) {
				piece = `${lr}${ud}A`;
			}

			return piece;
		};

		for (const key of seqCode) {
			sequence.push(getPathPieces(prevKey, key));
			prevKey = key;
		}

		return sequence;
	};

	const updateSeqTable = (
		seqTable: Map<string, number>,
		tableIndex: string,
		count: number,
		sequenceIndex: number
	) => seqTable.set(tableIndex, (seqTable.get(tableIndex) || 0) + count * sequenceIndex);
	const seqCounts = (code: string) =>
		getSequence(code, directionKeyPadPositions, directionalKeyPadInBounds).reduce(
			(seqTable, s) => updateSeqTable(seqTable, s, 1, 1),
			new Map()
		);

	let seqTables = codes.map((code) => ({
		code,
		sequence: new Map([
			[getSequence(code, numericKeypadPositions, numericKeypadInBounds).join(''), 1],
		]),
	}));

	for (let i = 0; i < 25; i++) {
		seqTables = seqTables.map((seqTable) => {
			const subSeqTable = new Map();

			seqTable.sequence.forEach((seq, index) =>
				seqCounts(index).forEach((count, s) => updateSeqTable(subSeqTable, s, count, seq))
			);

			return { code: seqTable.code, sequence: subSeqTable };
		});
	}

	console.log(seqTables);

	return seqTables;
};

const complexity = shortestSequences(workableDataCodes).reduce((acc, d) => {
	const extractedDigits = d.code.match(/\d+/g)![0];
	const digits = parseInt(extractedDigits, 10);
	const sequenceLength = [...d.sequence.entries()].reduce(
		(acc, e) => (acc += e[0].length * e[1]),
		0
	);

	return (acc += digits * sequenceLength);
}, 0);

console.log(complexity);
