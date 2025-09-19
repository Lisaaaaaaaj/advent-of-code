// 4784 too low
// 32768 too high
// 81617 not the right answer

// 16076 right answer: I ignored signalsList.get(value.needs[0]) being 0 and had to look for it to not be undefined instead and preserve 0 if true

type GateType = 'OR' | 'AND' | 'NOT' | 'LSHIFT' | 'RSHIFT' | null;
type WireList = { [key: string]: number };
type DestinationList = { [key: string]: { needs: string[]; type: GateType; num: number } };
type WorkableData = { wireList: WireList; destinationList: DestinationList };
const workableData: WorkableData = { wireList: {}, destinationList: {} };

[...realData.split(/\n|\t/g).filter((d) => d.length)].forEach((d) => {
	const [wire1, type, wire2, output] = d.split(/\s/g).filter((f) => !f.includes('->'));

	if (!wire2 && !output && type !== 'a') {
		workableData.wireList[type] = parseInt(wire1.trim(), 10);
	} else if (!wire2 && !output && type === 'a') {
		workableData.destinationList[type] = { needs: [wire1], type: null, num: 0 };
	} else if (!output) {
		workableData.destinationList[wire2] = { needs: [type], type: wire1 as GateType, num: 0 };
	} else if (type === 'LSHIFT' || type === 'RSHIFT') {
		workableData.destinationList[output] = {
			needs: [wire1],
			type: type as GateType,
			num: parseInt(wire2, 10) as number,
		};
	} else if (parseInt(wire1, 10)) {
		workableData.destinationList[output] = {
			needs: [wire2],
			type: type as GateType,
			num: parseInt(wire1, 10) as number,
		};
	} else if (parseInt(wire2, 10)) {
		workableData.destinationList[output] = {
			needs: [wire1],
			type: type as GateType,
			num: parseInt(wire2, 10) as number,
		};
	} else {
		workableData.destinationList[output] = {
			needs: [wire1, wire2],
			type: type as GateType,
			num: 0,
		};
	}
});

const produceSignals = (data: WorkableData) => {
	const signalsList: Map<string, number> = new Map();
	const visitedSignals: Set<string> = new Set();

	const wireList = data.wireList;
	const destinationList = Object.entries(data.destinationList);

	Object.entries(wireList).forEach((w) => {
		signalsList.set(w[0], w[1]);
	});

	const updateSignalsList = (key: string, bit1: number, bit2: number, type: GateType) => {
		let relevantBitValue = 0;
		const sixteenBitNumber = 65535;

		switch (type) {
			case 'AND':
				relevantBitValue = bit1 & bit2;
				break;
			case 'OR':
				relevantBitValue = bit1 | bit2;
				break;
			case 'NOT':
				relevantBitValue = sixteenBitNumber - bit1;
				break;
			case 'LSHIFT':
				relevantBitValue = bit1 << bit2;
				break;
			case 'RSHIFT':
				relevantBitValue = bit1 >>> bit2;
				break;
			case null:
				relevantBitValue = signalsList.get('lx')!;
				break;
		}

		if (!visitedSignals.has(key)) {
			signalsList.set(key, relevantBitValue);
			visitedSignals.add(key);
		}
	};

	const endSignal = destinationList.sort().shift()!;
	const signalsQueue = [...destinationList].sort(
		(a, b) => (a[0].length === 1 ? 0 : 1) - (b[0].length === 1 ? 0 : 1)
	);
	signalsQueue.push(endSignal);

	while (signalsQueue.length > 0) {
		const currentBit = signalsQueue.shift()!;
		const [bit, value] = currentBit;
		const type = value.type;

		if (visitedSignals.has(bit)) {
			continue;
		}

		if (type === 'AND') {
			const bit1 = value.num ? value.num : signalsList.get(value.needs[0])!;
			const bit2 = value.num ? signalsList.get(value.needs[0])! : signalsList.get(value.needs[1])!;

			updateSignalsList(bit, bit1, bit2, type);
		} else if (type === 'NOT') {
			updateSignalsList(bit, signalsList.get(value.needs[0])!, 0, type);
		} else {
			const bit1 =
				signalsList.get(value.needs[0]) !== undefined ? signalsList.get(value.needs[0]) : value.num;
			const bit2 =
				signalsList.get(value.needs[1]) !== undefined ? signalsList.get(value.needs[1]) : value.num;

			updateSignalsList(bit, bit1 || 0, bit2 || 0, type);
		}
	}

	return [...signalsList].sort();
};

const producedSignals = produceSignals(workableData);
const ans = producedSignals[0][1];

console.log(ans);
