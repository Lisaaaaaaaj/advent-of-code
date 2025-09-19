type GateType = 'OR' | 'AND' | 'XOR';
type WireList = { [key: string]: number };
type DestinationList = { [key: string]: { needs: string[]; type: GateType } };
type WorkableData = {
	wireList: WireList;
	destinationList: DestinationList;
	x: string;
	y: string;
	invalidXORZs: { z: string; type: GateType }[];
};
const workableData: WorkableData = {
	wireList: {},
	destinationList: {},
	x: '',
	y: '',
	invalidXORZs: [],
};
const swappedBits: string[] = [];

/*
			So the thing is, z30 should have (via in between bits perhaps) x30 and y30
			If this is not the case, then well thats a fault? So then I have to look for the correct dest bit...????

			I should swap the destination bits, not the supporting bits!!!!

			CORRECT:

			1010110101100111110110010110001100011011100110
			47665385096934

			WRONG:

			1010110101101000110110010110010100101100000110
			47666458872582

	*/

[...realData.split(/\n|\t/g).filter((d) => d.length)].forEach((d) => {
	if (d.includes(':')) {
		const [wire, val] = d.split(':');

		if (wire.includes('x')) {
			workableData.x += val.trim();
		} else if (wire.includes('y')) {
			workableData.y += val.trim();
		}

		workableData.wireList[wire] = parseInt(val.trim(), 10);
	} else {
		const [wire1, type, wire2, output] = d.split(/\s/g).filter((f) => !f.includes('->'));

		workableData.destinationList[output] = { needs: [wire1, wire2], type: type as GateType };

		if (output.charAt(0) === 'z' && output !== 'z00' && output !== 'z45') {
			if (type !== 'XOR') {
				workableData.invalidXORZs.push({ z: output, type: type as GateType });
			} else {
				const relevantDestinations = Object.entries(workableData.destinationList).filter((f) =>
					f[1].needs.includes(`x${output.slice(1)}`)
				);

				if (relevantDestinations) {
					const possibleRelevantDestinationsToSwap = relevantDestinations;
					const destIsXORAND = relevantDestinations.length === 2;

					if (destIsXORAND) {
						const relevantOR = Object.entries(workableData.destinationList).filter(
							(f) =>
								relevantDestinations.find((ff) => f[1].needs.includes(ff[0])) && f[1].type === 'OR'
						)[0];

						if (relevantOR) {
							const relevantAnds = relevantOR[1].needs;

							const foundCorrectAnd =
								relevantDestinations.filter((f) => {
									return relevantAnds.includes(f[0]) && f[1].type === 'AND';
								}).length > 0;

							if (!foundCorrectAnd) {
								const a = workableData.destinationList[possibleRelevantDestinationsToSwap[0][0]];
								const b = workableData.destinationList[possibleRelevantDestinationsToSwap[1][0]];
								workableData.destinationList[possibleRelevantDestinationsToSwap[0][0]] = b;
								workableData.destinationList[possibleRelevantDestinationsToSwap[1][0]] = a;

								swappedBits.push(possibleRelevantDestinationsToSwap[0][0]);
								swappedBits.push(possibleRelevantDestinationsToSwap[1][0]);
							}
						}
					}
				}
			}
		}
	}
});

workableData.invalidXORZs.forEach((d) => {
	const relevantDestination = Object.entries(workableData.destinationList).filter(
		(f) => f[1].needs.includes(`x${d.z.slice(1)}`) && f[1].type === 'XOR'
	)[0];
	const relevantInBetweenDestinations = Object.entries(workableData.destinationList).filter(
		(f) => f[1].needs.includes(relevantDestination[0]) && f[1].type === 'XOR'
	)[0];
	const zDestination = workableData.destinationList[d.z];

	swappedBits.push(d.z);
	swappedBits.push(relevantInBetweenDestinations[0]);

	workableData.destinationList[d.z] = relevantInBetweenDestinations[1];
	workableData.destinationList[relevantInBetweenDestinations[0]] = zDestination;
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
				relevantBitValue = bit1 === 1 && bit1 === bit2 ? 1 : 0;
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

const xBits = `0b${[...workableData.x.split('')].reverse().join('')}`;
const yBits = `0b${[...workableData.y.split('')].reverse().join('')}`;
const correctAdditionBitsInDecimal = Number(xBits) + Number(yBits);
const correctAdditionBits = correctAdditionBitsInDecimal.toString(2);

const producedBits = produceBits(workableData);
const zBits = producedBits.filter((b) => b[0].charAt(0) === 'z').reverse();
const bitsAndBytes = zBits.map((b) => b[1]);
const bitsInDecimal = Number(`0b${bitsAndBytes.join('')}`);

console.log('correct', correctAdditionBits);
console.log('correct', correctAdditionBitsInDecimal);

console.log('wronggg (well, fixed)', bitsInDecimal.toString(2));
console.log('wronggg (well, fixed)', bitsInDecimal);

console.log(workableData);

const ans = swappedBits.sort().join(',');

console.log(ans);
