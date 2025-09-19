const workableDataProgram = realData.match(/\d+/g)!.map(BigInt);

const [A, B, C, ...program] = workableDataProgram;

type RegisterName = 'A' | 'B' | 'C';

const memoryKeys: RegisterName[] = ['A', 'B', 'C'];

const bigIntPow = (base: bigint, exp: bigint) => {
	let result = BigInt(1);

	for (let i = BigInt(0); i < exp; i++) {
		result *= base;
	}

	return result;
};

const findProgramOutput = (registers: { [key: string]: bigint }, outputProgram: bigint[]) => {
	const output: bigint[] = [];

	for (let i = 0; i < outputProgram.length; ) {
		const op = outputProgram[i];
		const literal = outputProgram[i + 1];
		const combo =
			outputProgram[i + 1] <= 3
				? outputProgram[i + 1]
				: registers[memoryKeys[Number(outputProgram[i + 1]) - 4]];

		switch (op) {
			case 0n:
				registers['A'] = registers['A'] / bigIntPow(2n, combo);
				break;
			case 1n:
				registers['B'] ^= literal;
				break;
			case 2n:
				registers['B'] = combo % 8n;
				break;
			case 3n:
				if (registers['A'] !== 0n) {
					i = Number(literal);
					continue;
				}
				break;
			case 4n:
				registers['B'] ^= registers['C'];
				break;
			case 5n:
				output.push(combo % 8n);
				break;
			case 6n:
				registers['B'] = registers['A'] / bigIntPow(2n, combo);
				break;
			case 7n:
				registers['C'] = registers['A'] / bigIntPow(2n, combo);
				break;
		}

		i += 2;
	}

	return output;
};

const findLowestInitialRegisterAValue = () => {
	const seen: { result: string; size: number }[] = [];
	seen.push({ result: '', size: 0 });

	let lowestRegisterA = 0;

	while (seen.length > 0) {
		const q = seen.shift()!;

		if (q.size === program.length) {
			lowestRegisterA = parseInt(q.result, 2);
			break;
		}

		const from = parseInt(`${q.result}000`, 2);
		const to = parseInt(`${q.result}111`, 2);
		const expect = program.slice((q.size + 1) * -1).join(',');

		for (let a = from; a <= to; a++) {
			const r = findProgramOutput({ A: BigInt(a), B, C }, program);

			if (r.join(',') === expect) {
				seen.push({ result: a.toString(2), size: q.size + 1 });
			}
		}
	}

	return lowestRegisterA;
};

const ans = findLowestInitialRegisterAValue();

console.log(ans);
