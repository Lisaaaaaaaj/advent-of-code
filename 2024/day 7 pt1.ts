const workableData = [...realData.split(/\n\t/)].map((d) => {
	const [total, rest] = d.split(/:/);
	const splittedRest = rest
		.trim()
		.replaceAll(/\s/g, ' 0 ')
		.split(' ')
		.map((d) => parseInt(d, 10));
	const combinationsLength = splittedRest.filter((d) => d === 0).length;

	return {
		total: parseInt(total, 10),
		combinations: [] as (string | number)[][],
		rest: splittedRest,
		combinationsLength,
	};
});

const findAllEquationCombinations = () => {
	workableData.map((d) => {
		const characters = ['+', '*'];
		const combinations = (relArr: string[], minCombi: number, maxCombi: number) =>
			[...Array(maxCombi).keys()]
				.reduce(
					(result) => relArr.concat(result.flatMap((val) => relArr.map((char) => val + char))),
					['']
				)
				.filter((val) => val.length >= minCombi);

		[...new Set(combinations(characters, d.combinationsLength, d.combinationsLength))].forEach(
			(eq) => {
				const numbers = d.rest;
				const replacements = eq.split('');
				const mixIt = numbers.map((v) => v || replacements.shift()!);

				d.combinations.push(mixIt);
			}
		);
	});

	return workableData;
};
const allEquationCombinations = findAllEquationCombinations();

const chooseOperator: { [key: string]: (arg0: number, arg1: number) => number } = {
	'+': (a: number, b: number) => (a += b),
	'*': (a: number, b: number) => (a *= b),
};

const totalCalibrationResults = allEquationCombinations
	.map((d) => {
		const { total, combinations } = d;

		const nums: number[] = [];

		while (combinations.length) {
			const combination = combinations.shift()!;

			let num = combination.shift()!;

			while (combination.length) {
				num = chooseOperator[combination[0] as string](num as number, combination[1] as number);
				combination.splice(0, 2);
			}

			nums.push(num as number);
		}

		return [...new Set(nums.filter((n) => n === total))];
	})
	.filter((n) => n.length)
	.reduce((acc, d) => (acc += d[0]), 0);

console.log(totalCalibrationResults);
