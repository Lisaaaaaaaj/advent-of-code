// 62557430428922 too high
// 65247765150414 too high
// 108309556 too low
// 64603108026594 not the right answer

type GateType = 'OR' | 'AND' | 'XOR';
type WireList = { [key: string]: number };
type DestinationList = { [key: string]: { needs: string[]; type: GateType } };
type WorkableData = { wireList: WireList; destinationList: DestinationList };
const workableData: WorkableData = { wireList: {}, destinationList: {} };

[...realData.split(/\n|\t/g).filter((d) => d.length)].forEach((d) => {
	if (d.includes(':')) {
		const [wire, val] = d.split(':');

		workableData.wireList[wire] = parseInt(val.trim(), 10);
	} else {
		const [wire1, type, wire2, output] = d.split(/\s/g).filter((f) => !f.includes('->'));

		workableData.destinationList[output] = { needs: [wire1, wire2], type: type as GateType };
	}
});

const produceBits = (data: WorkableData) => {
	const bitsList: Map<string, number> = new Map();
	const visitedBits: Set<string> = new Set();

	const wireList = data.wireList;
	const destinationList = Object.entries(data.destinationList);

	const currentBitNeedsAreXOrY = (needs: string[]) =>
		needs.every((b) => b.charAt(0) === 'x' || b.charAt(0) === 'y');

	const updateBitsList = (key: string, bit1: number, bit2: number, type: GateType) => {
		let relevantBitValue = 0;

		switch (type) {
			case 'AND':
				relevantBitValue = bit1 === 1 && bit1 === bit2 ? 1 : 0; // lol I forgot to add bit1 === 1 !!!
				break;
			case 'OR':
				relevantBitValue = bit1 === 1 || bit2 === 1 ? 1 : 0;
				break;
			case 'XOR':
				relevantBitValue = bit1 !== bit2 ? 1 : 0;
				break;
		}

		if (!visitedBits.has(key)) {
			bitsList.set(key, relevantBitValue);
			visitedBits.add(key);
		}
	};

	const bitsQueue = [...destinationList].sort(
		(a, b) =>
			(currentBitNeedsAreXOrY(a[1].needs) ? 0 : 1) - (currentBitNeedsAreXOrY(b[1].needs) ? 0 : 1)
	);

	while (bitsQueue.length > 0) {
		const currentBit = bitsQueue.shift()!;
		const [bit, value] = currentBit;

		if (visitedBits.has(bit)) {
			continue;
		}

		if (currentBitNeedsAreXOrY(value.needs)) {
			updateBitsList(bit, wireList[value.needs[0]], wireList[value.needs[1]], value.type);
			visitedBits.add(bit);
		} else {
			const nestedBitsQueue: { key: string; needs: string[] }[] = [
				{ key: bit, needs: value.needs },
			];

			while (nestedBitsQueue.length > 0) {
				const currentNestedBitQueue = nestedBitsQueue.shift()!;
				const currentNestedBitsAreInTheBitsList = currentNestedBitQueue.needs.every(
					(b) => bitsList.get(b) !== undefined
				);
				const type = destinationList.find((f) => f[0] === currentNestedBitQueue.key)![1].type;

				if (currentBitNeedsAreXOrY(currentNestedBitQueue.needs)) {
					updateBitsList(
						currentNestedBitQueue.key,
						wireList[currentNestedBitQueue.needs[0]],
						wireList[currentNestedBitQueue.needs[1]],
						type
					);
					visitedBits.add(currentNestedBitQueue.key);

					continue;
				}

				if (currentNestedBitsAreInTheBitsList) {
					const [bit1, bit2] = currentNestedBitQueue.needs;

					updateBitsList(currentNestedBitQueue.key, bitsList.get(bit1)!, bitsList.get(bit2)!, type);
				} else {
					const findRelevantNeedsDestinationKey = (dest: number) =>
						destinationList.find((d) => d[0] === currentNestedBitQueue.needs[dest])!;
					const bit1 = findRelevantNeedsDestinationKey(0);
					const bit2 = findRelevantNeedsDestinationKey(1);

					nestedBitsQueue.unshift({ key: bit1[0], needs: bit1[1].needs });
					nestedBitsQueue.unshift({ key: bit2[0], needs: bit2[1].needs });
					nestedBitsQueue.push(currentNestedBitQueue);
				}
			}
		}
	}

	return [...bitsList].sort();
};

const producedBits = produceBits(workableData);
console.log(producedBits);
const zBits = producedBits.filter((b) => b[0].charAt(0) === 'z').reverse();
const bitsAndBytes = zBits.map((b) => b[1]);

const ans = Number(`0b${bitsAndBytes.join('')}`);

console.log(ans);
